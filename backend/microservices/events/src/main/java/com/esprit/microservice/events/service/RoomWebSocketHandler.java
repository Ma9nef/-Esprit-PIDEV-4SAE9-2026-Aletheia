package com.esprit.microservice.events.service;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.esprit.microservice.events.security.JwtService;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class RoomWebSocketHandler extends TextWebSocketHandler {

    private static final Map<Long, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final ObjectMapper mapper = new ObjectMapper();
    private static final Map<String, WebSocketSession> pendingAuthSessions = new ConcurrentHashMap<>();

    // Constantes ajoutées
    private static final String ATTR_EMAIL = "email";
    private static final String ATTR_USER = "user";
    private static final String ATTR_AUTHENTICATED = "authenticated";
    private static final String ATTR_USER_ID = "userId";
    private static final String TYPE_AUTH = "auth";
    private static final String TYPE_YOUR_ID = "your-id";
    private static final String TYPE_EXISTING_USER = "existing-user";
    private static final String TYPE_NEW_USER = "new-user";
    private static final String TYPE_USER_LEFT = "user-left";
    private static final String FIELD_TYPE = "type";
    private static final String FIELD_ID = "id";
    private static final String FIELD_NAME = "name";
    private static final String FIELD_TOKEN = "token";
    private static final String FIELD_TARGET = "target";
    private static final String FIELD_FROM = "from";
    private static final String DEFAULT_USERNAME = "Inconnu";
    private static final long AUTH_TIMEOUT_MS = 10000;

    private JwtService jwtService;

    public void setJwtService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("🔌 Nouvelle connexion WebSocket: " + session.getId());

        Object userAttr = session.getAttributes().get(ATTR_USER);

        if (userAttr != null) {
            System.out.println("✅ Session pré-authentifiée via handshake");
            addToRoom(session);
        } else {
            System.out.println("⏳ Session en attente d'authentification: " + session.getId());
            pendingAuthSessions.put(session.getId(), session);

            new Timer().schedule(new TimerTask() {
                @Override
                public void run() {
                    if (pendingAuthSessions.containsKey(session.getId())) {
                        try {
                            System.out.println("⏱️ Timeout d'authentification pour: " + session.getId());
                            session.close(CloseStatus.POLICY_VIOLATION.withReason("Authentification timeout"));
                            pendingAuthSessions.remove(session.getId());
                        } catch (Exception e) {}
                    }
                }
            }, AUTH_TIMEOUT_MS);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("📨 Message reçu: " + payload);

        Map<String, Object> data = mapper.readValue(payload, Map.class);
        String type = (String) data.get(FIELD_TYPE);

        if (TYPE_AUTH.equals(type)) {
            handleAuthMessage(session, data);
            return;
        }

        if (isSessionAuthenticated(session)) {
            handleRegularMessage(session, data);
        } else {
            System.out.println("❌ Message reçu de session non authentifiée: " + session.getId());
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Non authentifié"));
        }
    }

    private boolean isSessionAuthenticated(WebSocketSession session) {
        return session.getAttributes().get(ATTR_AUTHENTICATED) != null ||
                session.getAttributes().get(ATTR_USER) != null;
    }

    private void handleAuthMessage(WebSocketSession session, Map<String, Object> data) {
        String token = (String) data.get(FIELD_TOKEN);
        System.out.println("🔐 Tentative d'authentification avec token");

        if (token == null || token.isEmpty()) {
            closeSessionWithError(session, "Token manquant");
            return;
        }

        try {
            if (jwtService != null && jwtService.validateToken(token)) {
                authenticateSession(session, token);
                pendingAuthSessions.remove(session.getId());
                addToRoom(session);
            } else {
                closeSessionWithError(session, "Token invalide");
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur validation token: " + e.getMessage());
            closeSessionWithError(session, "Erreur validation");
        }
    }

    private void authenticateSession(WebSocketSession session, String token) {
        String email = jwtService.getEmailFromToken(token);
        Long userId = jwtService.getUserIdFromToken(token);

        System.out.println("✅ Authentification réussie pour: " + email);

        session.getAttributes().put(ATTR_AUTHENTICATED, true);
        session.getAttributes().put(ATTR_EMAIL, email);
        session.getAttributes().put(ATTR_USER_ID, userId);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password("")
                .authorities(new ArrayList<>())
                .build();
        session.getAttributes().put(ATTR_USER, userDetails);
    }

    private void closeSessionWithError(WebSocketSession session, String reason) {
        try {
            System.out.println("❌ Auth failed: " + reason);
            session.close(CloseStatus.POLICY_VIOLATION.withReason(reason));
        } catch (Exception e) {
            // Log error
        }
    }

    private void addToRoom(WebSocketSession session) {
        try {
            Long coursId = getCoursId(session);
            rooms.putIfAbsent(coursId, ConcurrentHashMap.newKeySet());
            Set<WebSocketSession> sessions = rooms.get(coursId);

            String username = extractUsername(session);
            System.out.println("🏠 Ajout à la room " + coursId + ": " + username);

            // Envoyer son propre ID
            sendIdMessage(session);

            // Notifier les utilisateurs existants
            notifyExistingUsers(session, sessions, username);

            sessions.add(session);
            System.out.println("✅ Session ajoutée à la room: " + session.getId());

        } catch (Exception e) {
            System.err.println("❌ Erreur addToRoom: " + e.getMessage());
        }
    }

    private String extractUsername(WebSocketSession session) {
        String username = (String) session.getAttributes().get(ATTR_EMAIL);
        if (username == null) {
            Object userAttr = session.getAttributes().get(ATTR_USER);
            if (userAttr instanceof UserDetails ud) {
                username = ud.getUsername();
            }
        }
        return username != null ? username : DEFAULT_USERNAME;
    }

    private void sendIdMessage(WebSocketSession session) throws Exception {
        Map<String, Object> idMessage = new HashMap<>();
        idMessage.put(FIELD_TYPE, TYPE_YOUR_ID);
        idMessage.put(FIELD_ID, session.getId());
        session.sendMessage(new TextMessage(mapper.writeValueAsString(idMessage)));
    }

    private void notifyExistingUsers(WebSocketSession session, Set<WebSocketSession> sessions, String username) throws Exception {
        for (WebSocketSession s : sessions) {
            if (!s.getId().equals(session.getId()) && s.isOpen()) {
                String otherName = extractUsername(s);

                // Envoyer au nouveau la liste des existants
                Map<String, Object> existingMessage = new HashMap<>();
                existingMessage.put(FIELD_TYPE, TYPE_EXISTING_USER);
                existingMessage.put(FIELD_ID, s.getId());
                existingMessage.put(FIELD_NAME, otherName);
                session.sendMessage(new TextMessage(mapper.writeValueAsString(existingMessage)));

                // Notifier les existants du nouveau
                Map<String, Object> newMessage = new HashMap<>();
                newMessage.put(FIELD_TYPE, TYPE_NEW_USER);
                newMessage.put(FIELD_ID, session.getId());
                newMessage.put(FIELD_NAME, username);
                s.sendMessage(new TextMessage(mapper.writeValueAsString(newMessage)));
            }
        }
    }

    private void handleRegularMessage(WebSocketSession session, Map<String, Object> data) throws Exception {
        Long coursId = getCoursId(session);
        Set<WebSocketSession> sessions = rooms.get(coursId);

        if (sessions == null) return;

        String type = (String) data.get(FIELD_TYPE);
        String target = (String) data.get(FIELD_TARGET);

        data.put(FIELD_FROM, session.getId());
        data.put(FIELD_NAME, extractUsername(session));

        if (target != null) {
            sendPrivateMessage(sessions, target, data, type);
        } else {
            broadcastMessage(sessions, session, data, type);
        }
    }

    private void sendPrivateMessage(Set<WebSocketSession> sessions, String target, Map<String, Object> data, String type) throws Exception {
        for (WebSocketSession s : sessions) {
            if (s.getId().equals(target) && s.isOpen()) {
                System.out.println("📤 Envoi privé à " + target + ": " + type);
                s.sendMessage(new TextMessage(mapper.writeValueAsString(data)));
                break;
            }
        }
    }

    private void broadcastMessage(Set<WebSocketSession> sessions, WebSocketSession session, Map<String, Object> data, String type) throws Exception {
        for (WebSocketSession s : sessions) {
            if (!s.getId().equals(session.getId()) && s.isOpen()) {
                s.sendMessage(new TextMessage(mapper.writeValueAsString(data)));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        pendingAuthSessions.remove(session.getId());

        Long coursId = getCoursId(session);
        Set<WebSocketSession> sessions = rooms.get(coursId);

        if (sessions != null) {
            sessions.remove(session);

            String username = extractUsername(session);
            notifyUserLeft(sessions, session, username);

            if (sessions.isEmpty()) {
                rooms.remove(coursId);
            }
        }
        System.out.println("🔌 Session fermée: " + session.getId() + " - " + status);
    }

    private void notifyUserLeft(Set<WebSocketSession> sessions, WebSocketSession session, String username) {
        if (username != null && !sessions.isEmpty()) {
            Map<String, Object> leaveMessage = new HashMap<>();
            leaveMessage.put(FIELD_TYPE, TYPE_USER_LEFT);
            leaveMessage.put(FIELD_ID, session.getId());
            leaveMessage.put(FIELD_NAME, username);

            try {
                String payload = mapper.writeValueAsString(leaveMessage);
                for (WebSocketSession s : sessions) {
                    if (s.isOpen()) {
                        s.sendMessage(new TextMessage(payload));
                    }
                }
            } catch (Exception e) {
                System.err.println("❌ Erreur notification départ: " + e.getMessage());
            }
        }
    }

    private Long getCoursId(WebSocketSession session) {
        String path = session.getUri().getPath();
        return Long.parseLong(path.substring(path.lastIndexOf("/") + 1));
    }
}