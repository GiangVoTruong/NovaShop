package com.backend.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.backend.dto.users.CreateUserRequestDto;
import com.backend.dto.users.GetUserReponseDto;
import com.backend.entity.User;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    GetUserReponseDto toDto(User user);

    List<GetUserReponseDto> toDtoList(List<User> users);

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    User toEntity(CreateUserRequestDto request);
}
