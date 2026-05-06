package tn.platform.user.user.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import tn.platform.user.media.service.CloudinaryService;
import tn.platform.user.user.dto.*;
import tn.platform.user.user.entity.Role;
import tn.platform.user.user.entity.User;
import tn.platform.user.user.exception.UserNotFoundException;
import tn.platform.user.user.mapper.UserMapper;
import tn.platform.user.user.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {

        user = User.builder()
                .id(1L)
                .email("manef@test.com")
                .password("encodedPassword")
                .nom("Manef")
                .prenom("Test")
                .role(Role.LEARNER)
                .enabled(true)
                .deleted(false)
                .build();

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        lenient().when(authentication.getName())
                .thenReturn("manef@test.com");

        lenient().when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void findByEmail_shouldReturnUser() {

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        Optional<User> result = userService.findByEmail(user.getEmail());

        assertTrue(result.isPresent());
        assertEquals(user.getEmail(), result.get().getEmail());

        verify(userRepository).findByEmail(user.getEmail());
    }

    @Test
    void getById_shouldReturnUser() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        User result = userService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(userRepository).findById(1L);
    }

    @Test
    void getById_shouldThrowException_whenUserNotFound() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> userService.getById(1L)
        );

        verify(userRepository).findById(1L);
    }

    @Test
    void deleteUser_shouldSoftDeleteUser() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        userService.deleteUser(1L);

        assertTrue(user.isDeleted());

        verify(userRepository).save(user);
    }

    @Test
    void getCurrentUser_shouldReturnUserResponse() {

        UserResponse response = UserResponse.builder()
                .email(user.getEmail())
                .build();

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        when(userMapper.toResponse(user))
                .thenReturn(response);

        UserResponse result = userService.getCurrentUser();

        assertNotNull(result);
        assertEquals(user.getEmail(), result.getEmail());

        verify(userMapper).toResponse(user);
    }

    @Test
    void updateCurrentUser_shouldUpdateFields() {

        UpdateUserRequest request = new UpdateUserRequest();
        request.setNom("Updated");
        request.setPrenom("User");
        request.setBio("Bio");

        UserResponse response = UserResponse.builder().build();

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        when(userMapper.toResponse(user))
                .thenReturn(response);

        UserResponse result = userService.updateCurrentUser(request);

        assertEquals("Updated", user.getNom());
        assertEquals("User", user.getPrenom());
        assertEquals("Bio", user.getBio());

        verify(userRepository).save(user);

        assertNotNull(result);
    }

    @Test
    void changePassword_shouldUpdatePassword() {

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("oldPassword");
        request.setNewPassword("newPassword");

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("oldPassword", user.getPassword()))
                .thenReturn(true);

        when(passwordEncoder.encode("newPassword"))
                .thenReturn("newEncodedPassword");

        userService.changePassword(request);

        assertEquals("newEncodedPassword", user.getPassword());

        verify(userRepository).save(user);
    }

    @Test
    void changePassword_shouldThrowException_whenOldPasswordIncorrect() {

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("wrongPassword");

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(anyString(), anyString()))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.changePassword(request)
        );

        assertEquals("Old password incorrect", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteCurrentUser_shouldDisableAndSoftDeleteUser() {

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        userService.deleteCurrentUser();

        assertTrue(user.isDeleted());
        assertFalse(user.isEnabled());

        verify(userRepository).save(user);
    }

    @Test
    void getAllUsers_shouldReturnPagedUsers() {

        Pageable pageable = PageRequest.of(0, 10);

        UserResponse response = UserResponse.builder().build();

        Page<User> page = new PageImpl<>(List.of(user));

        when(userRepository.findByDeletedFalse(pageable))
                .thenReturn(page);

        when(userMapper.toResponse(any(User.class)))
                .thenReturn(response);

        Page<UserResponse> result = userService.getAllUsers(pageable);

        assertEquals(1, result.getTotalElements());

        verify(userRepository).findByDeletedFalse(pageable);
    }

    @Test
    void uploadPhoto_shouldUploadAndSavePhoto() {

        MultipartFile file = new MockMultipartFile(
                "file",
                "photo.jpg",
                "image/jpeg",
                "image".getBytes()
        );

        UserResponse response = UserResponse.builder().build();

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        when(cloudinaryService.upload(file))
                .thenReturn("http://cloudinary.com/photo.jpg");

        when(userMapper.toResponse(user))
                .thenReturn(response);

        UserResponse result = userService.uploadPhoto(file);

        assertEquals(
                "http://cloudinary.com/photo.jpg",
                user.getPhotoUrl()
        );

        verify(userRepository).save(user);

        assertNotNull(result);
    }

    @Test
    void updateUserRole_shouldUpdateRole() {

        UpdateUserRoleRequest request = new UpdateUserRoleRequest();
        request.setUserId(1L);
        request.setRole(Role.ADMIN);

        UserResponse response = UserResponse.builder().build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userMapper.toResponse(user))
                .thenReturn(response);

        UserResponse result = userService.updateUserRole(request);

        assertEquals(Role.ADMIN, user.getRole());

        verify(userRepository).save(user);

        assertNotNull(result);
    }
}