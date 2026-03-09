package backend.service;

import backend.dto.ProductRequest;
import backend.dto.ProductResponse;
import java.util.List;

public interface ProductService {
    ProductResponse addProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getByCategory(String category);
    List<ProductResponse> getLowStockProducts();
}