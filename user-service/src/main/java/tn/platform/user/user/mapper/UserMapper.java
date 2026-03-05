package tn.platform.user.user.mapper;

import org.springframework.stereotype.Component;
import tn.platform.user.user.dto.UserResponse;
import tn.platform.user.user.entity.User;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .role(user.getRole())
                .phone(user.getPhone())
                .photoUrl(user.getPhotoUrl())
                .bio(user.getBio())
                .build();
    }
}