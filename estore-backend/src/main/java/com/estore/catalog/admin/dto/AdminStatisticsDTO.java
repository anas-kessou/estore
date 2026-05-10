package com.estore.catalog.admin.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatisticsDTO {

    // Overview cards
    private long totalProducts;
    private long activeProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long totalCustomers;
    private long lowStockProducts;

    // Order status breakdown
    private List<StatusCount> ordersByStatus;

    // Top selling products (by quantity)
    private List<TopProduct> topSellingProducts;

    // Top revenue products
    private List<TopProduct> topRevenueProducts;

    // Revenue by category
    private List<CategoryRevenue> revenueByCategory;

    // Recent orders summary
    private List<RecentOrder> recentOrders;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusCount {
        private String status;
        private long count;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProduct {
        private Long productId;
        private String productName;
        private String imageUrl;
        private String categoryName;
        private long totalQuantitySold;
        private BigDecimal totalRevenue;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryRevenue {
        private String categoryName;
        private BigDecimal totalRevenue;
        private long totalOrders;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrder {
        private Long orderId;
        private String orderNumber;
        private String customerName;
        private BigDecimal totalAmount;
        private String status;
        private String orderDate;
    }
}
