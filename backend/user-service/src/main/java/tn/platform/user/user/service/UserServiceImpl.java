package tn.platform.user.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.platform.user.media.service.CloudinaryService;
import tn.platform.user.user.dto.ChangePasswordRequest;
import tn.platform.user.user.dto.UpdateUserRequest;
import tn.platform.user.user.dto.UserResponse;
import tn.platform.user.user.entity.User;
import tn.platform.user.user.exception.UserNotFoundException;
import tn.platform.user.user.mapper.UserMapper;
import tn.platform.user.user.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor

public class UserServiceImpl implements  UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;



    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    @Override
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Override
    public void deleteUser(Long id) {
        User user = getById(id);
        user.setDeleted(true); // soft delete
        userRepository.save(user);
    }
    @Override
    public UserResponse getCurrentUser() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return userMapper.toResponse(user);
    }
    @Override
    public UserResponse updateCurrentUser(UpdateUserRequest request) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (request.getNom() != null)
            user.setNom(request.getNom());

        if (request.getPrenom() != null)
            user.setPrenom(request.getPrenom());

        if (request.getPhone() != null)
            user.setPhone(request.getPhone());

        if (request.getPhotoUrl() != null)
            user.setPhotoUrl(request.getPhotoUrl());

        if (request.getBio() != null)
            user.setBio(request.getBio());

        userRepository.save(user);

        return userMapper.toResponse(user);
    }


    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void deleteCurrentUser() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setDeleted(true);
        user.setEnabled(false);

        userRepository.save(user);
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository
                .findByDeletedFalse(pageable)
                .map(userMapper::toResponse);
    }

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public UserResponse uploadPhoto(MultipartFile file) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // ⭐ Upload vers Cloudinary
        String url = cloudinaryService.upload(file);

        // ⭐ Sauvegarder URL
        user.setPhotoUrl(url);
        userRepository.save(user);

        return userMapper.toResponse(user);
    }







}
