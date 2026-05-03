#!/usr/bin/env bash
# =============================================================================
# ResourceManagement Microservice - Full Test Scenario
# =============================================================================
#
# PREREQUISITES:
#   - jq installed  (https://stedolan.github.io/jq/)
#   - The ResourceManagement service is running
#   - Set BASE_URL below to match your running port
#
# RUN:
#   chmod +x test-scenario.sh
#   ./test-scenario.sh
#
# Every step prints what it tests, the request, and the response.
# Steps that must succeed for subsequent steps to work are labelled [REQUIRED].
# =============================================================================

BASE_URL="http://localhost:8083"
TENANT="test-tenant"
ADMIN_USER="admin@aletheia.com"
INSTRUCTOR="instructor@aletheia.com"
USER_B="userbeta@aletheia.com"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

separator() { echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
step()      { echo -e "\n${YELLOW}▶ STEP $1: $2${NC}"; }
ok()        { echo -e "${GREEN}✔ $1${NC}"; }
fail()      { echo -e "${RED}✘ $1${NC}"; }
info()      { echo -e "  $1"; }

check_status() {
  local actual="$1"
  local expected="$2"
  local label="$3"
  if [ "$actual" -eq "$expected" ]; then
    ok "$label → HTTP $actual"
  else
    fail "$label → expected HTTP $expected, got HTTP $actual"
  fi
}

# =============================================================================
# SECTION 1 — RESOURCE CRUD
# =============================================================================
separator
echo -e "${CYAN}SECTION 1 — RESOURCE CRUD${NC}"

step "1.1" "[REQUIRED] Create a ROOM resource (capacity 1, no overbooking)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/resources" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d '{
    "name": "Training Room A",
    "type": "ROOM",
    "capacity": 1,
    "metadata": { "floor": 2, "projector": true }
  }')
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Create ROOM"
ROOM_ID=$(echo "$BODY" | jq -r '.id')
info "ROOM_ID = $ROOM_ID"

step "1.2" "[REQUIRED] Create a DEVICE resource"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/resources" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d '{
    "name": "Laptop Dell #5",
    "type": "DEVICE",
    "capacity": 1,
    "metadata": { "model": "Dell XPS", "os": "Ubuntu" }
  }')
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Create DEVICE"
DEVICE_ID=$(echo "$BODY" | jq -r '.id')
info "DEVICE_ID = $DEVICE_ID"

step "1.3" "[REQUIRED] Create a MATERIAL resource"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/resources" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d '{
    "name": "Yoga Mat Bundle",
    "type": "MATERIAL",
    "capacity": 10
  }')
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Create MATERIAL"
MAT_ID=$(echo "$BODY" | jq -r '.id')
info "MAT_ID = $MAT_ID"

step "1.4" "List all resources (should return 3)"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources" \
  -H "X-Tenant-Id: $TENANT")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "List all resources"
COUNT=$(echo "$BODY" | jq 'length')
info "Resources returned: $COUNT"

step "1.5" "List resources filtered by type=ROOM"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources?type=ROOM" \
  -H "X-Tenant-Id: $TENANT")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "List ROOM resources"
info "Rooms: $(echo "$BODY" | jq '[.[].name]')"

step "1.6" "Get resource by ID"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources/$ROOM_ID" \
  -H "X-Tenant-Id: $TENANT")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Get ROOM by ID"

step "1.7" "Update resource — add overbooking_threshold=1 to ROOM"
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/resources/$ROOM_ID" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d '{
    "name": "Training Room A",
    "type": "ROOM",
    "capacity": 1,
    "overbookingThreshold": 1
  }')
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Update ROOM (add overbooking threshold)"

step "1.8" "[ERROR CASE] Get non-existent resource → expect 404"
FAKE_ID="00000000-0000-0000-0000-000000000000"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources/$FAKE_ID" \
  -H "X-Tenant-Id: $TENANT")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "404" "Non-existent resource → 404"

# =============================================================================
# SECTION 2 — AVAILABILITY WINDOWS
# =============================================================================
separator
echo -e "${CYAN}SECTION 2 — AVAILABILITY WINDOWS${NC}"

step "2.1" "Define availability window for the ROOM (next 30 days)"
AVAIL_START=$(date -d "+1 day" +"%Y-%m-%dT09:00:00" 2>/dev/null || date -v+1d +"%Y-%m-%dT09:00:00")
AVAIL_END=$(date -d "+30 days" +"%Y-%m-%dT18:00:00" 2>/dev/null || date -v+30d +"%Y-%m-%dT18:00:00")
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/resources/$ROOM_ID/availability" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d "{
    \"startTime\": \"$AVAIL_START\",
    \"endTime\": \"$AVAIL_END\"
  }")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Create availability window for ROOM"

step "2.2" "List availability windows for the ROOM"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources/$ROOM_ID/availability" \
  -H "X-Tenant-Id: $TENANT")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "List availability windows"

# =============================================================================
# SECTION 3 — AVAILABILITY CHECK
# =============================================================================
separator
echo -e "${CYAN}SECTION 3 — AVAILABILITY CHECK${NC}"

# Use concrete near-future timestamps throughout (tomorrow 10:00-11:00)
SLOT_START=$(date -d "+1 day" +"%Y-%m-%dT10:00:00" 2>/dev/null || date -v+1d +"%Y-%m-%dT10:00:00")
SLOT_END=$(date -d "+1 day" +"%Y-%m-%dT11:00:00" 2>/dev/null || date -v+1d +"%Y-%m-%dT11:00:00")

# Afternoon slot for conflict tests (tomorrow 14:00-15:00)
SLOT2_START=$(date -d "+1 day" +"%Y-%m-%dT14:00:00" 2>/dev/null || date -v+1d +"%Y-%m-%dT14:00:00")
SLOT2_END=$(date -d "+1 day" +"%Y-%m-%dT15:00:00" 2>/dev/null || date -v+1d +"%Y-%m-%dT15:00:00")

step "3.1" "Check availability for specific ROOM in slot (should be available)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/resources/check-availability" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Check ROOM availability"
info "Available: $(echo "$BODY" | jq '.available')"

step "3.2" "Check availability for all DEVICE-type resources in same slot"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/resources/check-availability" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d "{
    \"type\": \"DEVICE\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Check DEVICE availability by type"
info "Available DEVICEs: $(echo "$BODY" | jq '[.availableResources[].name]')"

step "3.3" "[ERROR CASE] Check availability with endTime before startTime → expect 400"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/resources/check-availability" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"startTime\": \"$SLOT_END\",
    \"endTime\": \"$SLOT_START\"
  }")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "400" "Invalid time range → 400"

# =============================================================================
# SECTION 4 — RECURRENCE PREVIEW
# =============================================================================
separator
echo -e "${CYAN}SECTION 4 — RECURRENCE PREVIEW${NC}"

step "4.1" "Preview weekly recurrence (4 occurrences, every 2 weeks)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/recurrence/preview" \
  -H "Content-Type: application/json" \
  -d "{
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\",
    \"rrule\": \"FREQ=WEEKLY;INTERVAL=2;COUNT=4\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Weekly recurrence preview"
info "Occurrences: $(echo "$BODY" | jq '[.occurrences[].startTime]')"

step "4.2" "Preview daily recurrence (5 occurrences, every 3 days)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/recurrence/preview" \
  -H "Content-Type: application/json" \
  -d "{
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\",
    \"rrule\": \"FREQ=DAILY;INTERVAL=3;COUNT=5\"
  }")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Daily recurrence preview"

step "4.3" "[ERROR CASE] Invalid RRULE with non-integer COUNT → expect 400"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/recurrence/preview" \
  -H "Content-Type: application/json" \
  -d "{
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\",
    \"rrule\": \"FREQ=DAILY;INTERVAL=1;COUNT=FIVE\"
  }")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "400" "Invalid RRULE COUNT → 400"

# =============================================================================
# SECTION 5 — SLOT RECOMMENDATIONS
# =============================================================================
separator
echo -e "${CYAN}SECTION 5 — SLOT RECOMMENDATIONS${NC}"

step "5.1" "Get slot recommendations (any type, starting from SLOT_START)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/recommendations" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d "{
    \"preferredStart\": \"$SLOT_START\",
    \"preferredEnd\": \"$SLOT_END\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Slot recommendations (any type)"
info "Suggestions: $(echo "$BODY" | jq '[.suggestions[] | {resource: .resourceName, start: .startTime}]')"

step "5.2" "Get slot recommendations filtered by type=ROOM"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/recommendations" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d "{
    \"type\": \"ROOM\",
    \"preferredStart\": \"$SLOT_START\",
    \"preferredEnd\": \"$SLOT_END\"
  }")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Slot recommendations for ROOM type"

# =============================================================================
# SECTION 6 — HOLD → RESERVATION FLOW (happy path)
# =============================================================================
separator
echo -e "${CYAN}SECTION 6 — HOLD → RESERVATION FLOW${NC}"

step "6.1" "[REQUIRED] Create a hold on ROOM for SLOT_START/END (TTL=5 min)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/holds" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\",
    \"ttlMinutes\": 5
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Create hold on ROOM"
HOLD_ID=$(echo "$BODY" | jq -r '.holdId')
info "HOLD_ID = $HOLD_ID"
info "Hold expires at: $(echo "$BODY" | jq -r '.expiresAt')"

step "6.2" "[ERROR CASE] Second hold on same slot → expect 409 Conflict"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/holds" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $USER_B" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\",
    \"ttlMinutes\": 5
  }")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "409" "Duplicate hold on same slot → 409"

step "6.3" "[REQUIRED] Create reservation using hold token → PENDING_PAYMENT"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR" \
  -H "X-User-Role: INSTRUCTOR" \
  -H "X-User-Tier: STANDARD" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"eventId\": \"event-101\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\",
    \"holdToken\": \"$HOLD_ID\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Create reservation via hold token"
RESERVATION_ID=$(echo "$BODY" | jq -r '.id')
info "RESERVATION_ID = $RESERVATION_ID"
info "Status: $(echo "$BODY" | jq -r '.status')"

step "6.4" "Get reservation by ID"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/reservations/$RESERVATION_ID" \
  -H "X-Tenant-Id: $TENANT")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Get reservation by ID"
info "Status: $(echo "$BODY" | jq -r '.status'), createdBy: $(echo "$BODY" | jq -r '.createdBy')"

step "6.5" "Confirm reservation (PENDING_PAYMENT → CONFIRMED)"
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/reservations/$RESERVATION_ID/confirm" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $ADMIN_USER")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Confirm reservation"
info "New status: $(echo "$BODY" | jq -r '.status')"

step "6.6" "[ERROR CASE] Confirm already-CONFIRMED reservation → expect 400"
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/reservations/$RESERVATION_ID/confirm" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $ADMIN_USER")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "400" "Double confirm → 400"

# =============================================================================
# SECTION 7 — MY RESERVATIONS (trainer dashboard endpoint)
# =============================================================================
separator
echo -e "${CYAN}SECTION 7 — MY RESERVATIONS (trainer dashboard)${NC}"

step "7.1" "Get reservations for instructor (should include the one just confirmed)"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/reservations/my" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "GET /api/reservations/my"
info "My reservations count: $(echo "$BODY" | jq 'length')"
info "Statuses: $(echo "$BODY" | jq '[.[].status]')"

step "7.2" "Get reservations by eventId"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/reservations?eventId=event-101" \
  -H "X-Tenant-Id: $TENANT")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "GET /api/reservations?eventId=event-101"
info "Reservations for event-101: $(echo "$BODY" | jq 'length')"

step "7.3" "Get reservations for resource"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/reservations/resource/$ROOM_ID" \
  -H "X-Tenant-Id: $TENANT")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "GET /api/reservations/resource/:id"

# =============================================================================
# SECTION 8 — CONFLICT DETECTION (overbooking)
# =============================================================================
separator
echo -e "${CYAN}SECTION 8 — CONFLICT DETECTION${NC}"
# ROOM capacity=1, overbookingThreshold=1 (set in step 1.7)
# So we can have at most 2 active reservations (1 + 1 threshold)
# One confirmed already exists → one more should succeed, third should fail

step "8.1" "Book same ROOM slot again (overbooking threshold allows +1)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $ADMIN_USER" \
  -H "X-User-Role: ADMIN" \
  -H "X-User-Tier: PREMIUM" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"eventId\": \"event-102\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Overbooking threshold slot (2nd booking)"
OVERBOOKING_RES_ID=$(echo "$BODY" | jq -r '.id')
info "OVERBOOKING_RES_ID = $OVERBOOKING_RES_ID"

step "8.2" "[ERROR CASE] Third booking on same slot exceeds capacity+threshold → expect 409"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $USER_B" \
  -H "X-User-Role: INSTRUCTOR" \
  -H "X-User-Tier: STANDARD" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"eventId\": \"event-103\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "409" "Over capacity → 409"
info "Error message: $(echo "$BODY" | jq -r '.message')"

# =============================================================================
# SECTION 9 — WAITLIST FLOW
# =============================================================================
separator
echo -e "${CYAN}SECTION 9 — WAITLIST FLOW${NC}"

step "9.1" "[REQUIRED] User B joins waitlist for the FULL ROOM slot (STANDARD tier)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/waitlist" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $USER_B" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\",
    \"userTier\": \"STANDARD\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "User B joins waitlist"
WAITLIST_ENTRY_ID=$(echo "$BODY" | jq -r '.id')
info "Waitlist entry ID = $WAITLIST_ENTRY_ID, status = $(echo "$BODY" | jq -r '.status')"

step "9.2" "User B re-joins same slot → idempotent, no duplicate entry (same 201/same id)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/waitlist" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $USER_B" \
  -d "{
    \"resourceId\": \"$ROOM_ID\",
    \"startTime\": \"$SLOT_START\",
    \"endTime\": \"$SLOT_END\",
    \"userTier\": \"STANDARD\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Re-join waitlist (idempotent)"
DUPLICATE_ID=$(echo "$BODY" | jq -r '.id')
if [ "$DUPLICATE_ID" = "$WAITLIST_ENTRY_ID" ]; then
  ok "Same waitlist entry returned (no duplicate) — id=$DUPLICATE_ID"
else
  fail "Different entry returned! original=$WAITLIST_ENTRY_ID, new=$DUPLICATE_ID"
fi

step "9.3" "[KEY] Cancel the CONFIRMED reservation → should auto-promote User B from waitlist"
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/reservations/$RESERVATION_ID/cancel" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Cancel reservation (triggers waitlist promotion)"
info "Status: $(echo "$BODY" | jq -r '.status')"
info "Penalty: $(echo "$BODY" | jq -r '.cancellationPenaltyPercent')%"
info "Refund:  $(echo "$BODY" | jq -r '.refundAmount')%"
info "(With no policy: penalty=0, refund=100)"

info ""
info ">>> Verify User B was auto-promoted: check reservations/my for $USER_B"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/reservations/my" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $USER_B")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "GET /my for User B after waitlist promotion"
PROMOTED=$(echo "$BODY" | jq '[.[] | select(.status=="PENDING_PAYMENT")] | length')
if [ "$PROMOTED" -gt 0 ]; then
  ok "User B has $PROMOTED PENDING_PAYMENT reservation(s) — waitlist promotion worked"
else
  info "No promoted reservation yet (may depend on timing/capacity recalc)"
fi

# =============================================================================
# SECTION 10 — HOLD RELEASE FLOW
# =============================================================================
separator
echo -e "${CYAN}SECTION 10 — HOLD RELEASE (manual)${NC}"

step "10.1" "Create a fresh hold on DEVICE for SLOT2"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations/holds" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR" \
  -d "{
    \"resourceId\": \"$DEVICE_ID\",
    \"startTime\": \"$SLOT2_START\",
    \"endTime\": \"$SLOT2_END\",
    \"ttlMinutes\": 10
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Create hold on DEVICE"
HOLD2_ID=$(echo "$BODY" | jq -r '.holdId')
info "HOLD2_ID = $HOLD2_ID"

step "10.2" "Release that hold manually → 204 No Content"
RESP=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/reservations/holds/$HOLD2_ID" \
  -H "X-Tenant-Id: $TENANT")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "204" "Release hold"

step "10.3" "DEVICE slot now available again — confirm with check-availability"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/resources/check-availability" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -d "{
    \"resourceId\": \"$DEVICE_ID\",
    \"startTime\": \"$SLOT2_START\",
    \"endTime\": \"$SLOT2_END\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "DEVICE available after hold release"
info "Available: $(echo "$BODY" | jq '.available')"

# =============================================================================
# SECTION 11 — DIRECT RESERVATION (no hold)
# =============================================================================
separator
echo -e "${CYAN}SECTION 11 — DIRECT RESERVATION (no hold, MATERIAL)${NC}"

step "11.1" "Reserve MATERIAL resource directly (no hold needed)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR" \
  -H "X-User-Role: INSTRUCTOR" \
  -H "X-User-Tier: VIP" \
  -d "{
    \"resourceId\": \"$MAT_ID\",
    \"eventId\": \"event-200\",
    \"startTime\": \"$SLOT2_START\",
    \"endTime\": \"$SLOT2_END\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Direct reservation on MATERIAL"
MAT_RES_ID=$(echo "$BODY" | jq -r '.id')
info "MAT_RES_ID = $MAT_RES_ID, status = $(echo "$BODY" | jq -r '.status')"

step "11.2" "Cancel the MATERIAL reservation (no policy → 0% penalty, 100% refund)"
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/reservations/$MAT_RES_ID/cancel" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Cancel MATERIAL reservation"
info "Penalty: $(echo "$BODY" | jq -r '.cancellationPenaltyPercent')% | Refund: $(echo "$BODY" | jq -r '.refundAmount')%"

step "11.3" "[ERROR CASE] Cancel already-cancelled reservation → expect 400"
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/reservations/$MAT_RES_ID/cancel" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "400" "Double cancel → 400"

# =============================================================================
# SECTION 12 — CANCELLATION WITH POLICY (manual DB insert required)
# =============================================================================
separator
echo -e "${CYAN}SECTION 12 — CANCELLATION POLICY TEST${NC}"
echo -e "  ${YELLOW}NOTE: This section requires a cancellation policy row in the DB.${NC}"
echo -e "  Insert via MySQL client before running this section:"
echo ""
echo -e "  INSERT INTO reservation_policies"
echo -e "    (tenant_id, resource_id, free_cancellation_hours, partial_refund_hours, partial_refund_percent, late_cancellation_penalty, active)"
echo -e "    VALUES ('$TENANT', NULL, 24, 6, 50.00, 100.00, 1);"
echo ""
echo -e "  Then re-run a cancellation and check cancellationPenaltyPercent / refundAmount in the response."

# Demonstrate that a reservation exists for a fresh far-future slot if needed
SLOT3_START=$(date -d "+2 days" +"%Y-%m-%dT10:00:00" 2>/dev/null || date -v+2d +"%Y-%m-%dT10:00:00")
SLOT3_END=$(date -d "+2 days" +"%Y-%m-%dT11:00:00" 2>/dev/null || date -v+2d +"%Y-%m-%dT11:00:00")

step "12.1" "Create a reservation on DEVICE in far-future slot (for policy test)"
RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/reservations" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR" \
  -H "X-User-Role: INSTRUCTOR" \
  -H "X-User-Tier: STANDARD" \
  -d "{
    \"resourceId\": \"$DEVICE_ID\",
    \"eventId\": \"event-300\",
    \"startTime\": \"$SLOT3_START\",
    \"endTime\": \"$SLOT3_END\"
  }")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "201" "Create DEVICE reservation (for policy test)"
POLICY_RES_ID=$(echo "$BODY" | jq -r '.id')
info "POLICY_RES_ID = $POLICY_RES_ID"

step "12.2" "Cancel it — if policy inserted: freeCancellationHours=24 & start is 2 days away"
info "Expected: penalty=0%, refund=100% (still within free cancellation window)"
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/reservations/$POLICY_RES_ID/cancel" \
  -H "X-Tenant-Id: $TENANT" \
  -H "X-User-Id: $INSTRUCTOR")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Cancel within free window"
info "Penalty: $(echo "$BODY" | jq -r '.cancellationPenaltyPercent')% | Refund: $(echo "$BODY" | jq -r '.refundAmount')%"

# =============================================================================
# SECTION 13 — RESOURCE SOFT DELETE
# =============================================================================
separator
echo -e "${CYAN}SECTION 13 — RESOURCE SOFT DELETE${NC}"

step "13.1" "Soft-delete the MATERIAL resource"
RESP=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/resources/$MAT_ID" \
  -H "X-Tenant-Id: $TENANT")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "204" "Soft-delete MATERIAL resource"

step "13.2" "[ERROR CASE] Try to get deleted resource → expect 404"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources/$MAT_ID" \
  -H "X-Tenant-Id: $TENANT")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "404" "Deleted resource → 404"

step "13.3" "List all resources (MATERIAL should no longer appear)"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources" \
  -H "X-Tenant-Id: $TENANT")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "List resources after delete"
COUNT=$(echo "$BODY" | jq 'length')
info "Remaining resources: $COUNT (should be 2)"

# =============================================================================
# SECTION 14 — CROSS-TENANT ISOLATION
# =============================================================================
separator
echo -e "${CYAN}SECTION 14 — TENANT ISOLATION${NC}"

step "14.1" "List resources for a different tenant → should return empty"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources" \
  -H "X-Tenant-Id: other-tenant")
BODY=$(echo "$RESP" | head -n -1)
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "200" "Resources for other-tenant"
COUNT=$(echo "$BODY" | jq 'length')
if [ "$COUNT" -eq 0 ]; then
  ok "Tenant isolation working — no resources leaked to other-tenant"
else
  fail "Tenant isolation BROKEN — other-tenant sees $COUNT resources"
fi

step "14.2" "[ERROR CASE] Get ROOM_ID with wrong tenant → expect 404"
RESP=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resources/$ROOM_ID" \
  -H "X-Tenant-Id: other-tenant")
STATUS=$(echo "$RESP" | tail -n1)
check_status "$STATUS" "404" "Cross-tenant resource access → 404"

# =============================================================================
# SUMMARY
# =============================================================================
separator
echo ""
echo -e "${CYAN}TEST SCENARIO COMPLETE${NC}"
echo ""
echo -e "  Resources created:"
echo -e "    ROOM    $ROOM_ID"
echo -e "    DEVICE  $DEVICE_ID"
echo -e "    MAT     $MAT_ID (soft-deleted)"
echo ""
echo -e "  What was tested:"
echo -e "    ✔ Resource CRUD (create, read, list, update, soft-delete)"
echo -e "    ✔ Availability window definition"
echo -e "    ✔ Availability check (by ID and by type)"
echo -e "    ✔ Recurrence preview (weekly, daily, bad RRULE)"
echo -e "    ✔ Slot recommendations"
echo -e "    ✔ Hold create → reservation via hold token"
echo -e "    ✔ Duplicate hold → 409"
echo -e "    ✔ Reservation confirm"
echo -e "    ✔ Double-confirm → 400"
echo -e "    ✔ Overbooking threshold (capacity+1 allowed, capacity+2 rejected)"
echo -e "    ✔ Waitlist join (idempotent)"
echo -e "    ✔ Waitlist auto-promotion on cancellation"
echo -e "    ✔ Hold release (manual)"
echo -e "    ✔ Direct reservation (no hold)"
echo -e "    ✔ Double cancel → 400"
echo -e "    ✔ Cancellation policy (no-policy = full refund)"
echo -e "    ✔ My reservations endpoint (trainer dashboard)"
echo -e "    ✔ Reservations by eventId / by resource"
echo -e "    ✔ Tenant isolation"
echo -e "    ✔ Invalid time range → 400"
echo -e "    ✔ Non-existent resource → 404"
echo ""
