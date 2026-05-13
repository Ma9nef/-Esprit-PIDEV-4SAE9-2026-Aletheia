package com.esprit.microservice.resourcemanagement.entity.enums;

public enum ResourceType {
    // Require admin approval by default
    CLASSROOM,
    COMPUTER_LAB,
    AMPHITHEATER,

    // Auto-confirm by default
    PROJECTOR,
    LAPTOP,
    SMARTBOARD,

    // Configurable by admin
    CUSTOM_EQUIPMENT
}
