package ma.shop.shop.dto;

import lombok.*;
import ma.shop.shop.enums.Sizes;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private String orderNo;
    private Double price;
    private Integer quantity;
    private Sizes size;
    private byte[] preview;
    private Long productId;
    private Long sellerId;
}
