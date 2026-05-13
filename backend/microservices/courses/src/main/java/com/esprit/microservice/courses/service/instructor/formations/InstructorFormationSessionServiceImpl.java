package com.esprit.microservice.courses.service.instructor.formations;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.entity.formations.FormationSession;
import com.esprit.microservice.courses.repository.FormationRepository;
import com.esprit.microservice.courses.repository.FormationSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstructorFormationSessionServiceImpl implements InstructorFormationSessionService {

    private final FormationRepository formationRepository;
    private final FormationSessionRepository formationSessionRepository;

    public InstructorFormationSessionServiceImpl(FormationRepository formationRepository,
                                                 FormationSessionRepository formationSessionRepository) {
        this.formationRepository = formationRepository;
        this.formationSessionRepository = formationSessionRepository;
    }

    @Override
    public FormationSession createSession(Long formationId, Long instructorId, FormationSession session) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + formationId));

        if (!formation.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not allowed to add sessions to this formation");
        }

        session.setId(null);
        session.setFormation(formation);

        return formationSessionRepository.save(session);
    }

    @Override
    public List<FormationSession> getSessionsByFormationForInstructor(Long formationId, Long instructorId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + formationId));

        if (!formation.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not allowed to access sessions of this formation");
        }

        return formationSessionRepository.findByFormation_IdOrderBySessionDateAscStartTimeAsc(formationId);
    }


    @Override
    public FormationSession getSessionByIdForInstructor(Long sessionId, Long instructorId) {
        FormationSession session = formationSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        if (!session.getFormation().getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not allowed to access this session");
        }

        return session;
    }

    @Override
    public FormationSession updateSession(Long sessionId, Long instructorId, FormationSession updatedSession) {
        FormationSession existingSession = formationSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        if (!existingSession.getFormation().getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not allowed to update this session");
        }

        existingSession.setSessionDate(updatedSession.getSessionDate());
        existingSession.setStartTime(updatedSession.getStartTime());
        existingSession.setEndTime(updatedSession.getEndTime());
        existingSession.setRoom(updatedSession.getRoom());
        existingSession.setTopic(updatedSession.getTopic());

        return formationSessionRepository.save(existingSession);
    }

    @Override
    public void deleteSession(Long sessionId, Long instructorId) {
        FormationSession session = formationSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        if (!session.getFormation().getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not allowed to delete this session");
        }

        formationSessionRepository.delete(session);
    }

}