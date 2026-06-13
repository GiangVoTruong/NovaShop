package com.backend.migration;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.junit.jupiter.api.Test;

/**
 * Chạy migration thủ công trước khi deploy entity có cột comment:
 * {@code ./mvnw test -Dtest=ReviewCommentMigrationRunner}
 */
class ReviewCommentMigrationRunner {

    private static final String JDBC_URL =
            "jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require";
    private static final String JDBC_USER = "postgres.wpjdybmidoqbjshqorfc";

    @Test
    void addReviewCommentColumn() throws SQLException {
        String password = System.getenv("SUPABASE_DB_PASSWORD");
        if (password == null || password.isBlank()) {
            password = "EmYang@GK@2106";
        }

        try (Connection connection = DriverManager.getConnection(JDBC_URL, JDBC_USER, password);
                Statement statement = connection.createStatement()) {
            statement.execute("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS comment TEXT");
            statement.execute("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_comment TEXT");
            statement.execute("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_user_id UUID");
            statement.execute("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_created_at TIMESTAMPTZ");
        }
    }
}
