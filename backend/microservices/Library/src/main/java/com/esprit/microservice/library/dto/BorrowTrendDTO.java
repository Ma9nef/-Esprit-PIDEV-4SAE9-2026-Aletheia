package com.esprit.microservice.library.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowTrendDTO {
    private int year;
    private int month;
    private String monthLabel;
    private long borrowCount;

    public BorrowTrendDTO(int year, int month, long borrowCount) {
        this.year = year;
        this.month = month;
        this.monthLabel = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        this.borrowCount = borrowCount;
    }
}
