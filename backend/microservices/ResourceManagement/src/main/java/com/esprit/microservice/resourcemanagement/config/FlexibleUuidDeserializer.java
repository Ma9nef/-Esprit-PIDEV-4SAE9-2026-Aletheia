package com.esprit.microservice.resourcemanagement.config;

import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.UUID;

/**
 * Accepts UUIDs in three formats:
 *  - Standard 36-char:  2b67ba22-c6dd-4702-9609-20e2e7e39bbb
 *  - 32-char hex:       2b67ba22c6dd4702960920e2e7e39bbb
 *  - 0x-prefixed hex:   0x2b67ba22c6dd4702960920e2e7e39bbb
 */
public class FlexibleUuidDeserializer extends StdDeserializer<UUID> {

    public FlexibleUuidDeserializer() {
        super(UUID.class);
    }

    @Override
    public UUID deserialize(JsonParser p, DeserializationContext ctx) throws JacksonException {
        String raw = p.getText();
        if (raw == null || raw.isBlank()) {
            return null;
        }
        return parse(raw.trim());
    }

    public static UUID parse(String raw) {
        String s = raw.trim();
        // Strip 0x / 0X prefix
        if (s.startsWith("0x") || s.startsWith("0X")) {
            s = s.substring(2);
        }
        // 32-char hex without dashes → insert dashes in 8-4-4-4-12 pattern
        if (s.length() == 32 && !s.contains("-")) {
            s = s.substring(0, 8) + "-"
                    + s.substring(8, 12) + "-"
                    + s.substring(12, 16) + "-"
                    + s.substring(16, 20) + "-"
                    + s.substring(20);
        }
        return UUID.fromString(s);
    }
}
