package ma.shop.shop.util;
import ma.shop.shop.entities.Users;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthenticationUtils {
    public static String getUserEmailFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // Extract user email from authentication object
            Object principal = authentication.getPrincipal();
            if (principal instanceof Users currentUser) {
                return currentUser.getEmail();
            }
        }
        return null;
    }
}
