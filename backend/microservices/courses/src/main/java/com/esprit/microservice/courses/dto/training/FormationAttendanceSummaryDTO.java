package com.esprit.microservice.courses.dto.training;

import java.util.List;

public class FormationAttendanceSummaryDTO {

    private Long formationId;
    private int totalSessions;
    private int presentCount;
    private int absentCount;
    private int lateCount;
    private int notMarkedCount;
    private double attendanceRate;
    private List<FormationAttendanceSessionDTO> sessions;

    public FormationAttendanceSummaryDTO() {
    }

    public Long getFormationId() {
        return formationId;
    }

    public void setFormationId(Long formationId) {
        this.formationId = formationId;
    }

    public int getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(int totalSessions) {
        this.totalSessions = totalSessions;
    }

    public int getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(int presentCount) {
        this.presentCount = presentCount;
    }

    public int getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(int absentCount) {
        this.absentCount = absentCount;
    }

    public int getLateCount() {
        return lateCount;
    }

    public void setLateCount(int lateCount) {
        this.lateCount = lateCount;
    }

    public int getNotMarkedCount() {
        return notMarkedCount;
    }

    public void setNotMarkedCount(int notMarkedCount) {
        this.notMarkedCount = notMarkedCount;
    }

    public double getAttendanceRate() {
        return attendanceRate;
    }

    public void setAttendanceRate(double attendanceRate) {
        this.attendanceRate = attendanceRate;
    }

    public List<FormationAttendanceSessionDTO> getSessions() {
        return sessions;
    }

    public void setSessions(List<FormationAttendanceSessionDTO> sessions) {
        this.sessions = sessions;
    }
}