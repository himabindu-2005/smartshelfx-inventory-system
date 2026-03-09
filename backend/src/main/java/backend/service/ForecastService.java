package backend.service;

import backend.dto.ForecastResponse;
import java.util.List;

public interface ForecastService {
    ForecastResponse forecastProduct(Long productId);
    List<ForecastResponse> forecastAllProducts();
    List<ForecastResponse> getHighRiskProducts();
}