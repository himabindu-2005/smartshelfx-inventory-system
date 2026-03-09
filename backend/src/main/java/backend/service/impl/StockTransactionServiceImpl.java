package backend.service.impl;

import backend.dto.StockTransactionRequest;
import backend.dto.StockTransactionResponse;
import backend.entity.Product;
import backend.entity.StockTransaction;
import backend.entity.User;
import backend.enums.TransactionType;
import backend.repository.ProductRepository;
import backend.repository.StockTransactionRepository;
import backend.repository.UserRepository;
import backend.service.StockTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockTransactionServiceImpl implements StockTransactionService {

    private final StockTransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private StockTransactionResponse mapToResponse(StockTransaction t) {
        StockTransactionResponse response = new StockTransactionResponse();
        response.setId(t.getId());
        response.setProductName(t.getProduct().getName());
        response.setSku(t.getProduct().getSku());
        response.setQuantity(t.getQuantity());
        response.setType(t.getType());
        response.setTimestamp(t.getTimestamp());
        response.setHandledBy(t.getHandledBy().getName());
        response.setStockAfterTransaction(t.getProduct().getCurrentStock());
        return response;
    }

    @Override
    public StockTransactionResponse recordTransaction(StockTransactionRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User handler = userRepository.findById(request.getHandledById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update stock
        if (request.getType() == TransactionType.IN) {
            product.setCurrentStock(product.getCurrentStock() + request.getQuantity());
        } else {
            if (product.getCurrentStock() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock!");
            }
            product.setCurrentStock(product.getCurrentStock() - request.getQuantity());
        }
        productRepository.save(product);

        // Save transaction
        StockTransaction transaction = new StockTransaction();
        transaction.setProduct(product);
        transaction.setQuantity(request.getQuantity());
        transaction.setType(request.getType());
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setHandledBy(handler);

        return mapToResponse(transactionRepository.save(transaction));
    }

    @Override
    public List<StockTransactionResponse> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StockTransactionResponse> getTransactionsByProduct(Long productId) {
        return transactionRepository.findByProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}