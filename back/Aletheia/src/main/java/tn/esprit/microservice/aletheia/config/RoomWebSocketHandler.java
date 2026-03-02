package tn.esprit.microservice.aletheia.config;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class RoomWebSocketHandler extends TextWebSocketHandler {

    private static final Map<Long, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long coursId = getCoursId(session);

        rooms.putIfAbsent(coursId, ConcurrentHashMap.newKeySet());
        Set<WebSocketSession> sessions = rooms.get(coursId);

        // Récupérer le nom
        Object userAttr = session.getAttributes().get("user");
        String username = "Inconnu";
        if (userAttr instanceof UserDetails ud) {
            username = ud.getUsername();
        }

        // Envoyer son propre ID
        session.sendMessage(new TextMessage(
                "{\"type\":\"your-id\",\"id\":\"" + session.getId() + "\"}"
        ));

        // Notifier le nouveau des utilisateurs existants
        for (WebSocketSession s : sessions) {
            if (!s.getId().equals(session.getId()) && s.isOpen()) {
                String otherName = "Inconnu";
                Object otherAttr = s.getAttributes().get("user");
                if (otherAttr instanceof UserDetails ud) otherName = ud.getUsername();

                session.sendMessage(new TextMessage(
                        "{\"type\":\"existing-user\",\"id\":\"" + s.getId() + "\", \"name\":\"" + otherName + "\"}"
                ));

                s.sendMessage(new TextMessage(
                        "{\"type\":\"new-user\",\"id\":\"" + session.getId() + "\", \"name\":\"" + username + "\"}"
                ));
            }
        }

        sessions.add(session);
        System.out.println("✅ Nouvel utilisateur connecté: " + username + " dans room " + coursId);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long coursId = getCoursId(session);
        Set<WebSocketSession> sessions = rooms.get(coursId);

        if (sessions != null) {
            sessions.remove(session);

            Object userAttr = session.getAttributes().get("user");
            String username = "Inconnu";
            if (userAttr instanceof UserDetails ud) {
                username = ud.getUsername();
            }

            System.out.println("👋 Utilisateur déconnecté: " + username + " de la room " + coursId);

            // Notifier tous les autres que cet utilisateur est parti
            String leaveMessage = "{\"type\":\"user-left\",\"id\":\"" + session.getId() + "\", \"name\":\"" + username + "\"}";

            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    try {
                        s.sendMessage(new TextMessage(leaveMessage));
                    } catch (Exception e) {
                        System.err.println("❌ Erreur envoi notification: " + e.getMessage());
                    }
                }
            }

            if (sessions.isEmpty()) {
                rooms.remove(coursId);
                System.out.println("🗑️ Room " + coursId + " supprimée (vide)");
            }
        }
    }

    private Long getCoursId(WebSocketSession session) {
        String path = session.getUri().getPath();
        return Long.parseLong(path.substring(path.lastIndexOf("/") + 1));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Long coursId = getCoursId(session);
        Set<WebSocketSession> sessions = rooms.get(coursId);

        if (sessions == null) return;

        String payload = message.getPayload();
        Map<String, Object> data = mapper.readValue(payload, Map.class);
        String type = (String) data.get("type");
        String target = (String) data.get("target");

        // Ajouter l'expéditeur au message
        data.put("from", session.getId());

        // Récupérer le nom de l'utilisateur
        Object userAttr = session.getAttributes().get("user");
        String username = "Inconnu";
        if (userAttr instanceof UserDetails ud) {
            username = ud.getUsername();
        }
        data.put("name", username);

        // Gestion des différents types de messages
        switch (type) {
            case "chat":
                // Message de chat - broadcast à tous les participants de la room
                System.out.println("💬 Message chat de " + username + ": " + data.get("message"));

                for (WebSocketSession s : sessions) {
                    if (s.isOpen()) {
                        try {
                            s.sendMessage(new TextMessage(mapper.writeValueAsString(data)));
                        } catch (Exception e) {
                            System.err.println("❌ Erreur envoi message chat: " + e.getMessage());
                        }
                    }
                }
                break;

            case "offer":
            case "answer":
            case "ice-candidate":
                // Messages WebRTC - envoyés à un destinataire spécifique
                if (target != null) {
                    for (WebSocketSession s : sessions) {
                        if (s.getId().equals(target) && s.isOpen()) {
                            s.sendMessage(new TextMessage(mapper.writeValueAsString(data)));
                            break;
                        }
                    }
                }
                break;

            case "audio-mute":
            case "video-mute":
                // Broadcast des changements de statut à tous
                for (WebSocketSession s : sessions) {
                    if (!s.getId().equals(session.getId()) && s.isOpen()) {
                        s.sendMessage(new TextMessage(mapper.writeValueAsString(data)));
                    }
                }
                break;
        }
    }
}