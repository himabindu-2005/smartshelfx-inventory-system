package backend.controller;

import backend.dto.StockTransactionRequest;
import backend.dto.StockTransactionResponse;
import backend.service.StockTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StockTransactionController {

    private final StockTransactionService transactionService;

    @PostMapping
    public ResponseEntity<StockTransactionResponse> recordTransaction(
            @RequestBody StockTransactionRequest request) {
        return ResponseEntity.ok(transactionService.recordTransaction(request));
    }

    @GetMapping
    public ResponseEntity<List<StockTransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockTransactionResponse>> getByProduct(
            @PathVariable Long productId) {
        return ResponseEntity.ok(transactionService.getTransactionsByProduct(productId));
    }
}