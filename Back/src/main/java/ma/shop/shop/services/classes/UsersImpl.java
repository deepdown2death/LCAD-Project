package ma.shop.shop.services.classes;

import lombok.RequiredArgsConstructor;
import ma.shop.shop.entities.request.auth.AuthenticationRequest;
import ma.shop.shop.entities.request.auth.RegisterRequest;
import ma.shop.shop.dto.UsersDto;
import ma.shop.shop.entities.Message;
import ma.shop.shop.entities.Users;
import ma.shop.shop.entities.response.AuthenticationResponse;
import ma.shop.shop.enums.Role;
import ma.shop.shop.repositories.UsersRepository;
import ma.shop.shop.security.JwtService;
import ma.shop.shop.services.interfaces.UsersCrud;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class UsersImpl implements UsersCrud {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private UsersDto convertToUsersDto(Users users) {
        UsersDto usersDto = new UsersDto();
        usersDto.setId(users.getId());
        usersDto.setFirstName(users.getFirstName());
        usersDto.setLastName(users.getLastName());
        usersDto.setEmail(users.getEmail());
        usersDto.setRole(users.getRole());

        return usersDto;
    }


    @Override
    public Message addUser(RegisterRequest user) {
        try {
            // Check if the email is already used
            if (usersRepository.findByEmail(user.getEmail()).isPresent()) {
                return new Message(false, "Email already used");
            }

            // Create and save the user
            Users savedUser = Users.builder()
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(Role.CUSTOMER)
                    .createdAt(new Date())
                    .modifiedAt(new Date())
                    .password(passwordEncoder.encode(user.getPassword()))
                    .build();

            usersRepository.save(savedUser);
            return new Message(true, "User added successfully");
        } catch (Exception e) {
            return new Message(false, "An error occurred while adding the user. Please try again.");
        }
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            // Attempt to authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // Fetch user details
            var user = usersRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

            // Generate JWT token
            String jwtToken = jwtService.generateToken(user);

            // Return successful authentication response
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .user(convertToUsersDto(user))
                    .build();
        } catch (BadCredentialsException e) {
            // Handle invalid login credentials
            return AuthenticationResponse.builder()
                    .token(null)
                    .user(null)
                    .error("Email or password is incorrect")
                    .build();
        } catch (UsernameNotFoundException e) {
            // Handle user not found
            return AuthenticationResponse.builder()
                    .token(null)
                    .user(null)
                    .error("User not found")
                    .build();
        } catch (Exception e) {
            return AuthenticationResponse.builder()
                    .token(null)
                    .user(null)
                    .error("Internal server error")
                    .build();
        }
    }

}
