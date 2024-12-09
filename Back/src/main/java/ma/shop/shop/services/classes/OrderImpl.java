package ma.shop.shop.services.classes;

import lombok.RequiredArgsConstructor;
import ma.shop.shop.dto.OrderDTO;
import ma.shop.shop.entities.Message;
import ma.shop.shop.entities.Order;
import ma.shop.shop.entities.Product;
import ma.shop.shop.entities.Users;
import ma.shop.shop.entities.response.PageResponse;
import ma.shop.shop.repositories.OrderRepository;
import ma.shop.shop.repositories.ProductRepository;
import ma.shop.shop.repositories.UsersRepository;
import ma.shop.shop.services.interfaces.OrderCrud;
import ma.shop.shop.util.AuthenticationUtils;
import ma.shop.shop.util.UniqueIdentifierUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderImpl implements OrderCrud {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UsersRepository userRepository;

    @Override
    public Message addOrder(OrderDTO orderDTO) {
        String orderNumber = UniqueIdentifierUtil.generateUniqueIdentifier("ORDER-");
        Optional<Product> productOptional = productRepository.findById(orderDTO.getProductId());
        if (productOptional.isEmpty()) {
            return new Message(false, "Product not found");
        }
        String userEmail = AuthenticationUtils.getUserEmailFromAuthentication();
        Optional<Users> sellerOptional = userRepository.findByEmail(userEmail);
        if (!sellerOptional.isPresent()) {
            return Message.builder()
                    .success(false)
                    .message("Seller not found")
                    .build();
        }

        Users seller = sellerOptional.get();
        Order order = Order.builder()
                .orderNo(orderNumber)
                .price(orderDTO.getPrice())
                .quantity(null)
                .size(null)
                .preview(orderDTO.getPreview())
                .seller(seller)
                .product(productOptional.get())
                .build();

        orderRepository.save(order);
        return Message.builder()
                .success(true)
                .message("Order added successfully")
                .build();
    }

    @Override
    public Message validateOrder(OrderDTO orderDTO) {
        Optional<Order> orderOptional = orderRepository.findByOrderNo(orderDTO.getOrderNo());
        if (orderOptional.isEmpty()) {
            return Message.builder()
                    .success(false)
                    .message("Order not found")
                    .build();
        }
        Order order = orderOptional.get();

        // Check if the order already has a size and quantity set
        if (order.getSize() != null && order.getQuantity() != null) {
            return Message.builder()
                    .success(false)
                    .message("Order is already validated")
                    .build();
        }

        // Update only the quantity and size from the OrderDTO
        if (orderDTO.getQuantity() != null) {
            order.setQuantity(orderDTO.getQuantity());
        }
        if (orderDTO.getSize() != null) {
            order.setSize(orderDTO.getSize());
        }
        // Save the updated order
        orderRepository.save(order);
        return Message.builder()
                .success(true)
                .message("Order added successfully")
                .build();
    }

    @Override
    public PageResponse<OrderDTO> getAllOrders(int page, int size, String sortBy, String sortDir) {
        // Determine the sorting direction
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        // Create a PageRequest object for pagination and sorting
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        // Fetch orders from the repository with pagination and sorting
        Page<Order> orderPage = orderRepository.findByQuantityNotNullAndSizeNotNull(pageRequest);

        // Map the Page of Order entities to a List of OrderDTO
        List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // Return the PageResponse object
        return PageResponse.<OrderDTO>builder()
                .content(orderDTOs)
                .pageNo(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    public PageResponse<OrderDTO> getUserOrders(int page, int size, String sortBy, String sortDir) {
        // Get the logged-in user's email
        String userEmail = AuthenticationUtils.getUserEmailFromAuthentication();

        // Fetch the user based on the email
        Optional<Users> userOptional = userRepository.findByEmail(userEmail);
        if (!userOptional.isPresent()) {
            return PageResponse.<OrderDTO>builder()
                    .content(List.of())  // Empty list if user not found
                    .pageNo(0)
                    .pageSize(size)
                    .totalElements(0)
                    .totalPages(0)
                    .last(true)
                    .build();
        }

        Users user = userOptional.get();

        // Determine the sorting direction
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        // Create a PageRequest object for pagination and sorting
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        // Fetch orders for the logged-in user (filter by seller, assuming seller is the logged-in user)
        Page<Order> orderPage = orderRepository.findBySeller(user, pageRequest);

        // Map the Page of Order entities to a List of OrderDTO
        List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // Return the PageResponse object
        return PageResponse.<OrderDTO>builder()
                .content(orderDTOs)
                .pageNo(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }
    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
                .orderNo(order.getOrderNo())
                .price(order.getPrice())
                .quantity(order.getQuantity())
                .size(order.getSize())
                .preview(order.getPreview())
                .productId(order.getProduct().getId())
                .sellerId(order.getSeller().getId())
                .build();
    }
}
