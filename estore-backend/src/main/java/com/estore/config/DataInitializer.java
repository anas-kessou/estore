package com.estore.config;

import com.estore.catalog.entity.Category;
import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.entity.Profile;
import com.estore.customer.entity.User;
import com.estore.customer.repository.ProfileRepository;
import com.estore.customer.repository.UserRepository;
import com.estore.inventory.entity.Inventory;
import com.estore.inventory.repository.InventoryRepository;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final ProfileRepository profileRepository;
        private final CategoryRepository categoryRepository;
        private final ProductRepository productRepository;
        private final InventoryRepository inventoryRepository;
        private final CartRepository cartRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) {
                if (userRepository.count() > 0) {
                        log.info("Data already initialized, skipping...");
                        return;
                }

                log.info("Initializing sample data...");

                log.info("Initializing baseline data...");

                // Create test users (Required for access)
                User user1 = createUser("John", "Doe", "john@example.com", "password123", "ROLE_USER");
                User user2 = createUser("Jane", "Smith", "jane@example.com", "password123", "ROLE_USER");
                User admin = createUser("Admin", "User", "admin@example.com", "admin123", "ROLE_ADMIN");

                log.info("Baseline data initialized. You can now add Categories and Products via the Admin UI.");
        }

        private User createUser(String firstName, String lastName, String email, String password, String role) {
                User user = User.builder()
                                .firstName(firstName)
                                .lastName(lastName)
                                .email(email)
                                .password(passwordEncoder.encode(password))
                                .role(role)
                                .enabled(true)
                                .build();
                user = userRepository.save(user);

                Profile profile = Profile.builder()
                                .user(user)
                                .phone("+1234567890")
                                .address("123 Main Street")
                                .city("Casablanca")
                                .country("Morocco")
                                .postalCode("20000")
                                .build();
                profileRepository.save(profile);

                Cart cart = Cart.builder()
                                .user(user)
                                .build();
                cartRepository.save(cart);

                return user;
        }

        private Category createCategory(String name, String description, int order) {
                Category category = Category.builder()
                                .name(name)
                                .description(description)
                                .displayOrder(order)
                                .active(true)
                                .build();
                return categoryRepository.save(category);
        }

        private Product createProduct(String externalId, String name, BigDecimal price, String description,
                        Category category, int stock, boolean active) {
                Product product = Product.builder()
                                .externalId(externalId)
                                .name(name)
                                .price(price)
                                .description(description)
                                .category(category)
                                .stockQuantity(stock)
                                .active(active)
                                .featured(true)
                                // Single product image generated from product name.
                                // Using Unsplash's source endpoint avoids needing API keys.
                                .imageUrl("https://source.unsplash.com/600x600/?"
                                                + name.toLowerCase().replaceAll("\\s+", "-"))
                                .build();
                product = productRepository.save(product);

                Inventory inventory = Inventory.builder()
                                .product(product)
                                .quantity(stock)
                                .reservedQuantity(0)
                                .lowStockThreshold(10)
                                .build();
                inventoryRepository.save(inventory);

                return product;
        }
}
