package backend.entity;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String sku;
    private String category;
    private Integer reorderLevel;
    private Integer currentStock;
    private Double price;
    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private User vendor;
}