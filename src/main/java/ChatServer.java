import javax.websocket.Session;
import javax.websocket.OnOpen;
import javax.websocket.OnMessage;
import javax.websocket.OnClose;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
@ServerEndpoint("/chat")
public class ChatServer {
    private static Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        broadcast("User Connected!");
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        broadcast("User: " + message);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        broadcast("User Disconnected");
    }

    private static void broadcast(String message) {
        for (Session session : sessions) {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                System.err.println("Message transmission has failed! Error: " + e.getMessage());
            }
        }
    }
}
