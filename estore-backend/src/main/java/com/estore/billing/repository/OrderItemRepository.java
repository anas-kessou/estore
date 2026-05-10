package com.estore.billing.repository;

import com.estore.billing.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByProductId(Long productId);

    @Query("SELECT oi.product.id, oi.productName, oi.product.imageUrl, oi.product.category.name, " +
           "SUM(oi.quantity), SUM(oi.quantity * oi.unitPrice) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status <> com.estore.billing.entity.OrderStatus.CANCELLED " +
           "AND oi.order.status <> com.estore.billing.entity.OrderStatus.REFUNDED " +
           "GROUP BY oi.product.id, oi.productName, oi.product.imageUrl, oi.product.category.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProducts(Pageable pageable);

    @Query("SELECT oi.product.id, oi.productName, oi.product.imageUrl, oi.product.category.name, " +
           "SUM(oi.quantity), SUM(oi.quantity * oi.unitPrice) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status <> com.estore.billing.entity.OrderStatus.CANCELLED " +
           "AND oi.order.status <> com.estore.billing.entity.OrderStatus.REFUNDED " +
           "GROUP BY oi.product.id, oi.productName, oi.product.imageUrl, oi.product.category.name " +
           "ORDER BY SUM(oi.quantity * oi.unitPrice) DESC")
    List<Object[]> findTopRevenueProducts(Pageable pageable);

    @Query("SELECT oi.product.category.name, SUM(oi.quantity * oi.unitPrice), COUNT(DISTINCT oi.order.id) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status <> com.estore.billing.entity.OrderStatus.CANCELLED " +
           "AND oi.order.status <> com.estore.billing.entity.OrderStatus.REFUNDED " +
           "GROUP BY oi.product.category.name " +
           "ORDER BY SUM(oi.quantity * oi.unitPrice) DESC")
    List<Object[]> findRevenueByCategory();
}

