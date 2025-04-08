package jar;

import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class Main {
    static final String DB_URL = "jdbc:mysql://localhost:3306/lounge_sloth";
    static final String USER = "root";
    static final String PASS = "Testpassword"; // leave blank if no password

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(4567), 0);
        server.createContext("/createAccount", new CreateAccountHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("HTTP server started on port 4567");
    }

    static class CreateAccountHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            Map<String, String> params = getFormData(exchange);
            String username = params.get("username");
            String password = params.get("password");
            String role = params.get("role");

            String response;
            try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
                if (usernameExists(conn, username)) {
                    response = "Username already exists.";
                } else {
                    insertUser(conn, username, password, role);
                    response = "Account created successfully.";
                }
            } catch (SQLException e) {
                e.printStackTrace();
                response = "Database error.";
            }

            sendResponse(exchange, response);
        }
    }

    private static boolean usernameExists(Connection conn, String username) throws SQLException {
        String checkQuery = "SELECT COUNT(*) FROM users WHERE username = ?";
        try (PreparedStatement stmt = conn.prepareStatement(checkQuery)) {
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            rs.next();
            return rs.getInt(1) > 0;
        }
    }

    private static void insertUser(Connection conn, String username, String password, String type) throws SQLException {
        String insertQuery = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(insertQuery)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, type);
            stmt.executeUpdate();
        }
    }

    private static void sendResponse(HttpExchange exchange, String response) throws IOException {
        byte[] bytes = response.getBytes("UTF-8");
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static Map<String, String> getFormData(HttpExchange exchange) throws IOException {
        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        String formData = br.readLine();
        Map<String, String> map = new HashMap<>();
        if (formData != null) {
            for (String pair : formData.split("&")) {
                String[] parts = pair.split("=");
                if (parts.length == 2) {
                    map.put(URLDecoder.decode(parts[0], "UTF-8"), URLDecoder.decode(parts[1], "UTF-8"));
                }
            }
        }
        return map;
    }
}

