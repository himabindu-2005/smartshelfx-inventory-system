package backend.dto;
import lombok.Data;
@Data
public class ProductRequest {
    private String name;
    private String sku;
    private String category;
    private Integer reorderLevel;
    private Integer currentStock;
    private Double price;
    private Long vendorId;
}