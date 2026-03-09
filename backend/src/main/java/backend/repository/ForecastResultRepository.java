package backend.repository;

import backend.entity.ForecastResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ForecastResultRepository extends JpaRepository<ForecastResult, Long> {
    List<ForecastResult> findByRiskLevel(String riskLevel);
    Optional<ForecastResult> findTopByProductIdOrderByForecastDateDesc(Long productId);
}