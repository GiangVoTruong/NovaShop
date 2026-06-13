package com.backend.features.user.service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.features.user.dto.CreateAddressRequestDto;
import com.backend.features.user.dto.GetAddressResponseDto;
import com.backend.features.user.dto.UpdateAddressRequestDto;
import com.backend.features.user.Address;
import com.backend.features.user.User;
import com.backend.features.user.repository.AddressRepository;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressService {

    private static final String ADDRESS_NOT_FOUND = "Address not found";

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<GetAddressResponseDto> getMyAddresses() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<Address> addresses = addressRepository.findByUser_IdOrderByIsDefaultDescCreatedAtDesc(userId);
        List<GetAddressResponseDto> response = new ArrayList<>(addresses.size());
        for (Address address : addresses) {
            response.add(toDto(address));
        }
        return response;
    }

    @Transactional
    public GetAddressResponseDto createAddress(CreateAddressRequestDto request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = findUser(userId);

        boolean setDefault = Boolean.TRUE.equals(request.getIsDefault())
                || addressRepository.findByUser_IdOrderByIsDefaultDescCreatedAtDesc(userId).isEmpty();
        if (setDefault) {
            addressRepository.clearDefaultForUser(userId);
        }

        Address address = Address.builder()
                .user(user)
                .fullName(request.getRecipientName().trim())
                .phone(request.getPhone().trim())
                .detail(encodeDetail(request.getLabel(), request.getLine1()))
                .ward(trimToNull(request.getWard()))
                .district(request.getDistrict().trim())
                .province(request.getCity().trim())
                .isDefault(setDefault)
                .createdAt(OffsetDateTime.now())
                .build();

        return toDto(addressRepository.save(address));
    }

    @Transactional
    public GetAddressResponseDto updateAddress(UUID addressId, UpdateAddressRequestDto request) {
        Address address = findOwnedAddress(addressId);

        if (request.getRecipientName() != null && !request.getRecipientName().isBlank()) {
            address.setFullName(request.getRecipientName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            address.setPhone(request.getPhone().trim());
        }
        if (request.getLine1() != null && !request.getLine1().isBlank()) {
            address.setDetail(encodeDetail(request.getLabel(), request.getLine1()));
        } else if (request.getLabel() != null) {
            String line1 = decodeLine1(address.getDetail());
            address.setDetail(encodeDetail(request.getLabel(), line1));
        }
        if (request.getWard() != null) {
            address.setWard(trimToNull(request.getWard()));
        }
        if (request.getDistrict() != null && !request.getDistrict().isBlank()) {
            address.setDistrict(request.getDistrict().trim());
        }
        if (request.getCity() != null && !request.getCity().isBlank()) {
            address.setProvince(request.getCity().trim());
        }
        if (request.getIsDefault() != null) {
            applyDefault(address.getUser().getId(), address, request.getIsDefault());
        }

        return toDto(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(UUID addressId) {
        Address address = findOwnedAddress(addressId);
        addressRepository.delete(address);
    }

    @Transactional
    public GetAddressResponseDto setDefaultAddress(UUID addressId) {
        Address address = findOwnedAddress(addressId);
        addressRepository.clearDefaultForUser(address.getUser().getId());
        address.setIsDefault(true);
        return toDto(addressRepository.save(address));
    }

    @Transactional(readOnly = true)
    public Address getOwnedAddress(UUID userId, UUID addressId) {
        return addressRepository.findByIdAndUser_Id(addressId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ADDRESS_NOT_FOUND));
    }

    private Address findOwnedAddress(UUID addressId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        return getOwnedAddress(userId, addressId);
    }

    private void applyDefault(UUID userId, Address address, boolean isDefault) {
        if (isDefault) {
            addressRepository.clearDefaultForUser(userId);
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
    }

    private GetAddressResponseDto toDto(Address address) {
        String detail = address.getDetail() == null ? "" : address.getDetail();
        return GetAddressResponseDto.builder()
                .id(address.getId())
                .label(decodeLabel(detail))
                .recipientName(address.getFullName())
                .phone(address.getPhone())
                .line1(decodeLine1(detail))
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getProvince())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }

    private String encodeDetail(String label, String line1) {
        String normalizedLine1 = line1.trim();
        if (label == null || label.isBlank()) {
            return normalizedLine1;
        }
        return "[" + label.trim() + "] " + normalizedLine1;
    }

    private String decodeLabel(String detail) {
        if (detail != null && detail.startsWith("[") && detail.contains("]")) {
            int end = detail.indexOf(']');
            return detail.substring(1, end);
        }
        return null;
    }

    private String decodeLine1(String detail) {
        if (detail == null) {
            return "";
        }
        if (detail.startsWith("[") && detail.contains("] ")) {
            int separator = detail.indexOf("] ");
            return detail.substring(separator + 2);
        }
        return detail;
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
