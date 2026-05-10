package com.estore.catalog.admin.service;

import com.estore.billing.entity.Order;
import com.estore.billing.entity.OrderStatus;
import com.estore.billing.repository.OrderItemRepository;
import com.estore.billing.repository.OrderRepository;
import com.estore.catalog.admin.dto.AdminStatisticsDTO;
import com.estore.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStatisticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Transactional(readOnly = true)
    public AdminStatisticsDTO getStatistics() {

        // Overview counts
        long totalProducts = productRepository.count();
        long activeProducts = productRepository.countByActiveTrue();
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        long totalCustomers = orderRepository.countDistinctCustomers();
        long lowStockProducts = productRepository.countByStockQuantityLessThanAndActiveTrue(5);

        // Order status breakdown
        List<Object[]> statusRows = orderRepository.countByStatus();
        List<AdminStatisticsDTO.StatusCount> ordersByStatus = statusRows.stream()
                .map(row -> AdminStatisticsDTO.StatusCount.builder()
                        .status(((OrderStatus) row[0]).name())
                        .count((Long) row[1])
                        .build())
                .collect(Collectors.toList());

        // Top selling products (by quantity)
        List<Object[]> topSellingRows = orderItemRepository.findTopSellingProducts(PageRequest.of(0, 10));
        List<AdminStatisticsDTO.TopProduct> topSellingProducts = topSellingRows.stream()
                .map(this::mapTopProduct)
                .collect(Collectors.toList());

        // Top revenue products
        List<Object[]> topRevenueRows = orderItemRepository.findTopRevenueProducts(PageRequest.of(0, 10));
        List<AdminStatisticsDTO.TopProduct> topRevenueProducts = topRevenueRows.stream()
                .map(this::mapTopProduct)
                .collect(Collectors.toList());

        // Revenue by category
        List<Object[]> catRevenueRows = orderItemRepository.findRevenueByCategory();
        List<AdminStatisticsDTO.CategoryRevenue> revenueByCategory = catRevenueRows.stream()
                .map(row -> AdminStatisticsDTO.CategoryRevenue.builder()
                        .categoryName((String) row[0])
                        .totalRevenue((BigDecimal) row[1])
                        .totalOrders((Long) row[2])
                        .build())
                .collect(Collectors.toList());

        // Recent orders
        List<Order> recentOrderEntities = orderRepository.findRecentOrders(PageRequest.of(0, 10));
        List<AdminStatisticsDTO.RecentOrder> recentOrders = recentOrderEntities.stream()
                .map(o -> AdminStatisticsDTO.RecentOrder.builder()
                        .orderId(o.getId())
                        .orderNumber(o.getOrderNumber())
                        .customerName(o.getUser().getFirstName() + " " + o.getUser().getLastName())
                        .totalAmount(o.getTotalAmount())
                        .status(o.getStatus().name())
                        .orderDate(o.getOrderDate() != null ? o.getOrderDate().format(DATE_FMT) : "")
                        .build())
                .collect(Collectors.toList());

        return AdminStatisticsDTO.builder()
                .totalProducts(totalProducts)
                .activeProducts(activeProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalCustomers(totalCustomers)
                .lowStockProducts(lowStockProducts)
                .ordersByStatus(ordersByStatus)
                .topSellingProducts(topSellingProducts)
                .topRevenueProducts(topRevenueProducts)
                .revenueByCategory(revenueByCategory)
                .recentOrders(recentOrders)
                .build();
    }

    private AdminStatisticsDTO.TopProduct mapTopProduct(Object[] row) {
        return AdminStatisticsDTO.TopProduct.builder()
                .productId((Long) row[0])
                .productName((String) row[1])
                .imageUrl((String) row[2])
                .categoryName((String) row[3])
                .totalQuantitySold((Long) row[4])
                .totalRevenue((BigDecimal) row[5])
                .build();
    }
}
