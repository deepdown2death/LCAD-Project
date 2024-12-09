package ma.shop.shop.controllers;

import lombok.RequiredArgsConstructor;
import ma.shop.shop.dto.OrderDTO;
import ma.shop.shop.dto.ProductDTO;
import ma.shop.shop.entities.Message;
import ma.shop.shop.entities.Order;
import ma.shop.shop.entities.response.PageResponse;
import ma.shop.shop.services.interfaces.OrderCrud;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderCrud orderService;

    @GetMapping
    public ResponseEntity<PageResponse<OrderDTO>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(orderService.getUserOrders(page, size, sortBy, sortDir));
    }

    @GetMapping("/all")
    public ResponseEntity<PageResponse<OrderDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size, sortBy, sortDir));
    }

    @PostMapping("/add")
    public Message createProduct(@RequestBody OrderDTO orderDTO) {
        return orderService.addOrder(orderDTO);
    }
    @PatchMapping("/validate")
    public Message validateOrder(@RequestBody OrderDTO orderDTO) {
        return orderService.validateOrder(orderDTO);
    }
}
