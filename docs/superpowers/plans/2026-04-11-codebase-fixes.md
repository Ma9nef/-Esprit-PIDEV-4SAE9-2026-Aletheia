# Aletheia Platform — Full Codebase Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply all bugs, security issues, dead code, and duplicate code fixes identified in the full codebase audit.

**Architecture:** Spring Cloud microservices (Library, courses, events, offer, ResourceManagement, user-service) + Angular 17 frontend. Each fix is scoped to a single file or tightly related set of files. Fixes are ordered from most critical to least critical.

**Tech Stack:** Spring Boot 3.x, Spring Security, JJWT 0.11.5, Angular 17, TypeScript.

---

## Group 1 — CRITICAL Security Fixes

---

### Task 1: Restore JWT security in events microservice

**Problem:** `SecurityConfig.java` in events has the real filter chain commented out and an insecure "permit all" chain active. Every event endpoint is unauthenticated.

**Files:**
- Modify: `backend/microservices/events/src/main/java/com/esprit/microservice/events/config/SecurityConfig.java`

- [ ] **Step 1: Replace the active `filterChain` bean**

Open the file. It currently contains two `@Bean filterChain` methods — one commented out (the correct one, lines 27–57) and one active (the insecure one, lines 58–70). Replace the entire file content with:

```java
package com.esprit.microservice.events.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/room/**").permitAll()
                        .requestMatchers("/room/*").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/ws/*").permitAll()
                        .requestMatchers("/socket.io/**").permitAll()
                        .requestMatchers("/api/events/**").authenticated()
                        .requestMatchers("/api/allocations/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Cache-Control"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/microservices/events/src/main/java/com/esprit/microservice/events/config/SecurityConfig.java
git commit -m "fix(events): restore JWT authentication filter — was disabled for testing"
```

---

### Task 2: Remove debug userId=1 fallback in courses CertificateServiceImpl

**Problem:** `getConnectedUserId()` returns hardcoded `1L` when no token is provided, allowing unauthenticated certificate generation. Also has `System.out.println` debug statements and a hardcoded sender email.

**Files:**
- Modify: `backend/microservices/courses/src/main/java/com/esprit/microservice/courses/service/core/CertificateServiceImpl.java`

- [ ] **Step 1: Fix `getConnectedUserId()` — remove the 1L fallback**

Find the method at lines 70–81 and replace it:

```java
private Long getConnectedUserId() {
    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        throw new RuntimeException("Unauthorized: no valid token provided");
    }
    Long userId = jwtReader.extractUserId(authHeader);
    if (userId == null) {
        throw new RuntimeException("Unauthorized: could not extract user ID from token");
    }
    return userId;
}
```

- [ ] **Step 2: Fix sender email — use @Value injection**

Add a field at the top of the class (after the existing `@Autowired` fields):

```java
@Value("${spring.mail.username}")
private String mailFrom;
```

Then replace the hardcoded line 96:
```java
helper.setFrom("skanderferjani07@gmail.com");
```
with:
```java
helper.setFrom(mailFrom);
```

- [ ] **Step 3: Remove debug println at line 139**

Replace:
```java
System.out.println("✅ Succès : Certificat généré pour l'utilisateur ID: " + enrollment.getUserId());
```
with nothing (delete the line).

- [ ] **Step 4: Add missing `@Value` import if not already present**

Check the imports at the top of the file. Add if missing:
```java
import org.springframework.beans.factory.annotation.Value;
```

- [ ] **Step 5: Commit**

```bash
git add backend/microservices/courses/src/main/java/com/esprit/microservice/courses/service/core/CertificateServiceImpl.java
git commit -m "fix(courses): remove debug userId=1 fallback and hardcoded sender email"
```

---

### Task 3: Externalize JWT secret and Gmail password to environment variables

**Problem:** `CHANGE_ME_CHANGE_ME_CHANGE_ME_123456` is committed as a literal in 4 config server properties and 2 service application.properties files. The Gmail app password `jxfbyqofrgogxaia` is also committed in two files.

**Files:**
- Modify: `backend/config-server/src/main/resources/config/library-service.properties`
- Modify: `backend/config-server/src/main/resources/config/ResourceManagement.properties`
- Modify: `backend/config-server/src/main/resources/config/event-microservice.properties`
- Modify: `backend/config-server/src/main/resources/config/aletheia-platform.properties`
- Modify: `backend/config-server/src/main/resources/config/courses-service.properties`
- Modify: `backend/microservices/courses/src/main/resources/application.properties`
- Modify: `backend/microservices/events/src/main/resources/application.properties`

- [ ] **Step 1: Update `library-service.properties`**

Find the line:
```
app.jwt.secret=CHANGE_ME_CHANGE_ME_CHANGE_ME_123456
```
Replace with:
```
app.jwt.secret=${JWT_SECRET:CHANGE_ME_CHANGE_ME_CHANGE_ME_123456}
```

- [ ] **Step 2: Update `ResourceManagement.properties`**

Same replacement — find `app.jwt.secret=CHANGE_ME_CHANGE_ME_CHANGE_ME_123456` and replace:
```
app.jwt.secret=${JWT_SECRET:CHANGE_ME_CHANGE_ME_CHANGE_ME_123456}
```

- [ ] **Step 3: Update `event-microservice.properties`**

Same replacement:
```
app.jwt.secret=${JWT_SECRET:CHANGE_ME_CHANGE_ME_CHANGE_ME_123456}
```

- [ ] **Step 4: Update `aletheia-platform.properties`**

Same replacement:
```
app.jwt.secret=${JWT_SECRET:CHANGE_ME_CHANGE_ME_CHANGE_ME_123456}
```

- [ ] **Step 5: Update `courses-service.properties` — both JWT secret and Gmail password**

Find:
```
spring.mail.password=jxfbyqofrgogxaia
```
Replace:
```
spring.mail.password=${GMAIL_APP_PASSWORD:}
```

If this file also contains `app.jwt.secret=CHANGE_ME_...`, apply the same env-var replacement.

- [ ] **Step 6: Update `courses/src/main/resources/application.properties`**

Find:
```
app.jwt.secret=CHANGE_ME_CHANGE_ME_CHANGE_ME_123456
```
Replace:
```
app.jwt.secret=${JWT_SECRET:CHANGE_ME_CHANGE_ME_CHANGE_ME_123456}
```

Find:
```
spring.mail.password=jxfbyqofrgogxaia
```
Replace:
```
spring.mail.password=${GMAIL_APP_PASSWORD:}
```

- [ ] **Step 7: Update `events/src/main/resources/application.properties`**

Find:
```
app.jwt.secret=CHANGE_ME_CHANGE_ME_CHANGE_ME_123456
```
Replace:
```
app.jwt.secret=${JWT_SECRET:CHANGE_ME_CHANGE_ME_CHANGE_ME_123456}
```

- [ ] **Step 8: Commit**

```bash
git add \
  backend/config-server/src/main/resources/config/library-service.properties \
  backend/config-server/src/main/resources/config/ResourceManagement.properties \
  backend/config-server/src/main/resources/config/event-microservice.properties \
  backend/config-server/src/main/resources/config/aletheia-platform.properties \
  backend/config-server/src/main/resources/config/courses-service.properties \
  backend/microservices/courses/src/main/resources/application.properties \
  backend/microservices/events/src/main/resources/application.properties
git commit -m "fix(security): externalize JWT secret and Gmail password to environment variables"
```

---

### Task 4: Add Spring Security to the offer microservice

**Problem:** The offer service has no `spring-boot-starter-security` dependency and no `SecurityConfig`. Every coupon, flash sale, and subscription endpoint is publicly accessible.

**Files:**
- Modify: `backend/microservices/offer/pom.xml`
- Create: `backend/microservices/offer/src/main/java/com/example/offer/security/JwtService.java`
- Create: `backend/microservices/offer/src/main/java/com/example/offer/security/JwtAuthenticationFilter.java`
- Create: `backend/microservices/offer/src/main/java/com/example/offer/config/SecurityConfig.java`
- Modify: `backend/microservices/offer/src/main/resources/application.properties`

- [ ] **Step 1: Add security and JWT dependencies to `offer/pom.xml`**

Open `backend/microservices/offer/pom.xml`. Inside the `<dependencies>` block, add after the existing entries:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

- [ ] **Step 2: Create `JwtService.java`**

Create `backend/microservices/offer/src/main/java/com/example/offer/security/JwtService.java`:

```java
package com.example.offer.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private Key key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
```

- [ ] **Step 3: Create `JwtAuthenticationFilter.java`**

Create `backend/microservices/offer/src/main/java/com/example/offer/security/JwtAuthenticationFilter.java`:

```java
package com.example.offer.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        if (!jwtService.isTokenValid(token)) {
            log.warn("Invalid JWT on {}", request.getRequestURI());
            chain.doFilter(request, response);
            return;
        }

        String email = jwtService.extractEmail(token);
        String role  = jwtService.extractRole(token);

        List<SimpleGrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + role));

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(email, null, authorities);
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);

        chain.doFilter(request, response);
    }
}
```

- [ ] **Step 4: Create `SecurityConfig.java`**

Create `backend/microservices/offer/src/main/java/com/example/offer/config/SecurityConfig.java`:

```java
package com.example.offer.config;

import com.example.offer.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/offers/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/flash-sales/active").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

- [ ] **Step 5: Add `app.jwt.secret` to offer's `application.properties`**

Open `backend/microservices/offer/src/main/resources/application.properties` and add at the end:

```properties
app.jwt.secret=${JWT_SECRET:CHANGE_ME_CHANGE_ME_CHANGE_ME_123456}
```

- [ ] **Step 6: Commit**

```bash
git add \
  backend/microservices/offer/pom.xml \
  backend/microservices/offer/src/main/java/com/example/offer/security/JwtService.java \
  backend/microservices/offer/src/main/java/com/example/offer/security/JwtAuthenticationFilter.java \
  backend/microservices/offer/src/main/java/com/example/offer/config/SecurityConfig.java \
  backend/microservices/offer/src/main/resources/application.properties
git commit -m "feat(offer): add Spring Security with JWT authentication"
```

---

## Group 2 — Dead Code Removal

---

### Task 5: Delete TestTokenController.java and remove its inner class from ResourceController

**Problem:** `TestTokenController.java` is pure debug scaffolding exposing `/api/test2/*`. An identical inner class `TestTokenController` is embedded inside `ResourceController.java` at lines 81–122 exposing `/api/test/*`.

**Files:**
- Delete: `backend/microservices/events/src/main/java/com/esprit/microservice/events/controller/TestTokenController.java`
- Modify: `backend/microservices/events/src/main/java/com/esprit/microservice/events/controller/ResourceController.java`

- [ ] **Step 1: Delete `TestTokenController.java`**

```bash
rm backend/microservices/events/src/main/java/com/esprit/microservice/events/controller/TestTokenController.java
```

- [ ] **Step 2: Remove the inner `TestTokenController` class from `ResourceController.java`**

Open `ResourceController.java`. Remove lines 81–122 (the entire static inner class):

```java
    @RestController
    @RequestMapping("/api/test")
    public static class TestTokenController {
        // ... everything until the closing brace
    }
```

The file after removal should end at line 80 with the closing `}` of the `checkResourceAvailability` method, then the outer class's closing `}`. Remove the unused imports `HashMap`, `Map`, `AuthenticationPrincipal`, `UserDetails` if they are only used by the inner class.

The cleaned-up end of the file should be:

```java
    @GetMapping("/{id}/availability")
    public ResponseEntity<Boolean> checkResourceAvailability(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(resourceService.isResourceAvailable(id, quantity));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<Resource> updateResourceQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(resourceService.updateResourceQuantity(id, quantity));
    }
}
```

Also remove these now-unused imports from the top:
```java
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.HashMap;
import java.util.Map;
```

- [ ] **Step 3: Commit**

```bash
git add backend/microservices/events/src/main/java/com/esprit/microservice/events/controller/
git commit -m "chore(events): remove TestTokenController debug scaffolding"
```

---

### Task 6: Delete empty `FeignConfig.java` from events

**Problem:** `FeignConfig.java` is a 1-line empty file. It contributes nothing and causes confusion alongside `FeignClientConfig.java`.

**Files:**
- Delete: `backend/microservices/events/src/main/java/com/esprit/microservice/events/config/FeignConfig.java`

- [ ] **Step 1: Delete the file**

```bash
rm backend/microservices/events/src/main/java/com/esprit/microservice/events/config/FeignConfig.java
```

- [ ] **Step 2: Commit**

```bash
git add backend/microservices/events/src/main/java/com/esprit/microservice/events/config/FeignConfig.java
git commit -m "chore(events): remove empty FeignConfig.java"
```

---

### Task 7: Delete redundant `CorsConfig.java` from Library and ResourceManagement

**Problem:** Both `Library/config/CorsConfig.java` and `ResourceManagement/config/CorsConfig.java` implement `WebMvcConfigurer.addCorsMappings()`. Both services already define a `CorsConfigurationSource` bean inside their `SecurityConfig` — that bean runs at the Spring Security filter layer (before MVC) and takes precedence. The `WebMvcConfigurer` beans are never actually applied and create confusion.

**Files:**
- Delete: `backend/microservices/Library/src/main/java/com/esprit/microservice/library/config/CorsConfig.java`
- Delete: `backend/microservices/ResourceManagement/src/main/java/com/esprit/microservice/resourcemanagement/config/CorsConfig.java`

- [ ] **Step 1: Delete Library CorsConfig**

```bash
rm backend/microservices/Library/src/main/java/com/esprit/microservice/library/config/CorsConfig.java
```

- [ ] **Step 2: Delete ResourceManagement CorsConfig**

```bash
rm backend/microservices/ResourceManagement/src/main/java/com/esprit/microservice/resourcemanagement/config/CorsConfig.java
```

- [ ] **Step 3: Commit**

```bash
git add \
  backend/microservices/Library/src/main/java/com/esprit/microservice/library/config/CorsConfig.java \
  backend/microservices/ResourceManagement/src/main/java/com/esprit/microservice/resourcemanagement/config/CorsConfig.java
git commit -m "chore: remove redundant WebMvcConfigurer CorsConfig beans superseded by SecurityConfig"
```

---

## Group 3 — Important Fixes

---

### Task 8: Fix duplicate imports in events `FeignClientConfig.java`

**Problem:** `feign.Logger` is imported twice (lines 3 and 11) and `feign.codec.ErrorDecoder` is imported twice (lines 5 and 12). This is a copy-paste artifact.

**Files:**
- Modify: `backend/microservices/events/src/main/java/com/esprit/microservice/events/config/FeignClientConfig.java`

- [ ] **Step 1: Replace file with deduplicated imports**

```java
package com.esprit.microservice.events.config;

import feign.Logger;
import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientConfig {

    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public ErrorDecoder errorDecoder() {
        return new FeignErrorDecoder();
    }

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String authorizationHeader = request.getHeader("Authorization");

                if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                    requestTemplate.header("Authorization", authorizationHeader);
                }
            }
        };
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/microservices/events/src/main/java/com/esprit/microservice/events/config/FeignClientConfig.java
git commit -m "fix(events): remove duplicate import statements in FeignClientConfig"
```

---

### Task 9: Add CORS configuration to courses `SecurityConfig`

**Problem:** `courses/security/SecurityConfig.java` has no `.cors(...)` call in the filter chain. Spring Security's filter layer runs before the MVC-level `CorsConfig` bean, so OPTIONS preflight requests may be rejected before reaching the CORS handler.

**Files:**
- Modify: `backend/microservices/courses/src/main/java/com/esprit/microservice/courses/security/SecurityConfig.java`
- Delete: `backend/microservices/courses/src/main/java/com/esprit/microservice/courses/config/CorsConfig.java` (after SecurityConfig handles it)

- [ ] **Step 1: Replace `SecurityConfig.java` with a version that includes CORS**

```java
package com.esprit.microservice.courses.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new UnsupportedOperationException("No local users");
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/course/public/**").permitAll()
                        .requestMatchers("/api/formations/**").permitAll()
                        .requestMatchers("/api/instructor/**").hasRole("INSTRUCTOR")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

- [ ] **Step 2: Delete the now-redundant `CorsConfig.java`**

```bash
rm backend/microservices/courses/src/main/java/com/esprit/microservice/courses/config/CorsConfig.java
```

- [ ] **Step 3: Commit**

```bash
git add \
  backend/microservices/courses/src/main/java/com/esprit/microservice/courses/security/SecurityConfig.java \
  backend/microservices/courses/src/main/java/com/esprit/microservice/courses/config/CorsConfig.java
git commit -m "fix(courses): add CORS to SecurityConfig and remove redundant CorsConfig bean"
```

---

### Task 10: Gate Library `DataInitializer` DDL with dev profile

**Problem:** `Library/config/DataInitializer.java` runs raw `ALTER TABLE` DDL on every startup. It should not run in production. The sample product seeding is also development-only data.

**Files:**
- Modify: `backend/microservices/Library/src/main/java/com/esprit/microservice/library/config/DataInitializer.java`

- [ ] **Step 1: Add `@Profile("dev")` to the class**

Add the import and annotation:

```java
import org.springframework.context.annotation.Profile;
```

Add `@Profile("dev")` to the class declaration:

```java
@Configuration
@Profile("dev")
public class DataInitializer {
```

Also replace the `System.out.println` calls with proper logging. Add at the top of the class:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
```

Add as first field:
```java
private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
```

Replace all `System.out.println(...)` calls with `log.info(...)`. For example:
- `System.out.println("✅ Column types updated...")` → `log.info("Column types updated for products & order_items tables")`
- `System.out.println("ℹ️ Column migration skipped...")` → `log.debug("Column migration skipped: {}", e.getMessage())`
- `System.out.println("Database is empty...")` → `log.info("Database is empty. Initializing sample products...")`
- `System.out.println("Sample products created...")` → `log.info("Sample products created. Total: {}", productRepository.count())`
- `System.out.println("Database already has...")` → `log.info("Database already has {} products, skipping init.", productRepository.count())`

- [ ] **Step 2: Commit**

```bash
git add backend/microservices/Library/src/main/java/com/esprit/microservice/library/config/DataInitializer.java
git commit -m "fix(library): gate DataInitializer to dev profile and replace println with logger"
```

---

### Task 11: Gate offer `DataInitializer` with dev profile

**Problem:** `offer/analytics/DataInitializer.java` unconditionally seeds 50 fake analytics records into production when the collection is empty.

**Files:**
- Modify: `backend/microservices/offer/src/main/java/com/example/offer/analytics/DataInitializer.java`

- [ ] **Step 1: Add `@Profile("dev")` to the component**

Add import:
```java
import org.springframework.context.annotation.Profile;
```

Add annotation to the class:
```java
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
```

Also replace `System.out.println` with SLF4J. Add fields:
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
```
```java
private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
```

Replace:
- `System.out.println("📦 Adding test data...");` → `log.info("Adding test data to offer history...");`
- `System.out.println("✅ 50 test records added!");` → `log.info("50 test records added to offer history.");`
- `System.out.println("📊 Database already contains ...")` → `log.info("Database already contains {} records, skipping seed.", repository.count());`

- [ ] **Step 2: Commit**

```bash
git add backend/microservices/offer/src/main/java/com/example/offer/analytics/DataInitializer.java
git commit -m "fix(offer): gate analytics DataInitializer to dev profile and use SLF4J logger"
```

---

### Task 12: Replace `System.out.println` in events `RoomWebSocketHandler` with SLF4J

**Problem:** `RoomWebSocketHandler.java` has 10+ `System.out.println` / `System.err.println` calls. These bypass the logging framework.

**Files:**
- Modify: `backend/microservices/events/src/main/java/com/esprit/microservice/events/service/RoomWebSocketHandler.java`

- [ ] **Step 1: Add SLF4J logger field**

Add imports at the top of the file:
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
```

Add as first field in the class:
```java
private static final Logger log = LoggerFactory.getLogger(RoomWebSocketHandler.class);
```

- [ ] **Step 2: Replace all `System.out.println` / `System.err.println` calls**

Apply these replacements throughout the file:

| Original | Replacement |
|---|---|
| `System.out.println("🔌 Nouvelle connexion WebSocket: " + session.getId())` | `log.info("New WebSocket connection: {}", session.getId())` |
| `System.out.println("✅ Session pré-authentifiée via handshake")` | `log.debug("Session pre-authenticated via handshake: {}", session.getId())` |
| `System.out.println("⏳ Session en attente d'authentification: " + session.getId())` | `log.debug("Session awaiting authentication: {}", session.getId())` |
| `System.out.println("⏱️ Timeout d'authentification pour: " + session.getId())` | `log.warn("Authentication timeout for session: {}", session.getId())` |
| `System.out.println("📨 Message reçu: " + payload)` | `log.debug("Message received: {}", payload)` |
| `System.out.println("❌ Message reçu de session non authentifiée: " + session.getId())` | `log.warn("Message from unauthenticated session: {}", session.getId())` |
| `System.out.println("🔐 Tentative d'authentification avec token")` | `log.debug("Authentication attempt with token")` |
| `System.out.println("❌ Auth failed: token manquant")` | `log.warn("Auth failed: missing token for session: {}", session.getId())` |
| `System.out.println("✅ Authentification réussie pour: " + email)` | `log.info("Authentication successful for: {}", email)` |
| `System.out.println("❌ Auth failed: token invalide")` | `log.warn("Auth failed: invalid token")` |
| `System.err.println("❌ Erreur validation token: " + e.getMessage())` | `log.error("Token validation error", e)` |

- [ ] **Step 3: Commit**

```bash
git add backend/microservices/events/src/main/java/com/esprit/microservice/events/service/RoomWebSocketHandler.java
git commit -m "fix(events): replace System.out.println with SLF4J logger in RoomWebSocketHandler"
```

---

### Task 13: Remove debug output from courses `JwtReader`

**Problem:** `JwtReader.java` prints the SHA-256 fingerprint of the JWT secret on every startup and logs raw claim values (including user IDs) on every token parse. This is both an information disclosure risk and a performance overhead.

**Files:**
- Modify: `backend/microservices/courses/src/main/java/com/esprit/microservice/courses/security/JwtReader.java`

- [ ] **Step 1: Remove the sha256Hex startup print in the constructor**

Find the constructor:
```java
public JwtReader(@Value("${app.jwt.secret}") String secret) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    System.out.println("COURSE jwt.secret SHA-256 = " + sha256Hex(secret));
}
```
Replace with:
```java
public JwtReader(@Value("${app.jwt.secret}") String secret) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
}
```

- [ ] **Step 2: Remove all `System.out.println` and `System.err.println` from `getAllClaims()` and `extractUserId()`**

In `getAllClaims()`:
```java
// REMOVE this line:
System.err.println("JWT Parsing Error: " + e.getMessage());
```

In `extractUserId()` — remove all three println statements:
```java
// REMOVE:
System.out.println("JWT raw id = " + raw + " | type = " + (raw == null ? "null" : raw.getClass().getName()));
// REMOVE:
System.out.println("JWT extracted userId = " + v);  // (two occurrences)
// REMOVE:
System.out.println("JWT subject = " + sub);
```

- [ ] **Step 3: Add a proper SLF4J logger for the error case**

Add import:
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
```
Add field:
```java
private static final Logger log = LoggerFactory.getLogger(JwtReader.class);
```
In `getAllClaims()` catch block, replace the removed println with:
```java
log.warn("JWT parse error: {}", e.getMessage());
```

- [ ] **Step 4: Remove the `sha256Hex` helper method** (lines 117–127) since it is no longer called:

```java
// DELETE this entire method:
private static String sha256Hex(String s) {
    try {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(s.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) sb.append(String.format("%02x", b));
        return sb.toString();
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```

Also remove the now-unused import:
```java
import java.security.MessageDigest;
```

- [ ] **Step 5: Commit**

```bash
git add backend/microservices/courses/src/main/java/com/esprit/microservice/courses/security/JwtReader.java
git commit -m "fix(courses): remove JWT secret fingerprint logging and debug println from JwtReader"
```

---

## Group 4 — Frontend Fixes

---

### Task 14: Fix `AuthService.isLoggedIn()` to check token expiry

**Problem:** `isLoggedIn()` only checks `!!getToken()`. A user with an expired token is considered logged in by the Angular guard, causing all subsequent API calls to fail with 401.

**Files:**
- Modify: `frontend/src/app/core/services/auth.service.ts`

- [ ] **Step 1: Replace `isLoggedIn()` with an expiry-aware version**

Find:
```typescript
isLoggedIn() {
  return !!this.getToken();
}
```
Replace with:
```typescript
isLoggedIn(): boolean {
  const token = this.getToken();
  if (!token) return false;
  try {
    const payloadPart = token.split('.')[1];
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const payload = JSON.parse(atob(padded));
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Remove the broken `getUserById()` stub**

Find and delete:
```typescript
getUserById(userId: number) {
  throw new Error('Method not implemented.');
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/core/services/auth.service.ts
git commit -m "fix(frontend): check token expiry in isLoggedIn() and remove unimplemented getUserById stub"
```

---

### Task 15: Fix auth interceptor to attach token to all backend service ports

**Problem:** `auth.interceptor.ts` only lists ports 8080, 8081, and 8089 in `allowedHosts`. Calls directly to Library (8082), offer (8086), events (8090), and ResourceManagement (8094) skip the `Authorization` header.

**Files:**
- Modify: `frontend/src/app/core/interceptors/auth.interceptor.ts`

- [ ] **Step 1: Update `allowedHosts` to include all service ports**

Find:
```typescript
private allowedHosts = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8089' // API Gateway
];
```
Replace with:
```typescript
private allowedHosts = [
  'http://localhost:8080', // user-service
  'http://localhost:8081', // courses
  'http://localhost:8082', // library
  'http://localhost:8086', // offer
  'http://localhost:8089', // API Gateway
  'http://localhost:8090', // events
  'http://localhost:8094'  // resource management
];
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/app/core/interceptors/auth.interceptor.ts
git commit -m "fix(frontend): add missing service ports to auth interceptor allowedHosts"
```

---

## Group 5 — API Gateway Routes

---

### Task 16: Add route definitions to the API Gateway

**Problem:** The API Gateway has no `spring.cloud.gateway.routes` configuration. It is non-functional as a gateway — all services are called directly by the frontend on their individual ports.

**Files:**
- Modify: `backend/ApiGateway/src/main/resources/application.properties`

- [ ] **Step 1: Add route definitions for all microservices**

Open `backend/ApiGateway/src/main/resources/application.properties` and append:

```properties
# ── User Service (port 8080) ──────────────────────────────────────────────────
spring.cloud.gateway.routes[0].id=user-service
spring.cloud.gateway.routes[0].uri=http://localhost:8080
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/auth/**,/api/users/**,/api/admin/users/**

# ── Courses Service (port 8081) ───────────────────────────────────────────────
spring.cloud.gateway.routes[1].id=courses-service
spring.cloud.gateway.routes[1].uri=http://localhost:8081
spring.cloud.gateway.routes[1].predicates[0]=Path=/api/courses/**,/api/lessons/**,/api/enrollments/**,/api/certificates/**,/api/instructor/**,/api/admin/**,/course/**,/api/formations/**

# ── Library Service (port 8082) ───────────────────────────────────────────────
spring.cloud.gateway.routes[2].id=library-service
spring.cloud.gateway.routes[2].uri=http://localhost:8082
spring.cloud.gateway.routes[2].predicates[0]=Path=/api/products/**,/api/cart/**,/api/orders/**,/api/receipts/**,/api/stock-movements/**,/api/loans/**,/api/files/**,/api/borrowing-policies/**,/api/analytics/**

# ── Events Service (port 8090) ───────────────────────────────────────────────
spring.cloud.gateway.routes[3].id=events-service
spring.cloud.gateway.routes[3].uri=http://localhost:8090
spring.cloud.gateway.routes[3].predicates[0]=Path=/api/events/**,/api/allocations/**,/api/resources/**,/room/**,/ws/**

# ── Offer Service (port 8086) ─────────────────────────────────────────────────
spring.cloud.gateway.routes[4].id=offer-service
spring.cloud.gateway.routes[4].uri=http://localhost:8086
spring.cloud.gateway.routes[4].predicates[0]=Path=/api/offers/**,/api/coupons/**,/api/flash-sales/**,/api/subscriptions/**,/api/subscription-plans/**,/api/offer-analytics/**

# ── Resource Management Service (port 8094) ──────────────────────────────────
spring.cloud.gateway.routes[5].id=resource-management-service
spring.cloud.gateway.routes[5].uri=http://localhost:8094
spring.cloud.gateway.routes[5].predicates[0]=Path=/api/rm/resources/**,/api/rm/reservations/**,/api/rm/availability/**
```

Note: ResourceManagement routes are prefixed with `/api/rm/` to avoid collision with the events `/api/resources/**` route. If the frontend already calls ResourceManagement on a different path, adjust accordingly.

- [ ] **Step 2: Commit**

```bash
git add backend/ApiGateway/src/main/resources/application.properties
git commit -m "feat(gateway): add route definitions for all microservices"
```

---

## Self-Review Checklist

- [x] Task 1 covers: events security disabled (CRITICAL #1)
- [x] Task 2 covers: courses userId=1 fallback (CRITICAL #2) + hardcoded email (MINOR #21)
- [x] Task 3 covers: JWT secret committed in plaintext (CRITICAL #3) + Gmail password (CRITICAL #4)
- [x] Task 4 covers: offer zero authentication (CRITICAL #5)
- [x] Task 5 covers: TestTokenController dead code (MINOR #15) + inner class
- [x] Task 6 covers: empty FeignConfig.java (dead code)
- [x] Task 7 covers: Library + ResourceManagement double CorsConfig (IMPORTANT #8 / MINOR #23)
- [x] Task 8 covers: FeignClientConfig duplicate imports (IMPORTANT #7)
- [x] Task 9 covers: courses SecurityConfig missing CORS call (IMPORTANT #11)
- [x] Task 10 covers: Library DataInitializer DDL on every startup (MINOR #16)
- [x] Task 11 covers: offer DataInitializer unconditional seeding (MINOR #17)
- [x] Task 12 covers: RoomWebSocketHandler System.out.println (MINOR #18)
- [x] Task 13 covers: JwtReader secret fingerprint + debug println (IMPORTANT #10)
- [x] Task 14 covers: isLoggedIn() expiry check (IMPORTANT #12) + getUserById stub (IMPORTANT #13)
- [x] Task 15 covers: auth interceptor missing ports (IMPORTANT #14)
- [x] Task 16 covers: ApiGateway no routes (CRITICAL #6)

**Not covered in this plan (architectural refactors requiring separate planning):**
- events Resource entity duplication with ResourceManagement (requires full EventResourceAllocation refactor)
- JWT validation centralization at gateway (requires gateway filter + all services updated)
- Package naming standardization (purely cosmetic, requires team alignment)
- Enrollment check in LearningLessonServiceImpl (requires understanding enrollment flow)
