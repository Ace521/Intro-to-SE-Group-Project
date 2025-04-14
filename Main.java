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
    static final String PASS = "Testpassword";

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(4567), 0);
        server.createContext("/createAccount", new CreateAccountHandler());
        server.createContext("/login", new LoginHandler());
        server.createContext("/getRole", new GetRoleHandler());
        server.createContext("/logout", new LogoutHandler());
        server.createContext("/edit-account", new EditAccountHandler());
        server.createContext("/delete-account", new DeleteAccountHandler());
        server.createContext("/addProducts", new AddProductHandler());
        server.createContext("/getProducts", new GetProductsHandler());
        server.createContext("/listUsers", new ListUsersHandler());
        server.createContext("/listProducts", new ListProductsHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("HTTP server started on port 4567");
        
    }

    static class EditAccountHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
            BufferedReader br = new BufferedReader(isr);
            StringBuilder requestBody = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                requestBody.append(line);
            }

            String body = requestBody.toString();
            String userId = getJsonValue(body, "userId");
            String newUsername = getJsonValue(body, "newUsername");
            String newPassword = getJsonValue(body, "newPassword");

            String response;
            try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
                String query = "UPDATE users SET username = ?, password = ? WHERE id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(query)) {
                    stmt.setString(1, newUsername);
                    stmt.setString(2, newPassword);
                    stmt.setInt(3, Integer.parseInt(userId));
                    int rows = stmt.executeUpdate();
                    response = rows > 0 ? "{\"success\":true}" : "{\"success\":false}";
                }
            } catch (SQLException e) {
                e.printStackTrace();
                response = "{\"success\":false,\"error\":\"Database error\"}";
            }

            sendResponse(exchange, response);
        }
    }

    static class DeleteAccountHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!exchange.getRequestMethod().equalsIgnoreCase("DELETE")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
            BufferedReader br = new BufferedReader(isr);
            StringBuilder requestBody = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                requestBody.append(line);
            }

            String body = requestBody.toString();
            String userId = getJsonValue(body, "userId");

            String response;
            try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
                String query = "DELETE FROM users WHERE id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(query)) {
                    stmt.setInt(1, Integer.parseInt(userId));
                    int rows = stmt.executeUpdate();
                    response = rows > 0 ? "{\"success\":true}" : "{\"success\":false}";
                }
            } catch (SQLException e) {
                e.printStackTrace();
                response = "{\"success\":false,\"error\":\"Database error\"}";
            }

            sendResponse(exchange, response);
        }
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
            String role = params.get("accountType");

            String response;
            try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
                if (usernameExists(conn, username)) {
                    response = "Username already exists.";
                } else {
                    insertUser(conn, username, password, role);
                    response = "Success";
                }
            } catch (SQLException e) {
                e.printStackTrace();
                response = "Database error.";
            }

            sendResponse(exchange, response);
        }
    }

    static class GetRoleHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String username = exchange.getRequestURI().getQuery();
            username = URLDecoder.decode(username, "UTF-8").split("=")[1];

            String response;
            try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
                String role = getUserRole(conn, username);
                if (role != null) {
                    response = role;
                } else {
                    response = "User not found";
                }
            } catch (SQLException e) {
                e.printStackTrace();
                response = "Database error";
            }

            sendResponse(exchange, response);
        }

        private String getUserRole(Connection conn, String username) throws SQLException {
            String query = "SELECT role FROM users WHERE username = ?";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, username);
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    return rs.getString("role");
                }
                return null;
            }
        }
    }

    static class LoginHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Add CORS headers
        Headers responseHeaders = exchange.getResponseHeaders();
        responseHeaders.add("Access-Control-Allow-Origin", "*");

        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        StringBuilder body = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), "UTF-8"))) {
            String line;
            while ((line = br.readLine()) != null) {
                body.append(line);
            }
        }

        String[] pairs = body.toString().split("&");
        Map<String, String> params = new HashMap<>();
        for (String pair : pairs) {
            String[] kv = pair.split("=");
            if (kv.length == 2) {
                params.put(URLDecoder.decode(kv[0], "UTF-8"), URLDecoder.decode(kv[1], "UTF-8"));
            }
        }

        String username = params.get("username");
        String password = params.get("password");

        String response;
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
            if (validateCredentials(conn, username, password)) {
                response = "Success";
            } else {
                response = "Invalid Credentials";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response = "Database error.";
        }

        sendResponse(exchange, response);
    }
}


    static class LogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            String response = "Logged out";
            sendResponse(exchange, response);
        }
    }

    static class AddProductHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            Map<String, String> fields = getFormData(exchange);
            String name = fields.get("name");
            String description = fields.get("description");
            double price = Double.parseDouble(fields.get("price"));
            int quantity = Integer.parseInt(fields.get("quantity"));
            String imageUrl = fields.get("image");
            String username = fields.get("username");

            try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
                int sellerId = getUserIdByUsername(conn, username);
                if (sellerId == -1) {
                    sendResponse(exchange, "{\"success\": false, \"message\": \"Seller not found\"}");
                    return;
                }

                String sql = "INSERT INTO products (name, description, price, quantity, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, name);
                    stmt.setString(2, description);
                    stmt.setDouble(3, price);
                    stmt.setInt(4, quantity);
                    stmt.setString(5, imageUrl);
                    stmt.setInt(6, sellerId);
                    stmt.executeUpdate();
                }

                sendResponse(exchange, "{\"success\": true}");
            } catch (Exception e) {
                e.printStackTrace();
                sendResponse(exchange, "{\"success\": false, \"message\": \"Server error\"}");
            }
        }
    }

    static class GetProductsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            StringBuilder response = new StringBuilder();
            response.append("[");

            try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
                String sql = "SELECT name, description, price, quantity, image_url FROM products";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    ResultSet rs = stmt.executeQuery();
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) response.append(",");
                        first = false;

                        response.append("{")
                                .append("\"name\":\"").append(escapeJson(rs.getString("name"))).append("\",")
                                .append("\"description\":\"").append(escapeJson(rs.getString("description"))).append("\",")
                                .append("\"price\":").append(rs.getDouble("price")).append(",")
                                .append("\"quantity\":").append(rs.getInt("quantity")).append(",")
                                .append("\"imageUrl\":\"").append(escapeJson(rs.getString("image_url"))).append("\"")
                                .append("}");
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
                response = new StringBuilder("{\"error\":\"Database error\"}");
            }

            response.append("]");
            sendJsonResponse(exchange, response.toString());
        }

        private void sendJsonResponse(HttpExchange exchange, String response) throws IOException {
            byte[] bytes = response.getBytes("UTF-8");
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }

        private String escapeJson(String s) {
            return s == null ? "" : s.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
        }
    }

    private static String getJsonValue(String json, String key) {
        String pattern = "\"" + key + "\"\\s*:\\s*\"(.*?)\"";
        java.util.regex.Pattern r = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = r.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        return null;
    }

    // Handler to list all users
static class ListUsersHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        StringBuilder response = new StringBuilder();
        response.append("[");

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
            String query = "SELECT id, username, role FROM users";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                ResultSet rs = stmt.executeQuery();
                boolean first = true;
                while (rs.next()) {
                    if (!first) response.append(",");
                    first = false;
                    response.append("{")
                            .append("\"id\":").append(rs.getInt("id")).append(",")
                            .append("\"username\":\"").append(escapeJson(rs.getString("username"))).append("\",")
                            .append("\"role\":\"").append(escapeJson(rs.getString("role"))).append("\"")
                            .append("}");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response = new StringBuilder("{\"error\":\"Database error\"}");
        }

        response.append("]");
        sendResponse(exchange, response.toString());
    }
    private static String escapeJson(String s) {
        return s == null ? "" : s.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}

// Handler to list all products
static class ListProductsHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        StringBuilder response = new StringBuilder();
        response.append("[");

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
            String query = "SELECT p.id, p.name, p.description, p.price, p.quantity, p.image_url, u.username AS seller FROM products p JOIN users u ON p.seller_id = u.id";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                ResultSet rs = stmt.executeQuery();
                boolean first = true;
                while (rs.next()) {
                    if (!first) response.append(",");
                    first = false;
                    response.append("{")
                            .append("\"id\":").append(rs.getInt("id")).append(",")
                            .append("\"name\":\"").append(escapeJson(rs.getString("name"))).append("\",")
                            .append("\"description\":\"").append(escapeJson(rs.getString("description"))).append("\",")
                            .append("\"price\":").append(rs.getDouble("price")).append(",")
                            .append("\"quantity\":").append(rs.getInt("quantity")).append(",")
                            .append("\"imageUrl\":\"").append(escapeJson(rs.getString("image_url"))).append("\",")
                            .append("\"seller\":\"").append(escapeJson(rs.getString("seller"))).append("\"")
                            .append("}");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response = new StringBuilder("{\"error\":\"Database error\"}");
        }

        response.append("]");
        sendResponse(exchange, response.toString());
    }
    private static String escapeJson(String s) {
        return s == null ? "" : s.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}


    private static int getUserIdByUsername(Connection conn, String username) throws SQLException {
        String sql = "SELECT id FROM users WHERE username = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("id");
            }
        }
        return -1;
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

    private static boolean validateCredentials(Connection conn, String username, String password) throws SQLException {
        String query = "SELECT COUNT(*) FROM users WHERE username = ? AND password = ?";
        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();
            rs.next();
            return rs.getInt(1) > 0;
        }
    }

    private static void insertUser(Connection conn, String username, String password, String role) throws SQLException {
        String insertQuery = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(insertQuery)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, role);
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
