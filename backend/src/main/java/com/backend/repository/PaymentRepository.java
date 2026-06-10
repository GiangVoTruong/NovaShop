package com.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrder_Id(UUID orderId);
}
