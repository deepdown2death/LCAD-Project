package ma.shop.shop.controllers;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import ma.shop.shop.dto.ProductDTO;
import ma.shop.shop.dto.ReviewDTO;
import ma.shop.shop.entities.Message;
import ma.shop.shop.entities.Product;
import ma.shop.shop.entities.Review;
import ma.shop.shop.entities.response.OneResponse;
import ma.shop.shop.entities.response.PageResponse;
import ma.shop.shop.enums.Sizes;
import ma.shop.shop.services.interfaces.ProductCrud;
import ma.shop.shop.services.interfaces.ReviewCrud;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/v1/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductCrud productService;
    private final ReviewCrud reviewService;

    @GetMapping
    public ResponseEntity<PageResponse<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(productService.getAllProducts(page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public OneResponse<ProductDTO> getOneProduct(@PathVariable Long id) {
        return productService.getOneProduct(id);
    }

    @PostMapping("/add")
    public Message createProduct(@RequestBody ProductDTO request) {
        return productService.addProduct(request);
    }

    @PostMapping("/review/add")
    public Message AddReview(@RequestBody ReviewDTO request) {
        return reviewService.addReview(request);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<Message> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        Message response = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public Message deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id);
    }


    @GetMapping("/filter")
    public PageResponse<Product> filterProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minAverageRating,
            @RequestParam(required = false) List<Sizes> sizes,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "desc") String sortDir,
            Pageable pageable
    ) {
        return productService.filterProducts(name, minPrice, maxPrice, sizes,minAverageRating, active,sortDir, pageable);
    }

    @PostMapping("/upload/csv")
    public ResponseEntity<?> uploadCSV(@RequestParam("file") MultipartFile file) {
        try {
            Message response = productService.addProductsFromCSV(new InputStreamReader(file.getInputStream()));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload CSV: " + e.getMessage());
        }
    }
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportProductsToCsv() {
        String csvContent = productService.exportProductsToCsv();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("filename", "products.csv");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent.getBytes(StandardCharsets.UTF_8));
    }
}
