package com.esprit.microservice.courses.dto.lesson.admin;

public class LessonAdminDTO {
    private Long id;
    private Long courseId;

    private String title;
    private String contentText;
    private String youtubeVideoId;
    private String pdfRef;
    private Integer orderIndex;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public String getYoutubeVideoId() { return youtubeVideoId; }
    public void setYoutubeVideoId(String youtubeVideoId) { this.youtubeVideoId = youtubeVideoId; }

    public String getPdfRef() { return pdfRef; }
    public void setPdfRef(String pdfRef) { this.pdfRef = pdfRef; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
