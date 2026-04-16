package com.esprit.microservice.courses.service.instructor.formations;

import com.esprit.microservice.courses.entity.formations.FormationSession;

import java.util.List;

public interface InstructorFormationSessionService {
    FormationSession createSession(Long formationId, Long instructorId, FormationSession session);
    List<FormationSession> getSessionsByFormationForInstructor(Long formationId, Long instructorId);
    FormationSession getSessionByIdForInstructor(Long sessionId, Long instructorId);
    FormationSession updateSession(Long sessionId, Long instructorId, FormationSession updatedSession);
    void deleteSession(Long sessionId, Long instructorId);
}