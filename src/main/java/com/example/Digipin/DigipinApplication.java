package com.example.Digipin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DigipinApplication {

	public static void main(String[] args) {
		SpringApplication.run(DigipinApplication.class, args);
		System.out.println("DIGIPIN API is running and API docs can be found at http://localhost:5000/api-docs");
	}

}
