package com.esprit.microservice.courses.dto.training;


import com.esprit.microservice.courses.entity.formations.AttendanceStatus;

import java.time.LocalDateTime;

public class FormationAttendanceSessionDTO {

    private Long sessionId;
    private String sessionTitle;
    private LocalDateTime sessionDateTime;
    private AttendanceStatus status;

    public FormationAttendanceSessionDTO() {
    }

    public FormationAttendanceSessionDTO(Long sessionId, String sessionTitle, LocalDateTime sessionDateTime, AttendanceStatus status) {
        this.sessionId = sessionId;
        this.sessionTitle = sessionTitle;
        this.sessionDateTime = sessionDateTime;
        this.status = status;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public LocalDateTime getSessionDateTime() {
        return sessionDateTime;
    }

    public void setSessionDateTime(LocalDateTime sessionDateTime) {
        this.sessionDateTime = sessionDateTime;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }
}
