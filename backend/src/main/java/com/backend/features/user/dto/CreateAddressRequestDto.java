package com.backend.features.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import com.backend.features.user.Address;
@Getter
@Setter
public class CreateAddressRequestDto {

    @Size(max = 50)
    private String label;

    @NotBlank(message = "Recipient name is required")
    @Size(max = 100)
    private String recipientName;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^0[0-9]{9,10}$", message = "Phone must be a valid Vietnamese phone number")
    private String phone;

    @NotBlank(message = "Address line is required")
    @Size(max = 255)
    private String line1;

    @Size(max = 100)
    private String ward;

    @NotBlank(message = "District is required")
    @Size(max = 100)
    private String district;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    private Boolean isDefault;
}
