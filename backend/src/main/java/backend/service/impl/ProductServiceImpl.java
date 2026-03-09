package backend.service.impl;

import backend.dto.ProductRequest;
import backend.dto.ProductResponse;
import backend.entity.Product;
import backend.entity.User;
import backend.repository.ProductRepository;
import backend.repository.UserRepository;
import backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setSku(product.getSku());
        response.setPrice(product.getPrice());
        response.setCategory(product.getCategory());
        response.setVendorId(product.getVendor() != null ? product.getVendor().getId() : null);
        response.setReorderLevel(product.getReorderLevel());
        response.setCurrentStock(product.getCurrentStock());
        response.setVendorName(product.getVendor() != null ?
                product.getVendor().getName() : "N/A");
        response.setStockStatus(
                product.getCurrentStock() <= product.getReorderLevel()
                ? "LOW" : "OK");
        return response;
    }

    @Override
    public ProductResponse addProduct(ProductRequest request) {
        User vendor = userRepository.findById(request.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setReorderLevel(request.getReorderLevel());
        product.setCurrentStock(request.getCurrentStock());
        product.setVendor(vendor);
        product.setPrice(request.getPrice());

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User vendor = userRepository.findById(request.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setReorderLevel(request.getReorderLevel());
        product.setCurrentStock(request.getCurrentStock());
        product.setVendor(vendor);
        product.setPrice(request.getPrice());

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findAll()
                .stream()
                .filter(p -> p.getCurrentStock() <= p.getReorderLevel())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}