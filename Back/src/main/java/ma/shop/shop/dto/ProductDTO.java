package ma.shop.shop.dto;

import lombok.*;
import ma.shop.shop.entities.Review;
import ma.shop.shop.enums.Sizes;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String image; // Base64 encoded string
    private String name;
    private String description;
    private Double price;
    private List<Sizes> sizes;
    private Boolean active;
    private List<ReviewDTO> reviews;
    private Double averageRating; // Average rating of the product
    private Integer reviewCount; // Total number of reviews
}
