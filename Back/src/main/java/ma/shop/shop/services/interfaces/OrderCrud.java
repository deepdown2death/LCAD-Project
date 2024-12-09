package ma.shop.shop.services.interfaces;

import ma.shop.shop.dto.OrderDTO;
import ma.shop.shop.dto.ProductDTO;
import ma.shop.shop.entities.Message;
import ma.shop.shop.entities.Order;
import ma.shop.shop.entities.response.PageResponse;

public interface OrderCrud {
    PageResponse<OrderDTO> getAllOrders(int page, int size, String sortBy, String sortDir);
    Message addOrder(OrderDTO orderDTO);

    Message validateOrder(OrderDTO orderDTO);

    PageResponse<OrderDTO> getUserOrders(int page, int size, String sortBy, String sortDir);
}
