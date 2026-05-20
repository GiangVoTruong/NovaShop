package com.backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.backend.dto.users.CreateUserRequestDto;
import com.backend.dto.users.GetUserReponseDto;
import com.backend.entity.User;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    GetUserReponseDto toDto(User user);

    List<GetUserReponseDto> toDtoList(List<User> users);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    User toEntity(CreateUserRequestDto request);
}
