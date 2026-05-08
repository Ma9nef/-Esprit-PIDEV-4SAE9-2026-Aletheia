package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.response.InstructorProfileResponse;
import com.esprit.microservice.resourcemanagement.entity.InstructorProfile;
import com.esprit.microservice.resourcemanagement.repository.InstructorProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class InstructorProfileService {

    private final InstructorProfileRepository profileRepository;

    /** Returns existing profile or creates one with default score 100. */
    public InstructorProfile getOrCreate(String instructorId) {
        return profileRepository.findById(instructorId).orElseGet(() -> {
            InstructorProfile profile = InstructorProfile.builder()
                    .instructorId(instructorId)
                    .reputationScore(100)
                    .totalReservations(0)
                    .noShowCount(0)
                    .lateCancellationCount(0)
                    .isTrusted(true)   // starts at 100 ≥ 80
                    .build();
            return profileRepository.save(profile);
        });
    }

    @Transactional(readOnly = true)
    public InstructorProfileResponse getProfile(String instructorId) {
        InstructorProfile profile = profileRepository.findById(instructorId)
                .orElseGet(() -> InstructorProfile.builder()
                        .instructorId(instructorId)
                        .reputationScore(100)
                        .totalReservations(0)
                        .noShowCount(0)
                        .lateCancellationCount(0)
                        .isTrusted(true)
                        .build());
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public List<InstructorProfileResponse> leaderboard() {
        return profileRepository.findAllByOrderByReputationScoreDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Adjust reputation score by delta, clamped to [0, 100].
     * Recalculates isTrusted.
     */
    public void adjustScore(String instructorId, int delta) {
        InstructorProfile profile = getOrCreate(instructorId);
        profile.adjustScore(delta);
        profileRepository.save(profile);
        log.debug("Adjusted score for {} by {} → new score {}", instructorId, delta, profile.getReputationScore());
    }

    /** Admin manual adjustment with a reason (same mechanics, audit caller is responsible). */
    public InstructorProfileResponse manualAdjust(String instructorId, int delta) {
        InstructorProfile profile = getOrCreate(instructorId);
        profile.adjustScore(delta);
        return toResponse(profileRepository.save(profile));
    }

    public void incrementReservations(String instructorId) {
        InstructorProfile profile = getOrCreate(instructorId);
        profile.setTotalReservations(profile.getTotalReservations() + 1);
        profileRepository.save(profile);
    }

    public void recordNoShow(String instructorId) {
        InstructorProfile profile = getOrCreate(instructorId);
        profile.setNoShowCount(profile.getNoShowCount() + 1);
        profile.adjustScore(-20);
        profileRepository.save(profile);
    }

    public void recordLateCancellation(String instructorId, int minutesBefore) {
        InstructorProfile profile = getOrCreate(instructorId);
        profile.setLateCancellationCount(profile.getLateCancellationCount() + 1);
        int delta = minutesBefore < 120 ? -10 : -5;
        profile.adjustScore(delta);
        profileRepository.save(profile);
    }

    public void recordCheckIn(String instructorId) {
        adjustScore(instructorId, +5);
    }

    // ── helpers ───────────────────────────────────────────────────────────

    public InstructorProfileResponse toResponse(InstructorProfile p) {
        return InstructorProfileResponse.builder()
                .instructorId(p.getInstructorId())
                .reputationScore(p.getReputationScore())
                .totalReservations(p.getTotalReservations())
                .noShowCount(p.getNoShowCount())
                .lateCancellationCount(p.getLateCancellationCount())
                .isTrusted(p.getIsTrusted())
                .lastUpdated(p.getLastUpdated())
                .build();
    }
}
