package com.estore.billing.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private String orderNumber;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private String shippingCity;
    private String shippingCountry;
    private String shippingPostalCode;
    private String shippingPhone;
    private String notes;
    private String paymentMethod;
    private Long userId;
    private String userEmail;
    private List<OrderItemDTO> items;
    private LocalDateTime createdAt;
}
