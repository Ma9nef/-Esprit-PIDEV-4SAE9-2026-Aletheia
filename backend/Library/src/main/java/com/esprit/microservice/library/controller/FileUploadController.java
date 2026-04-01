package com.esprit.microservice.library.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:4200")
public class FileUploadController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
            Files.createDirectories(this.uploadPath.resolve("products"));
            Files.createDirectories(this.uploadPath.resolve("covers"));
            System.out.println("✅ File upload directory initialized at: " + this.uploadPath);
        } catch (IOException e) {
            System.err.println("❌ Could not create upload directories at: " + this.uploadPath);
            e.printStackTrace();
            throw new RuntimeException("Could not create upload directories", e);
        }
    }

    /**
     * Upload a product file (PDF, document, etc.)
     * POST /api/files/upload/product
     */
    @PostMapping("/upload/product")
    public ResponseEntity<Map<String, String>> uploadProductFile(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "products");
    }

    /**
     * Upload a cover image
     * POST /api/files/upload/cover
     */
    @PostMapping("/upload/cover")
    public ResponseEntity<Map<String, String>> uploadCoverImage(@RequestParam("file") MultipartFile file) {
        // Validate image type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed for covers"));
        }
        return uploadFile(file, "covers");
    }

    /**
     * Serve uploaded files
     * GET /api/files/{folder}/{filename}
     */
    @GetMapping("/{folder}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String folder,
            @PathVariable String filename) {

        try {
            Path filePath = uploadPath.resolve(folder).resolve(filename).normalize();

            // Security check: ensure the file is within the upload directory
            if (!filePath.startsWith(uploadPath)) {
                return ResponseEntity.badRequest().build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate a cover image with initials and gradient background
     * GET /api/files/generate-cover?title=Spring Boot Guide&type=PDF
     */
    @GetMapping("/generate-cover")
    public ResponseEntity<Map<String, String>> generateCoverPlaceholder(
            @RequestParam String title,
            @RequestParam(defaultValue = "BOOK") String type) {

        // Return a URL that the frontend can use to generate a cover via canvas
        // We'll use a deterministic approach based on title for consistent colors
        String initials = getInitials(title);
        String color = getColorForType(type);

        return ResponseEntity.ok(Map.of(
                "initials", initials,
                "color", color,
                "type", type
        ));
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private ResponseEntity<Map<String, String>> uploadFile(MultipartFile file, String subfolder) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        System.out.println("📁 Uploading file: " + file.getOriginalFilename()
                + " (" + file.getSize() + " bytes) to " + subfolder);

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID() + extension;

            // Save file
            Path targetPath = uploadPath.resolve(subfolder).resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL to access this file
            String fileUrl = "/api/files/" + subfolder + "/" + uniqueFilename;

            System.out.println("✅ File saved to: " + targetPath + " → URL: " + fileUrl);

            return ResponseEntity.ok(Map.of(
                    "url", fileUrl,
                    "filename", uniqueFilename,
                    "originalName", originalFilename != null ? originalFilename : "unknown",
                    "size", String.valueOf(file.getSize())
            ));

        } catch (IOException e) {
            System.err.println("❌ File upload failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    private String getInitials(String title) {
        if (title == null || title.isBlank()) return "??";
        String[] words = title.trim().split("\\s+");
        if (words.length == 1) {
            return words[0].substring(0, Math.min(2, words[0].length())).toUpperCase();
        }
        return (words[0].charAt(0) + "" + words[1].charAt(0)).toUpperCase();
    }

    private String getColorForType(String type) {
        return switch (type.toUpperCase()) {
            case "PDF" -> "#ef4444";
            case "EXAM" -> "#f59e0b";
            case "BOOK" -> "#6366f1";
            case "CHILDREN_MATERIAL" -> "#10b981";
            default -> "#6366f1";
        };
    }
}



