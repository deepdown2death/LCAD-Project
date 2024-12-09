package ma.shop.shop.services.interfaces;

import ma.shop.shop.dto.ReviewDTO;
import ma.shop.shop.entities.Message;

public interface ReviewCrud {
    Message addReview(ReviewDTO request);
}
