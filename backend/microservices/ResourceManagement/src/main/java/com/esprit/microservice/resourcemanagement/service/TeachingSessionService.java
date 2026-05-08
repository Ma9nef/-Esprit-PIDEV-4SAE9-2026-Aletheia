package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateTeachingSessionRequest;
import com.esprit.microservice.resourcemanagement.dto.response.TeachingSessionResponse;
import com.esprit.microservice.resourcemanagement.entity.TeachingSession;
import com.esprit.microservice.resourcemanagement.repository.TeachingSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TeachingSessionService {

    private final TeachingSessionRepository sessionRepository;

    @Transactional(readOnly = true)
    public List<TeachingSessionResponse> listOwn(String instructorId) {
        return sessionRepository.findByInstructorId(instructorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeachingSessionResponse getById(UUID id, String instructorId) {
        TeachingSession session = findOrThrow(id);
        if (!session.getInstructorId().equals(instructorId)) {
            throw new IllegalArgumentException("Session does not belong to current instructor");
        }
        return toResponse(session);
    }

    public TeachingSessionResponse create(CreateTeachingSessionRequest req, String instructorId) {
        TeachingSession session = TeachingSession.builder()
                .title(req.getTitle())
                .courseCode(req.getCourseCode())
                .instructorId(instructorId)
                .module(req.getModule())
                .expectedAttendees(req.getExpectedAttendees())
                .sessionType(req.getSessionType())
                .build();
        return toResponse(sessionRepository.save(session));
    }

    public TeachingSessionResponse update(UUID id, CreateTeachingSessionRequest req, String instructorId) {
        TeachingSession session = findOrThrow(id);
        if (!session.getInstructorId().equals(instructorId)) {
            throw new IllegalArgumentException("Session does not belong to current instructor");
        }
        if (req.getTitle() != null)             session.setTitle(req.getTitle());
        if (req.getCourseCode() != null)        session.setCourseCode(req.getCourseCode());
        if (req.getModule() != null)            session.setModule(req.getModule());
        if (req.getExpectedAttendees() != null) session.setExpectedAttendees(req.getExpectedAttendees());
        if (req.getSessionType() != null)       session.setSessionType(req.getSessionType());
        return toResponse(sessionRepository.save(session));
    }

    // ── helpers ───────────────────────────────────────────────────────────

    public TeachingSession findOrThrow(UUID id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Teaching session not found: " + id));
    }

    public TeachingSessionResponse toResponse(TeachingSession s) {
        return TeachingSessionResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .courseCode(s.getCourseCode())
                .instructorId(s.getInstructorId())
                .module(s.getModule())
                .expectedAttendees(s.getExpectedAttendees())
                .sessionType(s.getSessionType())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
