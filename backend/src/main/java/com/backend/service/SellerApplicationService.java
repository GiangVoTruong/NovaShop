package com.backend.service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.sellers.CreateSellerApplicationRequestDto;
import com.backend.dto.sellers.GetSellerApplicationResponseDto;
import com.backend.dto.sellers.ReviewSellerApplicationRequestDto;
import com.backend.entity.SellerApplication;
import com.backend.entity.User;
import com.backend.enums.SellerApplicationStatus;
import com.backend.enums.UserRole;
import com.backend.repository.SellerApplicationRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerApplicationService {

    private static final String APPLICATION_NOT_FOUND = "Seller application not found";
    private static final String ALREADY_SELLER = "User is already a seller";
    private static final String PENDING_APPLICATION_EXISTS = "You already have a pending seller application";
    private static final String ONLY_CUSTOMER_CAN_APPLY = "Only customers can apply to become a seller";
    private static final String INVALID_REVIEW_STATUS = "Review status must be APPROVED or REJECTED";
    private static final String APPLICATION_ALREADY_REVIEWED = "Application has already been reviewed";

    private final SellerApplicationRepository sellerApplicationRepository;
    private final UserRepository userRepository;

    @Transactional
    public GetSellerApplicationResponseDto apply(CreateSellerApplicationRequestDto request) {
        User user = findCurrentUser();
        if (user.getRole() == UserRole.SELLER || user.getRole() == UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ALREADY_SELLER);
        }
        if (user.getRole() != UserRole.CUSTOMER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ONLY_CUSTOMER_CAN_APPLY);
        }
        if (sellerApplicationRepository.findByUserIdAndStatus(user.getId(), SellerApplicationStatus.PENDING).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, PENDING_APPLICATION_EXISTS);
        }

        SellerApplication application = SellerApplication.builder()
                .user(user)
                .shopName(request.getShopName().trim())
                .description(request.getDescription())
                .status(SellerApplicationStatus.PENDING)
                .createdAt(OffsetDateTime.now())
                .build();

        return toDto(sellerApplicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public GetSellerApplicationResponseDto getMyApplication() {
        User user = findCurrentUser();
        return sellerApplicationRepository.findByUserIdAndStatus(user.getId(), SellerApplicationStatus.PENDING)
                .map(application -> toDto(application))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, APPLICATION_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<GetSellerApplicationResponseDto> listApplications(String status) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        if (status != null && !status.isBlank()) {
            SellerApplicationStatus applicationStatus = SellerApplicationStatus.valueOf(status.trim().toUpperCase());
            return toDtoList(sellerApplicationRepository.findByStatusOrderByCreatedAtDesc(applicationStatus));
        }
        return toDtoList(sellerApplicationRepository.findAllByOrderByCreatedAtDesc());
    }

    @Transactional
    public GetSellerApplicationResponseDto reviewApplication(UUID applicationId, ReviewSellerApplicationRequestDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        if (request.getStatus() == SellerApplicationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_REVIEW_STATUS);
        }

        SellerApplication application = sellerApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, APPLICATION_NOT_FOUND));

        if (application.getStatus() != SellerApplicationStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, APPLICATION_ALREADY_REVIEWED);
        }

        User reviewer = findCurrentUser();
        application.setStatus(request.getStatus());
        application.setAdminNote(request.getAdminNote());
        application.setReviewedBy(reviewer);
        application.setReviewedAt(OffsetDateTime.now());

        if (request.getStatus() == SellerApplicationStatus.APPROVED) {
            User applicant = application.getUser();
            applicant.setRole(UserRole.SELLER);
            applicant.setUpdatedAt(OffsetDateTime.now());
            userRepository.save(applicant);
        }

        return toDto(sellerApplicationRepository.save(application));
    }

    private User findCurrentUser() {
        return userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
    }

    private List<GetSellerApplicationResponseDto> toDtoList(List<SellerApplication> applications) {
        List<GetSellerApplicationResponseDto> response = new ArrayList<>(applications.size());
        for (SellerApplication application : applications) {
            response.add(toDto(application));
        }
        return response;
    }

    private GetSellerApplicationResponseDto toDto(SellerApplication application) {
        return GetSellerApplicationResponseDto.builder()
                .id(application.getId())
                .userId(application.getUser().getId())
                .userEmail(application.getUser().getEmail())
                .userFullName(application.getUser().getFullName())
                .shopName(application.getShopName())
                .description(application.getDescription())
                .status(application.getStatus())
                .adminNote(application.getAdminNote())
                .reviewedBy(application.getReviewedBy() != null ? application.getReviewedBy().getId() : null)
                .createdAt(application.getCreatedAt())
                .reviewedAt(application.getReviewedAt())
                .build();
    }
}
