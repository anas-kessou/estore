package com.estore.billing.service;

import com.estore.billing.dto.*;
import com.estore.billing.entity.Order;
import com.estore.billing.entity.OrderItem;
import com.estore.billing.entity.OrderStatus;
import com.estore.billing.repository.OrderItemRepository;
import com.estore.billing.repository.OrderRepository;
import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.entity.User;
import com.estore.exception.BadRequestException;
import com.estore.exception.InsufficientStockException;
import com.estore.exception.ResourceNotFoundException;
import com.estore.inventory.service.InventoryService;
import com.estore.shared.dto.PageResponse;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.entity.CartItem;
import com.estore.shopping.repository.CartRepository;
import com.estore.shopping.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrder(Long userId, CreateOrderRequest request) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create order with empty cart");
        }

        // Validate stock for all items
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new InsufficientStockException(product.getId(), cartItem.getQuantity(),
                        product.getStockQuantity());
            }
        }

        // Calculate total
        BigDecimal totalAmount = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create order
        Order order = Order.builder()
                .orderNumber("ORD-" + System.currentTimeMillis())
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .shippingCity(request.getShippingCity())
                .shippingCountry(request.getShippingCountry())
                .shippingPostalCode(request.getShippingPostalCode())
                .shippingPhone(request.getShippingPhone())
                .notes(request.getNotes())
                .build();

        User user = new User();
        user.setId(userId);
        order.setUser(user);

        // Add order items and decrement stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .productImageUrl(product.getImageUrl())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .build();

            order.addItem(orderItem);

            // Decrement inventory
            inventoryService.decrementStock(product.getId(), cartItem.getQuantity());
        }

        order = orderRepository.save(order);

        // Clear the cart
        cartService.clearCart(userId);

        return toOrderDTO(order);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDTO> getOrdersByUserId(Long userId, int page, int size) {
        Page<Order> orderPage = orderRepository.findByUserIdOrderByOrderDateDesc(
                userId, PageRequest.of(page, size, Sort.by("orderDate").descending()));

        List<OrderDTO> orders = orderPage.getContent().stream()
                .map(this::toOrderDTO)
                .collect(Collectors.toList());

        return PageResponse.<OrderDTO>builder()
                .content(orders)
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .first(orderPage.isFirst())
                .last(orderPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return toOrderDTO(order);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return toOrderDTO(order);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        order = orderRepository.save(order);

        // If order is cancelled, restore stock
        if (status == OrderStatus.CANCELLED && oldStatus != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                inventoryService.incrementStock(item.getProduct().getId(), item.getQuantity());
            }
        }

        return toOrderDTO(order);
    }

    private OrderDTO toOrderDTO(Order order) {
        List<OrderItemDTO> items = order.getItems().stream()
                .map(this::toOrderItemDTO)
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingAddress(order.getShippingAddress())
                .shippingCity(order.getShippingCity())
                .shippingCountry(order.getShippingCountry())
                .shippingPostalCode(order.getShippingPostalCode())
                .shippingPhone(order.getShippingPhone())
                .notes(order.getNotes())
                .userId(order.getUser().getId())
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private OrderItemDTO toOrderItemDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .productImageUrl(item.getProductImageUrl())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build();
    }
}
