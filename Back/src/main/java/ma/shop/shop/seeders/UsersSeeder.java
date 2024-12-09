package ma.shop.shop.seeders;


import lombok.RequiredArgsConstructor;
import ma.shop.shop.entities.Users;
import ma.shop.shop.enums.Role;
import ma.shop.shop.enums.UserStatus;
import ma.shop.shop.repositories.UsersRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@RequiredArgsConstructor
public class UsersSeeder implements CommandLineRunner {

    private final UsersRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedData();
    }

    public void seedData() {
        createDefaultUser("admin@admin.com", "admin", "karim", "faloh", Role.ADMIN);
        createCostumerUser("email@email.com", "user", "hamid", "lahlo", Role.CUSTOMER);

    }

    private void createDefaultUser(String email, String password, String firstName, String lastName, Role role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            Users user = Users.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(firstName)
                    .lastName(lastName)
                    .createdAt(new Date())
                    .status(UserStatus.ACTIVE)
                    .role(role)
                    .build();

            userRepository.save(user);
        }
    }
    private void createCostumerUser(String email, String password, String firstName, String lastName, Role role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            Users user = Users.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(firstName)
                    .lastName(lastName)
                    .createdAt(new Date())
                    .status(UserStatus.ACTIVE)
                    .role(role)
                    .build();

            userRepository.save(user);
        }
    }
}