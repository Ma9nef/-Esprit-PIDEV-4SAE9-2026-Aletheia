package tn.platform.user.user.service;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import tn.platform.user.user.dto.ChangePasswordRequest;
import tn.platform.user.user.dto.UpdateUserRequest;
import tn.platform.user.user.dto.UserResponse;
import tn.platform.user.user.entity.User;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.Optional;

public interface UserService {

    Optional<User> findByEmail(String email);

    User getById(Long id);

    void deleteUser(Long id);
    UserResponse getCurrentUser();
    UserResponse updateCurrentUser(UpdateUserRequest request);
    void changePassword(ChangePasswordRequest request);
    void deleteCurrentUser();
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse uploadPhoto(MultipartFile file) throws IOException;




}
