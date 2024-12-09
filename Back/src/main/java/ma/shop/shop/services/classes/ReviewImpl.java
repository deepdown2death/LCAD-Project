package ma.shop.shop.services.classes;

import lombok.RequiredArgsConstructor;
import ma.shop.shop.dto.ProductDTO;
import ma.shop.shop.dto.ReviewDTO;
import ma.shop.shop.entities.Message;
import ma.shop.shop.entities.Product;
import ma.shop.shop.entities.Review;
import ma.shop.shop.entities.Users;
import ma.shop.shop.repositories.ProductRepository;
import ma.shop.shop.repositories.ReviewRepository;
import ma.shop.shop.repositories.UsersRepository;
import ma.shop.shop.services.interfaces.ReviewCrud;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewImpl implements ReviewCrud {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UsersRepository usersRepository;

    private Users getCurrentLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usersRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public Message addReview(ReviewDTO request) {
        try {
            Optional<Product> currentProduct = productRepository.findById(request.getId());
            if (currentProduct.isEmpty()) {
                return Message.builder()
                        .success(false)
                        .message("Product not found")
                        .build();
            }
            Users currentUser = getCurrentLoggedInUser();

            Optional<Review> existingReview = reviewRepository.findByProductAndUser(currentProduct.get(), currentUser);
            if (existingReview.isPresent()) {
                return Message.builder()
                        .success(false)
                        .message("You have already reviewed this product")
                        .build();
            }

            // Create and save the new review
            Review review = Review.builder()
                    .rating(request.getRating())
                    .product(currentProduct.get())
                    .comment(request.getComment())
                    .user(currentUser)
                    .build();
            reviewRepository.save(review);

            return Message.builder()
                    .success(true)
                    .message("Review added successfully")
                    .build();
        } catch (Exception e) {
            return Message.builder()
                    .success(false)
                    .message("Error adding review: " + e.getMessage())
                    .build();
        }
    }


}
