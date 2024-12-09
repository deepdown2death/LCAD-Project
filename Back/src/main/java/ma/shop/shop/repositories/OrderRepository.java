package ma.shop.shop.repositories;

import ma.shop.shop.entities.Order;
import ma.shop.shop.entities.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {
    Optional<Order> findByOrderNo(String orderNo);
    Page<Order> findBySeller(Users seller, PageRequest pageRequest);

    Page<Order> findByQuantityNotNullAndSizeNotNull(Pageable pageable);


}
