    package tn.platform.user.security.config;

    import lombok.RequiredArgsConstructor;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
    import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
    import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
    import org.springframework.web.filter.CorsFilter; // 👈 Import this specific one
    import tn.platform.user.security.jwt.JwtAuthEntryPoint;
    import tn.platform.user.security.jwt.JwtAuthenticationFilter;
    import tn.platform.user.security.user.CustomUserDetailsService;

    import java.util.Arrays;

    @Configuration
    @RequiredArgsConstructor
    @EnableMethodSecurity
    public class SecurityConfig {

        private final JwtAuthenticationFilter jwtFilter;
        private final CustomUserDetailsService userDetailsService;
        private final PasswordEncoder passwordEncoder;
        private final JwtAuthEntryPoint authEntryPoint;

        // 1. THIS BEAN RUNS BEFORE SECURITY FILTER CHAIN
        @Bean
        public CorsFilter corsFilter() {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.addAllowedOrigin("http://localhost:4200");
            config.addAllowedHeader("*");
            config.addAllowedMethod("*"); // Allows GET, POST, PUT, DELETE, OPTIONS
            source.registerCorsConfiguration("/**", config);
            return new CorsFilter(source);
        }

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {
            DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
            provider.setUserDetailsService(userDetailsService);
            provider.setPasswordEncoder(passwordEncoder);
            return provider;
        }


        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                    // 2. DISABLE CSRF AND ENABLE CORS
                    .csrf(AbstractHttpConfigurer::disable)
                    .cors(cors -> {}) // Enable it here too

                    .sessionManagement(session ->
                            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    )
                    .exceptionHandling(e -> e
                            .authenticationEntryPoint(authEntryPoint)
                    )
                    .authenticationProvider(authenticationProvider())
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/api/auth/**").permitAll()
                            // 3. EXPLICITLY PERMIT OPTIONS REQUESTS
                            .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                            .anyRequest().authenticated()
                    )
                    .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

            return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
            return config.getAuthenticationManager();
        }
    }