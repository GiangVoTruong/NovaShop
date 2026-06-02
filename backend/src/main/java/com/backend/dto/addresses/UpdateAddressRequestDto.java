package com.backend.dto.addresses;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAddressRequestDto {

    @Size(max = 50)
    private String label;

    @Size(max = 100)
    private String recipientName;

    @Pattern(regexp = "^0[0-9]{9,10}$", message = "Phone must be a valid Vietnamese phone number")
    private String phone;

    @Size(max = 255)
    private String line1;

    @Size(max = 100)
    private String ward;

    @Size(max = 100)
    private String district;

    @Size(max = 100)
    private String city;

    private Boolean isDefault;
}
