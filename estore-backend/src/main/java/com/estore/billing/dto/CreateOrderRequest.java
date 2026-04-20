package com.estore.billing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    @NotBlank(message = "Shipping address is required")
    @Size(max = 255, message = "Shipping address must be at most 255 characters")
    private String shippingAddress;

    @NotBlank(message = "Shipping city is required")
    @Size(max = 100, message = "Shipping city must be at most 100 characters")
    private String shippingCity;

    @NotBlank(message = "Shipping country is required")
    @Size(max = 100, message = "Shipping country must be at most 100 characters")
    private String shippingCountry;

    @Size(max = 20, message = "Postal code must be at most 20 characters")
    private String shippingPostalCode;

    @Size(max = 20, message = "Phone number must be at most 20 characters")
    private String shippingPhone;

    @Size(max = 500, message = "Notes must be at most 500 characters")
    private String notes;
}
