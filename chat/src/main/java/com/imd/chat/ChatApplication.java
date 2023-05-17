package com.imd.chat;

import com.imd.chat.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.imd.chat.repository.ClientRepository;

@SpringBootApplication
public class ChatApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
	}
	@Autowired
	private ClientRepository clientRepository;
	@Override
	public void run(String... args) throws Exception {
		this.clientRepository.save(new Client("André", "estou enviando mensagem"));
		this.clientRepository.save(new Client("Mateus", "estou enviando a mensagem de volta"));
		this.clientRepository.save(new Client("Pedro", "estou recebendo a mensagem"));
		this.clientRepository.save(new Client("Lucas", "estou analisando as mensagens"));
	}
}
