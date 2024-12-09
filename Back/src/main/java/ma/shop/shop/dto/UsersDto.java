package ma.shop.shop.dto;
import lombok.*;
import ma.shop.shop.enums.Role;
import ma.shop.shop.enums.UserStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
