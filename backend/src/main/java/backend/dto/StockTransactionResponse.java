package backend.dto;

import backend.enums.TransactionType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StockTransactionResponse {
    private Long id;
    private String productName;
    private String sku;
    private Integer quantity;
    private TransactionType type;
    private LocalDateTime timestamp;
    private String handledBy;
    private Integer stockAfterTransaction;
}