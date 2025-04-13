package com.utm.fst.project.controller;

import com.utm.fst.project.dto.SignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class SignupController {


    @Autowired
    private UserService userService;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signupUser(@RequestBody SignupDTO signupDTO){

       if(userService.hasUserWithEmail(signupDTO.getEmail())) {
           return new ResponseEntity<>("user existe deja", HttpStatus.NOT_ACCEPTABLE);
       }
       UserDTO createdUser =  userService.createUser(signupDTO);
       if (createdUser == null) {
           return new ResponseEntity<>("Erreur lors de la creation du user ! essayer plus tard", HttpStatus.BAD_REQUEST);
       }
       return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

}
