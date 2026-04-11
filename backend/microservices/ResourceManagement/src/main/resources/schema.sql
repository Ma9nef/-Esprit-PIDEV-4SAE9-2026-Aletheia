-- ===================================================================
-- Resource Management Microservice - Database Schema (MySQL)
-- ===================================================================

CREATE DATABASE IF NOT EXISTS aletheia_resources;
USE aletheia_resources;

-- ===================================================================
-- Resources Table
-- ===================================================================
CREATE TABLE IF NOT EXISTS resources (
    id          CHAR(36)     PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50)  NOT NULL,
    capacity    INT,
    metadata    JSON,
    deleted     TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_resources_type    (type),
    INDEX idx_resources_deleted (deleted),
    INDEX idx_resources_name    (name)
);

-- ===================================================================
-- Resource Availability Table
-- ===================================================================
CREATE TABLE IF NOT EXISTS resource_availability (
    id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    resource_id CHAR(36)     NOT NULL,
    start_time  DATETIME     NOT NULL,
    end_time    DATETIME     NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_availability_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT chk_availability_time    CHECK (end_time > start_time),

    INDEX idx_availability_resource (resource_id),
    INDEX idx_availability_time     (resource_id, start_time, end_time)
);

-- ===================================================================
-- Reservations Table
-- ===================================================================
CREATE TABLE IF NOT EXISTS reservations (
    id          CHAR(36)     PRIMARY KEY,
    resource_id CHAR(36)     NOT NULL,
    event_id    VARCHAR(255) NOT NULL,
    start_time  DATETIME     NOT NULL,
    end_time    DATETIME     NOT NULL,
    status      VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    version     BIGINT       NOT NULL DEFAULT 0,
    created_by  VARCHAR(255),
    deleted     TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reservation_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT chk_reservation_time    CHECK (end_time > start_time),

    -- CRITICAL INDEX for conflict detection performance
    INDEX idx_reservation_resource_time (resource_id, start_time, end_time),
    INDEX idx_reservation_event         (event_id),
    INDEX idx_reservation_status        (status),
    INDEX idx_reservation_deleted       (deleted)
);

-- ===================================================================
-- Audit Log Table
-- ===================================================================
CREATE TABLE IF NOT EXISTS reservation_audit_log (
    id             BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reservation_id CHAR(36)     NOT NULL,
    action         VARCHAR(50)  NOT NULL,
    old_status     VARCHAR(50),
    new_status     VARCHAR(50),
    performed_by   VARCHAR(255),
    performed_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details        JSON,

    INDEX idx_audit_reservation  (reservation_id),
    INDEX idx_audit_performed_at (performed_at)
);
