package ma.shop.shop.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.shop.shop.enums.Sizes;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private byte[] preview;
    private String orderNo;
    private Double price;
    private Integer quantity;
    @Enumerated(EnumType.STRING)
    private Sizes size;

    @ManyToOne(optional = true)
    @JoinColumn(name = "seller_id", foreignKey = @ForeignKey(name = "fk_orders_seller"))
    private Users seller;

    @ManyToOne
    private Product product;
}
