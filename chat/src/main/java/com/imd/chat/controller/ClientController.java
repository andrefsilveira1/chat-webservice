package com.imd.chat.controller;

import com.imd.chat.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.imd.chat.repository.ClientRepository;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/")
public class ClientController {
    @Autowired
    private ClientRepository clientRepository;
    @GetMapping("clients")
    public List<Client> getClients() {
        return this.clientRepository.findAll();
    }
}
