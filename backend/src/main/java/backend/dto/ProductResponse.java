package backend.dto;
import lombok.Data;
@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private Integer reorderLevel;
    private Integer currentStock;
    private Double price;
    private Long vendorId;
    private String vendorName;
    private String stockStatus;
}