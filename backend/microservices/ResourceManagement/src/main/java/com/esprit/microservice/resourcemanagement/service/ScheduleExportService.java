package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleExportService {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("EEE dd/MM");
    private static final Set<ReservationStatus> EXPORT_STATUSES =
            Set.of(ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN);

    private final ReservationRepository reservationRepository;

    /**
     * Generate a PDF timetable for an instructor over a date range.
     */
    public byte[] exportPdf(String instructorId, LocalDate from, LocalDate to) {
        List<Reservation> reservations = getExportableReservations(instructorId, from, to);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font titleFont  = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
            Font cellFont   = new Font(Font.HELVETICA, 8);

            doc.add(new Paragraph(
                    "Schedule: " + instructorId + "  (" + from + " → " + to + ")", titleFont));
            doc.add(new Paragraph(" "));

            if (reservations.isEmpty()) {
                doc.add(new Paragraph("No confirmed reservations in this period.", cellFont));
                doc.close();
                return out.toByteArray();
            }

            // Simple list table: Date | Time | Resource | Course
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2f, 2f, 3f, 3f});

            addHeaderCell(table, "Date",     headerFont);
            addHeaderCell(table, "Time",     headerFont);
            addHeaderCell(table, "Resource", headerFont);
            addHeaderCell(table, "Session",  headerFont);

            for (Reservation r : reservations) {
                String date = r.getStartTime().format(DATE_FMT);
                String time = r.getStartTime().format(TIME_FMT) + " – " + r.getEndTime().format(TIME_FMT);
                String resource = r.getResource() != null
                        ? r.getResource().getName() + (r.getResource().getLocation() != null
                                ? " (" + r.getResource().getLocation() + ")" : "")
                        : "—";
                String session = r.getTeachingSession() != null
                        ? r.getTeachingSession().getTitle()
                          + (r.getTeachingSession().getCourseCode() != null
                                  ? " [" + r.getTeachingSession().getCourseCode() + "]" : "")
                        : "—";

                addCell(table, date,     cellFont);
                addCell(table, time,     cellFont);
                addCell(table, resource, cellFont);
                addCell(table, session,  cellFont);
            }

            doc.add(table);
            doc.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF schedule", e);
        }
    }

    /**
     * Generate an iCalendar (.ics) feed for an instructor — public endpoint, no auth required.
     */
    public byte[] exportIcal(String instructorId) {
        LocalDate from = LocalDate.now().minusDays(30);
        LocalDate to   = LocalDate.now().plusDays(90);
        List<Reservation> reservations = getExportableReservations(instructorId, from, to);

        StringBuilder sb = new StringBuilder();
        sb.append("BEGIN:VCALENDAR\r\n");
        sb.append("VERSION:2.0\r\n");
        sb.append("PRODID:-//Aletheia//Resource Management//EN\r\n");
        sb.append("CALSCALE:GREGORIAN\r\n");
        sb.append("METHOD:PUBLISH\r\n");

        DateTimeFormatter ical = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");

        for (Reservation r : reservations) {
            sb.append("BEGIN:VEVENT\r\n");
            sb.append("UID:").append(r.getId()).append("@aletheia.esprit.tn\r\n");
            sb.append("DTSTART:").append(r.getStartTime().format(ical)).append("\r\n");
            sb.append("DTEND:").append(r.getEndTime().format(ical)).append("\r\n");
            sb.append("SUMMARY:").append(escape(
                    r.getTeachingSession() != null ? r.getTeachingSession().getTitle() : "Reservation"))
                    .append("\r\n");
            if (r.getResource() != null && r.getResource().getLocation() != null) {
                sb.append("LOCATION:").append(escape(r.getResource().getLocation())).append("\r\n");
            }
            if (r.getTeachingSession() != null && r.getTeachingSession().getCourseCode() != null) {
                sb.append("DESCRIPTION:Course: ").append(r.getTeachingSession().getCourseCode()).append("\r\n");
            }
            sb.append("STATUS:CONFIRMED\r\n");
            sb.append("END:VEVENT\r\n");
        }

        sb.append("END:VCALENDAR\r\n");
        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private List<Reservation> getExportableReservations(String instructorId,
                                                         LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end   = to.atTime(23, 59, 59);
        return reservationRepository.findByInstructorIdAndDeletedFalse(instructorId).stream()
                .filter(r -> EXPORT_STATUSES.contains(r.getStatus()))
                .filter(r -> !r.getStartTime().isBefore(start) && !r.getEndTime().isAfter(end))
                .sorted((a, b) -> a.getStartTime().compareTo(b.getStartTime()))
                .collect(Collectors.toList());
    }

    private void addHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(new Color(51, 122, 183));
        cell.setPadding(5);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(4);
        table.addCell(cell);
    }

    private String escape(String s) {
        return s.replace(",", "\\,").replace(";", "\\;").replace("\n", "\\n");
    }
}
