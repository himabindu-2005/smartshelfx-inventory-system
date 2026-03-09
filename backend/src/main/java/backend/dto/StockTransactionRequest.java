package backend.dto;

import backend.enums.TransactionType;
import lombok.Data;

@Data
public class StockTransactionRequest {
    private Long productId;
    private Integer quantity;
    private TransactionType type;
    private Long handledById;
}