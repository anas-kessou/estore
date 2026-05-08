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

        // Create test users
        User user1 = createUser("John", "Doe", "john@example.com", "password123", "ROLE_USER");
        User user2 = createUser("Jane", "Smith", "jane@example.com", "password123", "ROLE_USER");
        User admin = createUser("Admin", "User", "admin@example.com", "admin123", "ROLE_ADMIN");

        // Create categories
        Category electronics = createCategory("Electronics", "Phones, Laptops, Accessories", 1);
        Category books = createCategory("Books", "Fiction, Non-fiction, Textbooks", 2);
        Category sports = createCategory("Sports", "Equipment, Apparel", 3);
        Category homeGarden = createCategory("Home & Garden", "Furniture, Decor", 4);

        // Create products
        Product iphone = createProduct("IP15-PRO", "iPhone 15 Pro", new BigDecimal("999.00"),
                "The latest iPhone with A17 Pro chip", electronics, 50, true);
        Product galaxy = createProduct("S24-GALAXY", "Samsung Galaxy S24", new BigDecimal("849.00"),
                "Samsung's latest flagship smartphone", electronics, 45, true);
        Product macbook = createProduct("MACBOOK-AIR-M3", "MacBook Air M3", new BigDecimal("1099.00"),
                "Apple's lightest and most powerful laptop", electronics, 30, true);
        Product airpods = createProduct("AIRPODS-PRO-2", "AirPods Pro 2", new BigDecimal("249.00"),
                "Premium wireless earbuds with noise cancellation", electronics, 100, true);

        Product cleanCode = createProduct("BOOK-CLEAN-CODE", "Clean Code", new BigDecimal("45.00"),
                "A Handbook of Agile Software Craftsmanship by Robert C. Martin", books, 200, true);
        Product designPatterns = createProduct("BOOK-DESIGN-PATTERNS", "Design Patterns", new BigDecimal("55.00"),
                "Elements of Reusable Object-Oriented Software", books, 150, true);

        Product airMax = createProduct("SHOE-AIR-MAX-90", "Nike Air Max 90", new BigDecimal("129.00"),
                "Classic running shoes with Air cushioning", sports, 75, true);
        Product yogaMat = createProduct("YOGA-MAT-PREMIUM", "Premium Yoga Mat", new BigDecimal("39.99"),
                "Non-slip yoga mat for all practices", sports, 120, true);

        Product lamp = createProduct("HG-LAMP-TABLE-MODERN", "Modern Table Lamp", new BigDecimal("79.00"),
                "Contemporary LED table lamp with adjustable brightness", homeGarden, 60, false);
        Product vase = createProduct("HG-VASE-CERAMIC-FLOWER", "Ceramic Flower Vase", new BigDecimal("35.00"),
                "Handcrafted ceramic vase for fresh flowers", homeGarden, 80, false);

        log.info("Sample data initialization completed!");
        log.info("Test users created:");
        log.info("  - john@example.com / password123");
        log.info("  - jane@example.com / password123");
        log.info("  - admin@example.com / admin123");
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
                .imageUrl("/images/" + name.toLowerCase().replace(" ", "-") + ".jpg")
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
