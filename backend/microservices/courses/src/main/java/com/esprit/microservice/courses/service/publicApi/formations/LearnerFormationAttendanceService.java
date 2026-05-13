package com.esprit.microservice.courses.service.publicApi.formations;

import com.esprit.microservice.courses.dto.training.FormationAttendanceSummaryDTO;

public interface LearnerFormationAttendanceService {
    FormationAttendanceSummaryDTO getMyAttendance(Long formationId, Long userId);
}