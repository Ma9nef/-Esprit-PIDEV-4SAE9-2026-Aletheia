# ResourceManagement Microservice — Full Redesign Spec
**Date:** 2026-04-15  
**Branch:** Library_managment  
**Project:** Aletheia – PIDEV 4SAE9, Esprit School of Engineering  
**Approach:** Rebuild domain + business logic; keep Spring Boot infrastructure (JWT filter, Kafka config, Feign, exception handler)

---

## 1. Purpose

The ResourceManagement microservice manages teaching resources (rooms, labs, equipment) that instructors reserve for face-to-face sessions. It replaces a generic booking system with an instructor-centric, academically-aware platform featuring smart suggestions, reputation scoring, QR check-in, conflict intelligence (swap requests), recurring bookings with partial success, utilization analytics, and schedule export.

---

## 2. Actors & Roles

| Role | Capabilities |
|---|---|
| **Admin** | Full CRUD on resources, approve/reject reservations, view all reservations, manage maintenance windows, view all instructor profiles, manually adjust reputation scores, access all statistics |
| **Instructor** | Create teaching sessions, book resources (single + recurring), cancel own reservations, view availability, get smart suggestions, send/respond to swap requests, join waitlists, check in via QR, export own schedule, view own reputation profile |
| **Student** | Read-only: browse resource schedules (which room/lab is occupied and by which course), no booking capability |

JWT roles extracted from token: `ADMIN`, `INSTRUCTOR`, `STUDENT`.

---

## 3. Resource Types

```java
public enum ResourceType {
    // Require admin approval by default
    CLASSROOM,
    COMPUTER_LAB,
    AMPHITHEATER,

    // Auto-confirm by default
    PROJECTOR,
    LAPTOP,
    SMARTBOARD,

    // Admin-configurable
    CUSTOM_EQUIPMENT
}
```

`requiresApproval` is a per-resource boolean flag. The default is determined by type at creation time but can be overridden by admin at any time.

---

## 4. Domain Model

### 4.1 Resource
```
id                    UUID        PK
name                  String      "Room B204", "Projector #3"
type                  ResourceType
capacity              Integer     seats (rooms) or workstations (labs); null for equipment
location              String      "Building B, Floor 2"
requiresApproval      Boolean     smart hybrid: large resources need admin approval
conditionScore        Integer     1–5, updated after session reports
maintenanceStatus     enum        OPERATIONAL | UNDER_MAINTENANCE | OUT_OF_SERVICE
attributesJson        TEXT        dynamic JSON map (AC, lumen rating, OS, etc.)
maxReservationHours   Integer     per-resource override; null = global default (8h)
minAdvanceBookingHours Integer    null = no minimum (trusted instructors bypass this)
deleted               Boolean     soft delete
createdAt / updatedAt LocalDateTime
```

### 4.2 TeachingSession
Replaces the old `eventId` string coupling to the Events microservice.
```
id                UUID        PK
title             String      "Advanced DB – Lab 3"
courseCode        String      "4SAE9-DB"
instructorId      String      JWT subject claim
module            String      "Databases", "Networks"
expectedAttendees Integer     used for smart suggestions (capacity matching)
sessionType       enum        LECTURE | LAB | EXAM | WORKSHOP
createdAt         LocalDateTime
```

### 4.3 Reservation
```
id                  UUID        PK
resourceId          UUID        FK → Resource
teachingSessionId   UUID        FK → TeachingSession
startTime           LocalDateTime
endTime             LocalDateTime
status              ReservationStatus
recurrenceGroupId   UUID        null for one-off bookings
qrCodeToken         String      UUID token, generated on CONFIRMED
checkedInAt         LocalDateTime   null until QR scanned
noShow              Boolean     set by scheduler 30 min after startTime if not checked in
rejectionReason     String      filled by admin on reject
cancellationReason  String
expiresAt           LocalDateTime   TTL for PENDING reservations (24h)
version             Long        optimistic locking (@Version)
deleted             Boolean     soft delete
createdAt / updatedAt LocalDateTime
```

**ReservationStatus:**
```
PENDING → CONFIRMED → CHECKED_IN → COMPLETED
PENDING → REJECTED
PENDING | CONFIRMED → CANCELLED
```

### 4.4 RecurrenceGroup
```
id           UUID        PK
pattern      enum        WEEKLY | BIWEEKLY
dayOfWeek    DayOfWeek   e.g. TUESDAY
startTime    LocalTime   e.g. 09:00
endTime      LocalTime   e.g. 11:00
endDate      LocalDate   last occurrence date
createdBy    String      instructorId
totalSlots   Integer     attempted
bookedSlots  Integer     successfully booked
createdAt    LocalDateTime
```

### 4.5 InstructorProfile
```
instructorId         String      PK (JWT subject)
reputationScore      Integer     0–100, starts at 100
totalReservations    Integer
noShowCount          Integer
lateCancellationCount Integer
isTrusted            Boolean     score >= 80
lastUpdated          LocalDateTime
```

**Score adjustment rules:**

| Event | Delta |
|---|---|
| Check-in on time | +5 |
| Cancellation < 24h before start | −5 |
| Cancellation < 2h before start | −10 |
| No-show detected by scheduler | −20 |
| Admin manual adjustment | ± configurable |

**Trusted instructor perks (score ≥ 80):**
- Bypass `minAdvanceBookingHours` policy
- Priority position in waitlist (inserted at position 1)
- `requiresApproval` resources auto-confirm if score ≥ 90

### 4.6 WaitlistEntry
```
id           UUID        PK
resourceId   UUID        FK → Resource
instructorId String
startTime    LocalDateTime
endTime      LocalDateTime
position     Integer     ordered queue position
status       enum        WAITING | NOTIFIED | EXPIRED | CONVERTED
notifiedAt   LocalDateTime
createdAt    LocalDateTime
```

### 4.7 MaintenanceWindow
```
id           UUID        PK
resourceId   UUID        FK → Resource
title        String      "Annual projector servicing"
startTime    LocalDateTime
endTime      LocalDateTime
notes        TEXT
createdBy    String      adminId
createdAt    LocalDateTime
```

### 4.8 SwapRequest
```
id                UUID        PK
requesterId       String      instructor A (initiator)
targetId          String      instructor B (holder of wanted slot)
requesterReservationId UUID   A's reservation (offered slot)
targetReservationId    UUID   B's reservation (wanted slot)
status            enum        PENDING | ACCEPTED | REJECTED | EXPIRED
requesterNote     String      optional message from A
responseNote      String      optional message from B
expiresAt         LocalDateTime   24h TTL
resolvedAt        LocalDateTime
createdAt         LocalDateTime
```

### 4.9 CheckInEvent
```
id              UUID        PK
reservationId   UUID        FK → Reservation
scannedAt       LocalDateTime
tokenUsed       String      the QR token that was scanned
valid           Boolean     false if token mismatch or outside time window
```

### 4.10 ReservationAuditLog
```
id              UUID        PK
reservationId   UUID
action          String      CREATED | CONFIRMED | REJECTED | CANCELLED | CHECKED_IN | NO_SHOW | SWAP_APPLIED
oldStatus       String
newStatus       String
performedBy     String      actorId (instructor or admin)
details         JSON map    contextual data
timestamp       LocalDateTime
```

---

## 5. Service Layer

### 5.1 ResourceService
- CRUD with soft delete
- Search: filter by type, location, min capacity, availability window
- `updateConditionScore(resourceId, score, adminId)` — audit logged
- On create: auto-set `requiresApproval` from type default, admin can override

### 5.2 ReservationService
Core booking engine with smart hybrid approval:

```
① Validate: endTime > startTime, duration ≤ maxReservationHours
② Load InstructorProfile — score < 50 → force requiresApproval = true
③ Check resource not UNDER_MAINTENANCE or OUT_OF_SERVICE
④ Check no MaintenanceWindow overlaps requested slot
⑤ Booking policy: minAdvanceBookingHours (skip if instructor isTrusted)
⑥ Conflict detection with pessimistic lock (SELECT FOR UPDATE)
   └─ conflict found → return smart suggestions, throw ReservationConflictException
⑦ resource.requiresApproval == true?
   ├── YES → status = PENDING, expiresAt = now+24h, publish rm.approval.needed
   └── NO  → status = CONFIRMED, generate qrCodeToken, publish rm.reservation.confirmed
⑧ Save ReservationAuditLog entry
```

Confirm (Admin): PENDING → CONFIRMED, generate QR token, publish `rm.reservation.confirmed`  
Reject (Admin): PENDING → REJECTED, save reason, publish `rm.reservation.rejected`  
Cancel: any non-CANCELLED → CANCELLED, score penalty if < 24h, trigger waitlist processing

### 5.3 RecurrenceService
```
① Create RecurrenceGroup (pattern, day, times, endDate)
② Enumerate all occurrence dates between now and endDate
③ For each date: attempt ReservationService.createReservation()
   ├── success → add to bookedSlots list
   └── conflict/maintenance → add to skippedSlots list (non-fatal)
④ Update RecurrenceGroup.bookedSlots / totalSlots
⑤ Return RecurrenceResult { groupId, bookedSlots: [...], skippedSlots: [{date, reason}] }
```

All slots in a group share `recurrenceGroupId`. Admin can cancel the entire group atomically.

### 5.4 AvailabilityService
- **Check:** is resource X free from T1→T2? Returns `{ available, nextFreeWindow }`
- **Smart Suggest:** when unavailable, score alternatives:
  - Filter: same type, capacity ≥ expectedAttendees, not under maintenance
  - Score each by: location proximity (string match on building prefix = +2) + conditionScore + (1 − utilizationRate)
  - Return top 3 with human-readable reason string
- **Browse:** "show me free COMPUTER_LAB slots next Tuesday 8am–6pm, capacity ≥ 30"

### 5.5 CheckInService
- QR token = `UUID.randomUUID().toString()` stored on Reservation at confirmation
- `generateQrCode(reservationId)` → returns PNG image bytes (ZXing) encoding the token
- `validateScan(token)`:
  - Find reservation by token
  - Check `scannedAt` is within [startTime − 15min, startTime + 15min]
  - Set `checkedInAt`, status → CHECKED_IN
  - Save CheckInEvent, publish `rm.reservation.checkin`
  - Trigger InstructorProfileService score +5
- **No-show scheduler** (runs every 5 min): finds CONFIRMED reservations where `startTime + 30min < now` and `checkedInAt IS NULL` → set `noShow = true`, score −20, publish `rm.noshow.detected`

### 5.6 SwapRequestService
- `requestSwap(requesterId, targetReservationId, note)`:
  - Validate both reservations are CONFIRMED, belong to their respective instructors
  - Create SwapRequest (PENDING, expires in 24h)
  - Publish `rm.swap.requested`
- `acceptSwap(swapId, targetId)`:
  - In single transaction: swap `startTime`/`endTime` between the two reservations
  - Regenerate QR tokens for both
  - Status → ACCEPTED, publish `rm.swap.resolved`
  - Audit log both reservations
- `rejectSwap(swapId, note)`: status → REJECTED, publish `rm.swap.resolved`
- Scheduler: expire PENDING swaps older than 24h

### 5.7 InstructorProfileService
- Lazy-create: profile created on first reservation if not exists
- `adjustScore(instructorId, delta, reason)` — clamps to [0, 100], recalculates `isTrusted`
- `getLeaderboard()` → all profiles sorted by score DESC
- Admin manual adjustment: audit logged with reason

### 5.8 StatisticsService
All methods `@Transactional(readOnly = true)`.

Per resource:
- Utilization % = confirmed hours / period hours × 100
- Peak hours heatmap (hour-of-day × count)
- Busiest days (day-of-week × count)
- Cancellation rate, no-show rate, avg reservation duration

Platform-wide:
- Most-booked resources (top 10)
- Most-active instructors (by reservation count)
- Underutilized resources (utilization < 20% in last 30 days)
- Platform utilization trend (daily/weekly rollup)

### 5.9 ScheduleExportService
- **PDF:** instructor's CONFIRMED/CHECKED_IN reservations in a date range → weekly timetable grid using OpenPDF (iText fork). Columns = days, rows = hours.
- **iCal:** RFC 5545 `.ics` file. Each reservation = `VEVENT` with `SUMMARY` (course title), `LOCATION` (resource location), `DTSTART`/`DTEND`. URL is public (no auth) per instructor so it can be subscribed to in Google Calendar/Outlook.

---

## 6. REST API

All routes prefixed `/api/rm` at gateway level (rewritten to `/api` inside service).

### Resources `[ADMIN]`
```
GET    /api/resources                    List (filter: type, location, capacity)
POST   /api/resources                    Create
GET    /api/resources/{id}               Get by ID
PUT    /api/resources/{id}               Update
DELETE /api/resources/{id}               Soft delete
PATCH  /api/resources/{id}/condition     Update condition score (body: { score: 1-5 })
```

### Availability `[ALL]`
```
POST   /api/availability/check           { resourceId, startTime, endTime } → available + nextFreeWindow
POST   /api/availability/suggest         { resourceId, startTime, endTime, expectedAttendees } → top 3 alternatives
GET    /api/availability/browse          ?type=COMPUTER_LAB&date=2026-04-20&minCapacity=30 → free slots
```

### Teaching Sessions `[INSTRUCTOR]`
```
POST   /api/sessions                     Create session
GET    /api/sessions                     List own sessions
GET    /api/sessions/{id}               Get session
PUT    /api/sessions/{id}               Update session
```

### Reservations `[INSTRUCTOR + ADMIN]`
```
POST   /api/reservations                 Book (single)
POST   /api/reservations/recurrence      Smart recurring booking
GET    /api/reservations                 Own [INSTRUCTOR] / All [ADMIN]
GET    /api/reservations/{id}           Detail
GET    /api/reservations/group/{groupId} All slots in recurrence group
POST   /api/reservations/{id}/cancel     Cancel with reason
DELETE /api/reservations/group/{groupId} Cancel entire group [ADMIN]
```

### Admin Approval `[ADMIN]`
```
GET    /api/reservations/pending         All PENDING awaiting approval
POST   /api/reservations/{id}/approve    Approve → CONFIRMED + QR generated
POST   /api/reservations/{id}/reject     Reject with reason
```

### Check-In `[INSTRUCTOR + ADMIN]`
```
GET    /api/checkin/{reservationId}/qr   Get QR code PNG image
POST   /api/checkin/scan                 { token } → validate and mark CHECKED_IN
GET    /api/checkin/reservation/{id}     Get check-in record
```

### Swap Requests `[INSTRUCTOR]`
```
POST   /api/swaps                        Send swap request
GET    /api/swaps                        Own incoming + outgoing
POST   /api/swaps/{id}/accept            Accept (atomic swap)
POST   /api/swaps/{id}/reject            Reject
```

### Waitlist `[INSTRUCTOR]`
```
POST   /api/waitlist                     Join waitlist
GET    /api/waitlist                     Own positions
DELETE /api/waitlist/{id}               Leave waitlist
```

### Instructor Profile `[INSTRUCTOR + ADMIN]`
```
GET    /api/profile/me                   Own score, stats, history
GET    /api/profile/{instructorId}       Any profile [ADMIN]
GET    /api/profile/leaderboard          Ranked by score [ADMIN]
PATCH  /api/profile/{instructorId}/score Manual adjustment [ADMIN]
```

### Statistics `[ADMIN]`
```
GET    /api/stats/resources/{id}         Per-resource analytics (query params: from, to)
GET    /api/stats/platform               Platform-wide overview
GET    /api/stats/instructors            Most active instructors
GET    /api/stats/underutilized          Resources below utilization threshold
```

### Schedule Export
```
GET    /api/export/pdf                   PDF timetable [INSTRUCTOR - own]
GET    /api/export/ical/{instructorId}   iCal feed (public, no auth)
```

### Maintenance Windows `[ADMIN]`
```
POST   /api/maintenance                  Schedule maintenance
GET    /api/maintenance/resource/{id}    List windows for resource
DELETE /api/maintenance/{id}             Remove window
```

---

## 7. Kafka Events

| Topic | Payload | Triggered by |
|---|---|---|
| `rm.reservation.created` | reservationId, instructorId, resourceId, times | New PENDING |
| `rm.reservation.confirmed` | reservationId, instructorId, resourceId, qrToken | Confirmed |
| `rm.reservation.rejected` | reservationId, instructorId, reason | Admin reject |
| `rm.reservation.cancelled` | reservationId, instructorId, reason | Any cancel |
| `rm.reservation.checkin` | reservationId, instructorId, scannedAt | QR scan |
| `rm.noshow.detected` | reservationId, instructorId, resourceId | Scheduler |
| `rm.approval.needed` | reservationId, resourceId, instructorId | Needs admin |
| `rm.swap.requested` | swapId, requesterId, targetId, slotDetails | Swap initiated |
| `rm.swap.resolved` | swapId, status, requesterId, targetId | Swap accepted/rejected |
| `rm.waitlist.notified` | waitlistEntryId, instructorId, resourceId | Slot opened |
| `rm.resource.condition.alert` | resourceId, resourceName, conditionScore | Score updated to ≤ 2 |

---

## 8. Infrastructure Kept from Existing Service

| Component | File | Status |
|---|---|---|
| JWT filter | `security/JwtAuthenticationFilter.java` | Keep, may clean up |
| JWT service | `security/JwtService.java` | Keep |
| JWT entry point | `security/JwtAuthEntryPoint.java` | Keep |
| Kafka config | `config/KafkaConfig.java` | Keep |
| Feign config | `config/FeignConfig.java` | Keep |
| JPA config | `config/JpaConfig.java` | Keep |
| Scheduling config | `config/SchedulingConfig.java` | Keep |
| Global exception handler | `exception/GlobalExceptionHandler.java` | Extend with new exceptions |
| application.properties | `resources/application.properties` | Extend |

All entities, repositories, services, controllers, DTOs, and mappers are replaced.

---

## 9. Database

Single MySQL database. Tables:

```
resources
teaching_sessions
reservations
recurrence_groups
instructor_profiles
waitlist_entries
maintenance_windows
swap_requests
checkin_events
reservation_audit_logs
```

JPA `ddl-auto=update` in development. Foreign keys enforced at DB level.  
Indexes on: `reservations(resource_id, start_time, end_time)`, `reservations(status)`, `reservations(recurrence_group_id)`, `instructor_profiles(reputation_score)`.

---

## 10. Key Business Rules Summary

1. Resources typed CLASSROOM, COMPUTER_LAB, AMPHITHEATER require admin approval by default.
2. Instructors with reputation score < 50 are forced through approval regardless of resource type.
3. Instructors with score ≥ 80 (trusted) bypass `minAdvanceBookingHours` and get priority waitlist position.
4. Instructors with score ≥ 90 auto-confirm even on approval-required resources.
5. Recurring bookings use partial success — failed slots are reported, not fatal.
6. QR scan window: ±15 minutes from `startTime`.
7. No-show detection: 30 minutes after `startTime` with no check-in.
8. Swap requests expire after 24 hours with no response.
9. PENDING reservations expire after 24 hours if not approved.
10. iCal export URL is public (no auth) to allow calendar subscription.
11. Condition score (1–5) on resource is informational; score ≤ 2 triggers admin alert via Kafka.
12. Cancellation within 2h of session: −10 score. Within 24h: −5. No-show: −20.
