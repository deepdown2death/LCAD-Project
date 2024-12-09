package ma.shop.shop.controllers;

import lombok.RequiredArgsConstructor;
import ma.shop.shop.entities.request.auth.AuthenticationRequest;
import ma.shop.shop.entities.request.auth.RegisterRequest;
import ma.shop.shop.entities.Message;
import ma.shop.shop.entities.response.AuthenticationResponse;
import ma.shop.shop.services.interfaces.UsersCrud;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class UserController {
    private final UsersCrud userService;

    @PostMapping("/register")
    public Message createUser(@RequestBody RegisterRequest request) {
        return userService.addUser(request);
    }
    @PostMapping("/authenticate")
    public AuthenticationResponse authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return userService.authenticate(request);
    }



}
