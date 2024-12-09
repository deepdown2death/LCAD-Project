package ma.shop.shop.specification;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Subquery;
import ma.shop.shop.entities.Product;
import ma.shop.shop.enums.Sizes;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {
    public static Specification<Product> filterProducts(
            String name,
            Double minPrice,
            Double maxPrice,
            List<Sizes> sizes,
            Boolean active,
            String sortDir,
            Double minAverageRating

    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by name
            if (name != null && !name.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            // Filter by minimum price
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            // Filter by maximum price
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            // Filter by sizes
            if (sizes != null && !sizes.isEmpty()) {
                Predicate sizesPredicate = criteriaBuilder.disjunction();
                for (Sizes size : sizes) {
                    sizesPredicate = criteriaBuilder.or(sizesPredicate, criteriaBuilder.isMember(size, root.get("sizes")));
                }
                predicates.add(sizesPredicate);
            }

            // Filter by active status
            if (active == null || active) {
                predicates.add(criteriaBuilder.equal(root.get("active"), true));
            }
            // Filter by minimum average rating
            if (minAverageRating != null) {
                Subquery<Double> avgRatingSubquery = query.subquery(Double.class);
                var reviewRoot = avgRatingSubquery.from(Product.class);

                avgRatingSubquery.select(criteriaBuilder.avg(reviewRoot.join("reviews").get("rating")))
                        .where(criteriaBuilder.equal(reviewRoot.get("id"), root.get("id")));

                predicates.add(criteriaBuilder.greaterThanOrEqualTo(avgRatingSubquery, minAverageRating));
            }

            // Add sorting by price
            if (sortDir != null && sortDir.equalsIgnoreCase("asc")) {
                query.orderBy(criteriaBuilder.asc(root.get("price")));
            } else if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
                query.orderBy(criteriaBuilder.desc(root.get("price")));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
