package backend.controller;

import backend.dto.ForecastResponse;
import backend.service.ForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/forecast")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ForecastController {

    private final ForecastService forecastService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ForecastResponse> forecastProduct(
            @PathVariable Long productId) {
        return ResponseEntity.ok(forecastService.forecastProduct(productId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ForecastResponse>> forecastAll() {
        return ResponseEntity.ok(forecastService.forecastAllProducts());
    }

    @GetMapping("/high-risk")
    public ResponseEntity<List<ForecastResponse>> getHighRisk() {
        return ResponseEntity.ok(forecastService.getHighRiskProducts());
    }
}