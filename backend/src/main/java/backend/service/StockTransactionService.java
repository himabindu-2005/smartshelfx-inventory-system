package backend.service;

import backend.dto.StockTransactionRequest;
import backend.dto.StockTransactionResponse;
import java.util.List;

public interface StockTransactionService {
    StockTransactionResponse recordTransaction(StockTransactionRequest request);
    List<StockTransactionResponse> getAllTransactions();
    List<StockTransactionResponse> getTransactionsByProduct(Long productId);
}