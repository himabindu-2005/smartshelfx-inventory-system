package backend.service.impl;

import backend.config.MLServiceClient;
import backend.dto.ForecastResponse;
import backend.entity.ForecastResult;
import backend.entity.Product;
import backend.entity.StockTransaction;
import backend.enums.TransactionType;
import backend.repository.ForecastResultRepository;
import backend.repository.ProductRepository;
import backend.repository.StockTransactionRepository;
import backend.service.ForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForecastServiceImpl implements ForecastService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository transactionRepository;
    private final ForecastResultRepository forecastResultRepository;
    private final MLServiceClient mlServiceClient;

    private ForecastResponse calculateForecast(Product product) {
        // Get all OUT transactions
        List<StockTransaction> transactions = transactionRepository
                .findByProductId(product.getId())
                .stream()
                .filter(t -> t.getType() == TransactionType.OUT)
                .collect(Collectors.toList());

        List<Integer> quantities = transactions.stream()
                .map(StockTransaction::getQuantity)
                .collect(Collectors.toList());

        // Try Python ML service first
        Map<String, Object> mlResult = mlServiceClient.getPrediction(
                product.getId(),
                product.getCurrentStock(),
                product.getReorderLevel(),
                quantities
        );

        double predictedDemand;
        double avgDailyUsage;
        int daysUntilStockout;
        String riskLevel;
        String recommendation;

        if (mlResult != null) {
            // Use Python ML results
            predictedDemand = ((Number) mlResult.get("predictedDemand")).doubleValue();
            avgDailyUsage = ((Number) mlResult.get("averageDailyUsage")).doubleValue();
            daysUntilStockout = ((Number) mlResult.get("daysUntilStockout")).intValue();
            riskLevel = (String) mlResult.get("riskLevel");
            recommendation = (String) mlResult.get("recommendation");
        } else {
            // Fallback to Java logic
            double totalUsage = quantities.stream().mapToInt(Integer::intValue).sum();
            avgDailyUsage = quantities.isEmpty() ? 1.0 : totalUsage / quantities.size();
            predictedDemand = avgDailyUsage * 7;
            daysUntilStockout = avgDailyUsage > 0 ?
                    (int) (product.getCurrentStock() / avgDailyUsage) : 999;

            if (daysUntilStockout <= 3) {
                riskLevel = "HIGH";
                recommendation = "URGENT: Restock immediately!";
            } else if (daysUntilStockout <= 7) {
                riskLevel = "MEDIUM";
                recommendation = "Restock within next 3 days";
            } else {
                riskLevel = "LOW";
                recommendation = "Stock level is healthy";
            }
        }

        // Save forecast result
        ForecastResult result = new ForecastResult();
        result.setProduct(product);
        result.setPredictedDemand(predictedDemand);
        result.setAverageDailyUsage(avgDailyUsage);
        result.setDaysUntilStockout(daysUntilStockout);
        result.setRiskLevel(riskLevel);
        result.setForecastDate(LocalDateTime.now());
        forecastResultRepository.save(result);

        // Build response
        ForecastResponse response = new ForecastResponse();
        response.setProductId(product.getId());
        response.setProductName(product.getName());
        response.setSku(product.getSku());
        response.setCurrentStock(product.getCurrentStock());
        response.setPredictedDemand(predictedDemand);
        response.setAverageDailyUsage(avgDailyUsage);
        response.setDaysUntilStockout(daysUntilStockout);
        response.setRiskLevel(riskLevel);
        response.setRecommendation(recommendation);
        response.setForecastDate(LocalDateTime.now());
        return response;
    }

  @Override
    public ForecastResponse forecastProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return calculateForecast(product);
    }

    @Override
    public List<ForecastResponse> forecastAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::calculateForecast)
                .collect(Collectors.toList());
    }

    @Override
    public List<ForecastResponse> getHighRiskProducts() {
        return forecastResultRepository.findByRiskLevel("HIGH")
                .stream()
                .map(f -> calculateForecast(f.getProduct()))
                .collect(Collectors.toList());
    }
}