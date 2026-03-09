package backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ForecastResponse {
    private Long productId;
    private String productName;
    private String sku;
    private Integer currentStock;
    private Double predictedDemand;
    private Double averageDailyUsage;
    private Integer daysUntilStockout;
    private String riskLevel;
    private String recommendation;
    private LocalDateTime forecastDate;
}