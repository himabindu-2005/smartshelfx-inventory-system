package backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class MLServiceClient {

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public Map<String, Object> getPrediction(Long productId,
                                              Integer currentStock,
                                              Integer reorderLevel,
                                              List<Integer> transactions) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("productId", productId);
            requestBody.put("currentStock", currentStock);
            requestBody.put("reorderLevel", reorderLevel);
            requestBody.put("transactions", transactions);

            return WebClient.create(mlServiceUrl)
                    .post()
                    .uri("/predict")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

        } catch (Exception e) {
            // If Python service is down, return null
            // Spring Boot will fall back to Java forecasting
            return null;
        }
    }
}