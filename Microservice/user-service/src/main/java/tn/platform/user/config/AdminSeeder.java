package tn.platform.user.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import tn.platform.user.user.entity.Role;
import tn.platform.user.user.entity.User;
import tn.platform.user.user.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {

            User admin = User.builder()
                    .email("admin@admin.com")
                    .password(passwordEncoder.encode("admin123"))
                    .nom("Admin")
                    .prenom("System")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);

            System.out.println("ADMIN CREATED: admin@admin.com / admin123");
        }
    }
}