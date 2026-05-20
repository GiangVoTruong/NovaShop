package com.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(BackendApplication.class, args);
	}

	/** Đọc `backend/.env` (không commit) trước khi Spring bind cấu hình. */
	private static void loadDotEnv() {
		Dotenv.configure()
				.directory(".")
				.filename(".env")
				.ignoreIfMissing()
				.systemProperties()
				.load();
	}
}
