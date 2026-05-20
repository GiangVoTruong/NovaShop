package com.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dto.users.GetUserReponseDto;
import com.backend.mapper.UserMapper;
import com.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public List<GetUserReponseDto> getAllUsers() {
        return userMapper.toDtoList(userRepository.findAll());
    }

    @Transactional(readOnly = true)
    public GetUserReponseDto getUserById(Long id) {
        return userMapper.toDto(
                userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")));
    }
}
