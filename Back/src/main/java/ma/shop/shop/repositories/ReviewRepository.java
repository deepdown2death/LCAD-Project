package ma.shop.shop.repositories;

import ma.shop.shop.entities.Product;
import ma.shop.shop.entities.Review;
import ma.shop.shop.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    Optional<Review> findByProductAndUser(Product product, Users user);
}
