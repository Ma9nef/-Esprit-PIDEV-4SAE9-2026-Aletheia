package com.esprit.microservice.courses.service.publicApi.formations;

import com.esprit.microservice.courses.dto.training.FormationAttendanceSessionDTO;
import com.esprit.microservice.courses.dto.training.FormationAttendanceSummaryDTO;
import com.esprit.microservice.courses.entity.formations.AttendanceStatus;
import com.esprit.microservice.courses.entity.formations.FormationAttendance;
import com.esprit.microservice.courses.entity.formations.FormationSession;
import com.esprit.microservice.courses.repository.FormationAttendanceRepository;
import com.esprit.microservice.courses.repository.FormationSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LearnerFormationAttendanceServiceImpl implements LearnerFormationAttendanceService {

    private final FormationSessionRepository formationSessionRepository;
    private final FormationAttendanceRepository formationAttendanceRepository;

    public LearnerFormationAttendanceServiceImpl(
            FormationSessionRepository formationSessionRepository,
            FormationAttendanceRepository formationAttendanceRepository
    ) {
        this.formationSessionRepository = formationSessionRepository;
        this.formationAttendanceRepository = formationAttendanceRepository;
    }

    @Override
    public FormationAttendanceSummaryDTO getMyAttendance(Long formationId, Long userId) {

        List<FormationSession> sessions =
                formationSessionRepository.findByFormation_IdOrderBySessionDateAscStartTimeAsc(formationId);

        List<FormationAttendance> attendances =
                formationAttendanceRepository
                        .findByFormationSession_Formation_IdAndUserIdOrderByFormationSession_SessionDateAsc(
                                formationId, userId
                        );

        Map<Long, AttendanceStatus> attendanceMap = new HashMap<>();
        for (FormationAttendance attendance : attendances) {
            attendanceMap.put(attendance.getFormationSession().getId(), attendance.getStatus());
        }

        List<FormationAttendanceSessionDTO> sessionDTOs = sessions.stream()
                .map(session -> {
                    AttendanceStatus status = attendanceMap.getOrDefault(
                            session.getId(),
                            AttendanceStatus.NOT_MARKED
                    );

                    LocalDateTime sessionDateTime =
                            session.getSessionDate().atTime(session.getStartTime());

                    return new FormationAttendanceSessionDTO(
                            session.getId(),
                            session.getTopic(),
                            sessionDateTime,
                            status
                    );
                })
                .collect(Collectors.toList());

        int totalSessions = sessionDTOs.size();

        int presentCount = (int) sessionDTOs.stream()
                .filter(s -> s.getStatus() == AttendanceStatus.PRESENT)
                .count();

        int absentCount = (int) sessionDTOs.stream()
                .filter(s -> s.getStatus() == AttendanceStatus.ABSENT)
                .count();

        int lateCount = (int) sessionDTOs.stream()
                .filter(s -> s.getStatus() == AttendanceStatus.LATE)
                .count();

        int notMarkedCount = (int) sessionDTOs.stream()
                .filter(s -> s.getStatus() == AttendanceStatus.NOT_MARKED)
                .count();

        double attendanceRate = totalSessions == 0
                ? 0.0
                : ((double) presentCount / totalSessions) * 100.0;

        FormationAttendanceSummaryDTO dto = new FormationAttendanceSummaryDTO();
        dto.setFormationId(formationId);
        dto.setTotalSessions(totalSessions);
        dto.setPresentCount(presentCount);
        dto.setAbsentCount(absentCount);
        dto.setLateCount(lateCount);
        dto.setNotMarkedCount(notMarkedCount);
        dto.setAttendanceRate(attendanceRate);
        dto.setSessions(sessionDTOs);

        return dto;
    }
}