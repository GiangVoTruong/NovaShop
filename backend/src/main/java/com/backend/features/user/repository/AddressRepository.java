package com.backend.features.user.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.backend.features.user.Address;

public interface AddressRepository extends JpaRepository<Address, UUID> {

    List<Address> findByUser_IdOrderByIsDefaultDescCreatedAtDesc(UUID userId);

    Optional<Address> findByIdAndUser_Id(UUID id, UUID userId);

    @Modifying
    @Query("UPDATE Address address SET address.isDefault = false WHERE address.user.id = :userId")
    void clearDefaultForUser(UUID userId);
}
