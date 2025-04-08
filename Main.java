package jar;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Scanner;

public class Main {
    static final String DB_URL = "jdbc:mysql://localhost:3306/your_database_name";
    static final String USER = "root";
    static final String PASS = "Testpassword"; // leave blank if no password

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Username: ");
        String username = scanner.nextLine();

        System.out.print("Password: ");
        String password = scanner.nextLine();

        System.out.print("Account Type (Buyer/Seller/Admin): ");
        String accountType = scanner.nextLine();

        scanner.close();

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
            if (usernameExists(conn, username)) {
                System.out.println("Username already exists.");
            } else {
                insertUser(conn, username, password, accountType);
                System.out.println("Account created successfully.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
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
        String insertQuery = "INSERT INTO users (username, password, accountType) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(insertQuery)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, type);
            stmt.executeUpdate();
        }
    }
}
