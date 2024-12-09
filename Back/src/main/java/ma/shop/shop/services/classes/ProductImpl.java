package ma.shop.shop.services.classes;

import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;

import ma.shop.shop.dto.ProductDTO;
import ma.shop.shop.dto.ReviewDTO;
import ma.shop.shop.entities.*;
import ma.shop.shop.entities.response.OneResponse;
import ma.shop.shop.entities.response.PageResponse;
import ma.shop.shop.enums.Sizes;
import ma.shop.shop.repositories.ProductRepository;
import ma.shop.shop.repositories.UsersRepository;
import ma.shop.shop.services.interfaces.ProductCrud;
import ma.shop.shop.specification.ProductSpecification;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;

import java.io.Reader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class ProductImpl implements ProductCrud {
    private final ProductRepository productRepository;
    private final UsersRepository usersRepository;

    @Override
    public PageResponse<ProductDTO> getAllProducts(int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findByActiveTrue(pageRequest);

        List<ProductDTO> products = productPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return PageResponse.<ProductDTO>builder()
                .content(products)
                .pageNo(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Override
    public OneResponse<ProductDTO> getOneProduct(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);

        if (productOptional.isPresent()) {
            ProductDTO productDto = convertToDTO(productOptional.get());

            return OneResponse.<ProductDTO>builder()
                    .success(true)
                    .content(productDto)
                    .message("Product found")
                    .build();
        } else {
            return OneResponse.<ProductDTO>builder()
                    .success(false)
                    .content(null)
                    .message("Product not found")
                    .build();
        }

    }

    @Override
    public Message addProductsFromCSV(Reader csvReader) {
        try {
            CSVParser parser = new CSVParser(csvReader, CSVFormat.DEFAULT.withHeader());
            List<Product> products = new ArrayList<>();

            for (CSVRecord record : parser) {
                try {
                    // Map CSV data to Product entity
                    Product product = Product.builder()
                            .name(record.get("name"))
                            .description(record.get("description"))
                            .price(Double.parseDouble(record.get("price")))
                            .sizes(parseSizes(record.get("sizes"))) // Parse sizes
                            .active(true)
                            .image(Base64.getDecoder().decode(record.get("image"))) // Base64 encoded image
                            .build();

                    products.add(product);
                } catch (Exception e) {
                    // Log error for the specific row but continue processing others
                    System.err.println("Error processing row: " + record + ", Error: " + e.getMessage());
                }
            }

            productRepository.saveAll(products); // Batch save all valid products
            return Message.builder()
                    .success(true)
                    .message("Products added from csv successfully!")
                    .build();
        } catch (Exception e) {
            return Message.builder()
                    .success(false)
                    .message("Failed to process CSV: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public String exportProductsToCsv() {
        List<ProductDTO> products = productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        StringWriter stringWriter = new StringWriter();
        try (CSVWriter csvWriter = new CSVWriter(stringWriter)) {
            // CSV Header
            csvWriter.writeNext(new String[]{
                    "ID", "Name", "Description", "Price", "Sizes",
                    "Active", "Average Rating", "Review Count", "Reviews"
            });

            // Write product data
            for (ProductDTO product : products) {
                csvWriter.writeNext(new String[]{
                        String.valueOf(product.getId()),
                        product.getName(),
                        product.getDescription(),
                        String.valueOf(product.getPrice()),
                        product.getSizes().toString(),
                        String.valueOf(product.getActive()),
                        String.valueOf(product.getAverageRating()),
                        String.valueOf(product.getReviewCount()),
                        formatReviews(product.getReviews())
                });
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to export products to CSV", e);
        }

        return stringWriter.toString();
    }


    @Override
    public Message addProduct(ProductDTO productDTO) {
        try {
            byte[] imageBytes = Base64.getDecoder().decode(productDTO.getImage());

            // Create a new Product entity
            Product product = Product.builder()
                    .image(imageBytes)
                    .name(productDTO.getName())
                    .description(productDTO.getDescription())
                    .price(productDTO.getPrice())
                    .sizes(productDTO.getSizes())
                    .active(true)
                    .build();

            // Add reviews if provided in the DTO (assuming reviews are passed in ProductDTO)
            if (productDTO.getReviews() != null) {
                List<Review> reviews = productDTO.getReviews().stream()
                        .map(reviewDTO -> Review.builder()
                                .rating(reviewDTO.getRating())
                                .comment(reviewDTO.getComment())
                                .product(product)
                                .build())
                        .collect(Collectors.toList());
                product.setReviews(reviews);
            }

            productRepository.save(product);

            return Message.builder()
                    .success(true)
                    .message("Product added successfully")
                    .build();
        } catch (IllegalArgumentException e) {
            return Message.builder()
                    .success(false)
                    .message("Invalid image data: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            return Message.builder()
                    .success(false)
                    .message("Error adding product: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public Message updateProduct(Long id, ProductDTO productDTO) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            byte[] imageBytes = null;
            if (productDTO.getImage() != null) {
                imageBytes = Base64.getDecoder().decode(productDTO.getImage());
            }
            product.setDescription(productDTO.getDescription());
            product.setName(productDTO.getName());
            product.setPrice(productDTO.getPrice());
            product.setSizes(productDTO.getSizes());
            product.setActive(true);

            if (imageBytes != null) {
                product.setImage(imageBytes);
            }

            productRepository.save(product);

            return Message.builder()
                    .success(true)
                    .message("Product updated successfully")
                    .build();
        } catch (Exception e) {
            return Message.builder()
                    .success(false)
                    .message("Error updating product: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public Message deleteProduct(Long id) {
        try {
            Optional<Product> selectedOrder = productRepository.findById(id);
            selectedOrder.ifPresent(product -> product.setActive(false));
            return Message.builder()
                    .success(true)
                    .message("Product deleted successfully")
                    .build();
        } catch (Exception e) {
            return Message.builder()
                    .success(false)
                    .message("Error deleting product: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public PageResponse<Product> filterProducts(
            String name,
            Double minPrice,
            Double maxPrice,
            List<Sizes> sizes,
            Double minAverageRating,
            Boolean active,
            String sortDir,
            Pageable pageable
    ) {

        Page<Product> page = productRepository.findAll(
                ProductSpecification.filterProducts(name, minPrice, maxPrice, sizes, active,sortDir, minAverageRating),
                pageable
        );

        // Map Page to PageResponse
        return PageResponse.<Product>builder()
                .content(page.getContent())
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private String formatReviews(List<ReviewDTO> reviews) {
        return reviews.stream()
                .map(review -> review.getRating() + ":" + review.getComment())
                .collect(Collectors.joining("|"));
    }

    private List<Sizes> parseSizes(String sizesString) {
        List<Sizes> sizes = new ArrayList<>();
        if (sizesString != null && !sizesString.isEmpty()) {
            String[] sizeArray = sizesString.split(",");
            for (String size : sizeArray) {
                sizes.add(Sizes.valueOf(size.trim().toUpperCase()));
            }
        }
        return sizes;
    }

    private ProductDTO convertToDTO(Product product) {
        // Convert reviews to ReviewDTOs
        List<ReviewDTO> reviewDTOs = product.getReviews().stream()
                .map(review -> ReviewDTO.builder()
                        .id(review.getId())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .user(review.getUser().getEmail())
                        .build())
                .collect(Collectors.toList());


        double averageRating = product.getReviews().stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        int reviewCount = product.getReviews().size(); // Count the number of reviews

        return ProductDTO.builder()
                .id(product.getId())
                .image(product.getImage() != null ? Base64.getEncoder().encodeToString(product.getImage()) : null)
                .name(product.getName())
                .price(product.getPrice())
                .sizes(product.getSizes())
                .description(product.getDescription())
                .active(product.getActive())
                .reviews(reviewDTOs) // Include reviews in DTO
                .averageRating(averageRating) // Set the average rating
                .reviewCount(reviewCount) // Set the review count
                .build();
    }

}
