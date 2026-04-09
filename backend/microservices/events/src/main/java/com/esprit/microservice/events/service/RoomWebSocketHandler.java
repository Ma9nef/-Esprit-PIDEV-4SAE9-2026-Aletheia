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

    // Map pour stocker les sessions en attente d'authentification
    private static final Map<String, WebSocketSession> pendingAuthSessions = new ConcurrentHashMap<>();

    private JwtService jwtService;

    public void setJwtService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("🔌 Nouvelle connexion WebSocket: " + session.getId());

        // Vérifier si l'utilisateur est déjà authentifié via JwtHandshakeInterceptor
        Object userAttr = session.getAttributes().get("user");

        if (userAttr != null) {
            // Déjà authentifié via le handshake (Postman)
            System.out.println("✅ Session pré-authentifiée via handshake");
            addToRoom(session);
        } else {
            // Mettre en attente d'authentification (Angular)
            System.out.println("⏳ Session en attente d'authentification: " + session.getId());
            pendingAuthSessions.put(session.getId(), session);

            // Démarrer un timer pour fermer si pas d'auth dans les 10 secondes
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
            }, 10000);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("📨 Message reçu: " + payload);

        Map<String, Object> data = mapper.readValue(payload, Map.class);
        String type = (String) data.get("type");

        // Si c'est un message d'authentification
        if ("auth".equals(type)) {
            handleAuthMessage(session, data);
            return;
        }

        // Vérifier si la session est authentifiée
        if (session.getAttributes().get("authenticated") == null &&
                session.getAttributes().get("user") == null) {
            System.out.println("❌ Message reçu de session non authentifiée: " + session.getId());
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Non authentifié"));
            return;
        }

        // Traiter les autres messages
        handleRegularMessage(session, data);
    }

    private void handleAuthMessage(WebSocketSession session, Map<String, Object> data) {
        String token = (String) data.get("token");

        System.out.println("🔐 Tentative d'authentification avec token");

        if (token == null || token.isEmpty()) {
            try {
                System.out.println("❌ Auth failed: token manquant");
                session.close(CloseStatus.POLICY_VIOLATION.withReason("Token manquant"));
            } catch (Exception e) {}
            return;
        }

        try {
            // Valider le token
            if (jwtService != null && jwtService.validateToken(token)) {
                String email = jwtService.getEmailFromToken(token);
                Long userId = jwtService.getUserIdFromToken(token);

                System.out.println("✅ Authentification réussie pour: " + email);

                // Marquer la session comme authentifiée
                session.getAttributes().put("authenticated", true);
                session.getAttributes().put("email", email);
                session.getAttributes().put("userId", userId);

                // Créer UserDetails pour compatibilité
                UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                        .username(email)
                        .password("")
                        .authorities(new ArrayList<>())
                        .build();
                session.getAttributes().put("user", userDetails);

                // Retirer de la liste d'attente
                pendingAuthSessions.remove(session.getId());

                // Ajouter à la room
                addToRoom(session);

            } else {
                System.out.println("❌ Auth failed: token invalide");
                session.close(CloseStatus.POLICY_VIOLATION.withReason("Token invalide"));
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur validation token: " + e.getMessage());
            try {
                session.close(CloseStatus.SERVER_ERROR.withReason("Erreur validation"));
            } catch (Exception ex) {}
        }
    }

    private void addToRoom(WebSocketSession session) {
        try {
            Long coursId = getCoursId(session);

            rooms.putIfAbsent(coursId, ConcurrentHashMap.newKeySet());
            Set<WebSocketSession> sessions = rooms.get(coursId);

            String username = (String) session.getAttributes().get("email");
            if (username == null) {
                Object userAttr = session.getAttributes().get("user");
                if (userAttr instanceof UserDetails ud) {
                    username = ud.getUsername();
                }
            }
            if (username == null) username = "Inconnu";

            System.out.println("🏠 Ajout à la room " + coursId + ": " + username);

            // Envoyer son propre ID
            Map<String, Object> idMessage = new HashMap<>();
            idMessage.put("type", "your-id");
            idMessage.put("id", session.getId());
            session.sendMessage(new TextMessage(mapper.writeValueAsString(idMessage)));

            // Notifier des utilisateurs existants
            for (WebSocketSession s : sessions) {
                if (!s.getId().equals(session.getId()) && s.isOpen()) {
                    String otherName = (String) s.getAttributes().get("email");
                    if (otherName == null) {
                        Object otherAttr = s.getAttributes().get("user");
                        if (otherAttr instanceof UserDetails ud) {
                            otherName = ud.getUsername();
                        }
                    }
                    if (otherName == null) otherName = "Inconnu";

                    // Envoyer au nouveau la liste des existants
                    Map<String, Object> existingMessage = new HashMap<>();
                    existingMessage.put("type", "existing-user");
                    existingMessage.put("id", s.getId());
                    existingMessage.put("name", otherName);
                    session.sendMessage(new TextMessage(mapper.writeValueAsString(existingMessage)));

                    // Notifier les existants du nouveau
                    Map<String, Object> newMessage = new HashMap<>();
                    newMessage.put("type", "new-user");
                    newMessage.put("id", session.getId());
                    newMessage.put("name", username);
                    s.sendMessage(new TextMessage(mapper.writeValueAsString(newMessage)));
                }
            }

            sessions.add(session);
            System.out.println("✅ Session ajoutée à la room: " + session.getId());

        } catch (Exception e) {
            System.err.println("❌ Erreur addToRoom: " + e.getMessage());
        }
    }

    private void handleRegularMessage(WebSocketSession session, Map<String, Object> data) throws Exception {
        Long coursId = getCoursId(session);
        Set<WebSocketSession> sessions = rooms.get(coursId);

        if (sessions == null) return;

        String type = (String) data.get("type");
        String target = (String) data.get("target");

        data.put("from", session.getId());

        // Ajouter le nom de l'expéditeur
        String senderName = (String) session.getAttributes().get("email");
        if (senderName == null) {
            Object userAttr = session.getAttributes().get("user");
            if (userAttr instanceof UserDetails ud) {
                senderName = ud.getUsername();
            }
        }
        data.put("name", senderName);

        if (target != null) {
            // Message privé
            for (WebSocketSession s : sessions) {
                if (s.getId().equals(target) && s.isOpen()) {
                    System.out.println("📤 Envoi privé à " + target + ": " + type);
                    s.sendMessage(new TextMessage(mapper.writeValueAsString(data)));
                    break;
                }
            }
        } else {
            // Broadcast
            for (WebSocketSession s : sessions) {
                if (!s.getId().equals(session.getId()) && s.isOpen()) {
                    s.sendMessage(new TextMessage(mapper.writeValueAsString(data)));
                }
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

            // Notifier les autres
            String username = (String) session.getAttributes().get("email");
            if (username == null) {
                Object userAttr = session.getAttributes().get("user");
                if (userAttr instanceof UserDetails ud) {
                    username = ud.getUsername();
                }
            }

            if (username != null && !sessions.isEmpty()) {
                Map<String, Object> leaveMessage = new HashMap<>();
                leaveMessage.put("type", "user-left");
                leaveMessage.put("id", session.getId());
                leaveMessage.put("name", username);

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

            if (sessions.isEmpty()) {
                rooms.remove(coursId);
            }
        }
        System.out.println("🔌 Session fermée: " + session.getId() + " - " + status);
    }

    private Long getCoursId(WebSocketSession session) {
        String path = session.getUri().getPath();
        return Long.parseLong(path.substring(path.lastIndexOf("/") + 1));
    }
}