package com.utm.fst.project.service.user;

import com.utm.fst.project.dto.SignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.entities.User;
import com.utm.fst.project.enums.UserRole;
import com.utm.fst.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO createUser(SignupDTO signupDTO) {
        User user = new User();
        user.setEmail(signupDTO.getEmail());


        user.setPassword(new BCryptPasswordEncoder().encode(signupDTO.getPassword()));

        user.setUserRole(UserRole.USER);

        User createdUser = userRepository.save(user);
        UserDTO userDTO =new UserDTO();
        userDTO.setId(createdUser.getId());
        userDTO.setEmail(createdUser.getEmail());


        userDTO.setUserRole(createdUser.getUserRole());
        return userDTO ;

    }

    @Override
    public boolean hasUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email) != null;
    }
}
