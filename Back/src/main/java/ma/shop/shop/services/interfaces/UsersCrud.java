package ma.shop.shop.services.interfaces;

import ma.shop.shop.entities.request.auth.AuthenticationRequest;
import ma.shop.shop.entities.request.auth.RegisterRequest;
import ma.shop.shop.entities.Message;
import ma.shop.shop.entities.response.AuthenticationResponse;

public interface UsersCrud {

    Message addUser(RegisterRequest user);
    AuthenticationResponse authenticate(AuthenticationRequest user);

}
