package ma.shop.shop.services.interfaces;

import jakarta.servlet.http.HttpServletResponse;
import ma.shop.shop.dto.ProductDTO;
import ma.shop.shop.entities.Message;

import ma.shop.shop.entities.Product;
import ma.shop.shop.entities.response.OneResponse;
import ma.shop.shop.entities.response.PageResponse;
import ma.shop.shop.enums.Sizes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.io.Reader;
import java.util.List;

public interface ProductCrud {

    Message addProductsFromCSV(Reader csvReader);

    String exportProductsToCsv();

    Message addProduct(ProductDTO productDTO);

    Message deleteProduct(Long id);

    PageResponse<ProductDTO> getAllProducts(int page, int size, String sortBy, String sortDir);
    OneResponse<ProductDTO> getOneProduct(Long id);
    @Transactional
    Message updateProduct(Long id, ProductDTO productDTO);

    PageResponse<Product> filterProducts(
            String name,
            Double minPrice,
            Double maxPrice,
            List<Sizes> sizes,
            Double minAverageRating,
            Boolean active,
            String sortDir,
            Pageable pageable
    );
}
