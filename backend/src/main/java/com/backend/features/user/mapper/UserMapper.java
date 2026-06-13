package com.backend.features.user.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.backend.features.user.dto.GetUserReponseDto;
import com.backend.features.user.User;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    GetUserReponseDto toDto(User user);

    List<GetUserReponseDto> toDtoList(List<User> users);
}
