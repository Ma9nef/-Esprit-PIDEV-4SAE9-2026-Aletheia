package com.esprit.microservice.courses.dto.lesson.command;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LessonUpsertDTO {

    @NotNull
    private Long courseId;

    @NotBlank
    @Size(max = 160)
    private String title;

    private String contentText;

    @Size(max = 32)
    private String youtubeVideoId;

    @Size(max = 255)
    private String pdfRef;

    @NotNull
    @Min(1)
    private Integer orderIndex;

    // getters/setters
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
