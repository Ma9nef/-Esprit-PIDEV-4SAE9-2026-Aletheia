package tn.platform.user.auth.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import tn.platform.user.auth.dto.AuthResponse;
import tn.platform.user.auth.dto.CreateInstructorRequest;
import tn.platform.user.auth.dto.LoginRequest;
import tn.platform.user.auth.dto.RegisterRequest;
import tn.platform.user.security.jwt.JwtService;
import tn.platform.user.user.entity.Role;
import tn.platform.user.user.entity.User;
import tn.platform.user.user.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    private User learner;
    private User instructor;

    @BeforeEach
    void setUp() {
        learner = User.builder()
                .id(1L)
                .nom("Manef")
                .prenom("Test")
                .email("manef@test.com")
                .password("encodedPassword")
                .role(Role.LEARNER)
                .enabled(true)
                .build();

        instructor = User.builder()
                .id(2L)
                .nom("Ahmed")
                .prenom("Instructor")
                .email("instructor@test.com")
                .password("encodedPassword")
                .role(Role.INSTRUCTOR)
                .enabled(true)
                .emailVerified(true)
                .build();
    }

    @Test
    void register_shouldCreateLearnerAndReturnAuthResponse() {
        RegisterRequest request = new RegisterRequest();
        request.setNom("Manef");
        request.setPrenom("Test");
        request.setEmail("manef@test.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1L);
            return savedUser;
        });
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("manef@test.com", response.getEmail());
        assertEquals(Role.LEARNER.name(), response.getRole());

        verify(userRepository).existsByEmail(request.getEmail());
        verify(passwordEncoder).encode(request.getPassword());
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(any(User.class));
    }

    @Test
    void register_shouldThrowException_whenEmailAlreadyUsed() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("manef@test.com");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.register(request)
        );

        assertEquals("Email already used", exception.getMessage());

        verify(userRepository).existsByEmail(request.getEmail());
        verify(userRepository, never()).save(any(User.class));
        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    void login_shouldAuthenticateAndReturnAuthResponse() {
        LoginRequest request = new LoginRequest();
        request.setEmail("manef@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(learner));
        when(jwtService.generateToken(learner)).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("manef@test.com", response.getEmail());
        assertEquals(Role.LEARNER.name(), response.getRole());

        verify(authenticationManager).authenticate(
                any(UsernamePasswordAuthenticationToken.class)
        );
        verify(userRepository).findByEmail(request.getEmail());
        verify(jwtService).generateToken(learner);
    }

    @Test
    void login_shouldThrowException_whenUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("missing@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.login(request)
        );

        assertEquals("User not found", exception.getMessage());

        verify(authenticationManager).authenticate(
                any(UsernamePasswordAuthenticationToken.class)
        );
        verify(userRepository).findByEmail(request.getEmail());
        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    void registerInstructor_shouldCreateInstructorAndReturnAuthResponse() {
        CreateInstructorRequest request = new CreateInstructorRequest();
        request.setNom("Ahmed");
        request.setPrenom("Instructor");
        request.setEmail("instructor@test.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(2L);
            return savedUser;
        });
        when(jwtService.generateToken(any(User.class))).thenReturn("instructor-token");

        AuthResponse response = authService.registerInstructor(request);

        assertNotNull(response);
        assertEquals("instructor-token", response.getToken());
        assertEquals(2L, response.getUserId());
        assertEquals("instructor@test.com", response.getEmail());
        assertEquals(Role.INSTRUCTOR.name(), response.getRole());

        verify(userRepository).existsByEmail(request.getEmail());
        verify(passwordEncoder).encode(request.getPassword());
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(any(User.class));
    }

    @Test
    void registerInstructor_shouldThrowException_whenEmailAlreadyUsed() {
        CreateInstructorRequest request = new CreateInstructorRequest();
        request.setEmail("instructor@test.com");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.registerInstructor(request)
        );

        assertEquals("Email already used", exception.getMessage());

        verify(userRepository).existsByEmail(request.getEmail());
        verify(userRepository, never()).save(any(User.class));
        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    void getAllUsers_shouldReturnUsersList() {
        when(userRepository.findAll()).thenReturn(List.of(learner, instructor));

        List<?> users = authService.getAllUsers();

        assertNotNull(users);
        assertEquals(2, users.size());

        verify(userRepository).findAll();
    }
}