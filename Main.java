package jar;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import static spark.Spark.*;

import java.sql.*;

public class Main {
    public static void main(String[] args) {
        port(4567);

        // Replace with your MySQL username/password and DB name
        String jdbcUrl = "jdbc:mysql://localhost:3306/loungesloth";
        String dbUser = "root";
        String dbPassword = "your_password_here";

        try {
            // Load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Open DB connection
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/lounge_sloth", "root", "");


            post("/createAccount", (req, res) -> {
                String username = req.queryParams("username");
                String password = req.queryParams("password");
                String accountType = req.queryParams("accountType");

                // Check if username already exists
                PreparedStatement checkStmt = conn.prepareStatement("SELECT * FROM users WHERE username = ?");
                checkStmt.setString(1, username);
                ResultSet rs = checkStmt.executeQuery();

                if (rs.next()) {
                    return "Username already exists";
                }

                // Insert new user
                PreparedStatement insertStmt = conn.prepareStatement("INSERT INTO users (username, password, accountType) VALUES (?, ?, ?)");
                insertStmt.setString(1, username);
                insertStmt.setString(2, password);
                insertStmt.setString(3, accountType);
                insertStmt.executeUpdate();

                return "Success";
            });

            post("/login", (req, res) -> {
                String username = req.queryParams("username");
                String password = req.queryParams("password");

                PreparedStatement loginStmt = conn.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?");
                loginStmt.setString(1, username);
                loginStmt.setString(2, password);
                ResultSet rs = loginStmt.executeQuery();

                return rs.next() ? "Success" : "Invalid Credentials!";
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
