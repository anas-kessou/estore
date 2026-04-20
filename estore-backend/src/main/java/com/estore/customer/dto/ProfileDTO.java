package com.estore.customer.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDTO {

    private Long id;
    private String phone;
    private String address;
    private String city;
    private String country;
    private String postalCode;
    private String profileImageUrl;
}
