package com.estore.catalog.admin.service;

import com.estore.catalog.admin.dto.ProductsCsvImportSummary;
import com.estore.catalog.entity.Category;
import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.exception.BadRequestException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductsCsvImportService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    private static final int BATCH_SIZE = 200;
    private static final int MAX_ERRORS = 10;

    @Transactional
    public ProductsCsvImportSummary importProducts(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("CSV file is required");
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new BadRequestException("CSV is empty");
            }

            List<String> headers = parseCsvLine(headerLine);
            Map<String, Integer> idxByHeader = indexHeaders(headers);

            // Common headers expected (case-insensitive)
            Integer externalIdIdx = getIndex(idxByHeader, "Product ID");
            Integer productNameIdx = getIndex(idxByHeader, "Product Name");
            Integer brandDescIdx = getIndex(idxByHeader, "Brand Desc");
            Integer mrpIdx = getIndexOptional(idxByHeader, "MRP");
            Integer sellPriceIdx = getIndex(idxByHeader, "SellPrice");
            Integer discountIdx = getIndexOptional(idxByHeader, "Discount");
            Integer categoryIdx = getIndex(idxByHeader, "Category");

            int totalRows = 0;
            int created = 0;
            int updated = 0;
            int skipped = 0;
            int failed = 0;

            List<String> errors = new ArrayList<>();

            // small cache to avoid repetitive category lookups
            Map<String, Category> categoryCache = new HashMap<>();

            List<Product> batch = new ArrayList<>(BATCH_SIZE);

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank())
                    continue;

                totalRows++;
                try {
                    List<String> cols = parseCsvLine(line);

                    String externalId = safeGet(cols, externalIdIdx).trim();
                    String productName = safeGet(cols, productNameIdx).trim();
                    String brandDesc = safeGet(cols, brandDescIdx).trim();
                    String categoryName = safeGet(cols, categoryIdx).trim();

                    if (externalId.isBlank() || productName.isBlank() || categoryName.isBlank()) {
                        skipped++;
                        continue;
                    }

                    BigDecimal sellPrice = parseBigDecimal(safeGet(cols, sellPriceIdx));
                    if (sellPrice == null) {
                        skipped++;
                        continue;
                    }

                    // category: create/find by normalized category name
                    String normalizedCategoryName = normalizeCategoryName(categoryName);
                    Category category = categoryCache.computeIfAbsent(normalizedCategoryName,
                            name -> categoryRepository.findByName(name)
                                    .orElseGet(() -> categoryRepository.save(
                                            Category.builder()
                                                    .name(name)
                                                    .description(null)
                                                    .active(true)
                                                    .displayOrder(0)
                                                    .build())));

                    Product existing = productRepository.findByExternalId(externalId).orElse(null);

                    Product toSave;
                    boolean isUpdate = existing != null;

                    if (isUpdate) {
                        toSave = existing;
                    } else {
                        // active/featured defaults are handled by entity builder defaults, but ensure
                        // required fields
                        toSave = Product.builder()
                                .externalId(externalId)
                                .active(true)
                                .featured(false)
                                .stockQuantity(0)
                                .build();
                    }

                    toSave.setName(productName);

                    // Use Brand Desc as description if entity supports it
                    // Note: this import doesn't currently map MRP/Discount due to entity not having
                    // fields.
                    toSave.setDescription(brandDesc != null && !brandDesc.isBlank() ? brandDesc : null);

                    // price
                    toSave.setPrice(sellPrice);

                    // category relation (required)
                    toSave.setCategory(category);

                    // best-effort stock/active from dataset if present in columns
                    // (No reliable stock columns in provided assumptions; default to
                    // existing/current)
                    // Discount/MRP are ignored because Product entity has no dedicated fields.

                    batch.add(toSave);

                    if (batch.size() >= BATCH_SIZE) {
                        int[] counts = persistBatch(batch);
                        created += counts[0];
                        updated += counts[1];
                        batch.clear();
                    }
                } catch (Exception e) {
                    failed++;
                    if (errors.size() < MAX_ERRORS) {
                        errors.add("Row " + totalRows + ": " + e.getMessage());
                    }
                }
            }

            if (!batch.isEmpty()) {
                int[] counts = persistBatch(batch);
                created += counts[0];
                updated += counts[1];
            }

            return ProductsCsvImportSummary.builder()
                    .totalRows(totalRows)
                    .created(created)
                    .updated(updated)
                    .skipped(skipped)
                    .failed(failed)
                    .errors(errors)
                    .build();
        } catch (IOException e) {
            throw new BadRequestException("Failed to read CSV: " + e.getMessage());
        }
    }

    private int[] persistBatch(List<Product> batch) {
        // Determine created vs updated based on externalId existence before save
        Set<String> externalIds = batch.stream()
                .map(Product::getExternalId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<Product> existingProducts = externalIds.isEmpty()
                ? List.of()
                : productRepository.findByExternalIdIn(externalIds);

        Map<String, Product> existingByExternal = existingProducts.stream()
                .collect(Collectors.toMap(Product::getExternalId, p -> p));

        List<Product> toSave = new ArrayList<>(batch.size());

        int created = 0;
        int updated = 0;

        for (Product p : batch) {
            if (existingByExternal.containsKey(p.getExternalId())) {
                updated++;
            } else {
                created++;
            }
            toSave.add(p);
        }

        productRepository.saveAll(toSave);
        // flush not strictly required due to transactional context, but helps memory
        productRepository.flush();
        return new int[] { created, updated };
    }

    private Map<String, Integer> indexHeaders(List<String> headers) {
        Map<String, Integer> idx = new HashMap<>();
        for (int i = 0; i < headers.size(); i++) {
            idx.put(headers.get(i).trim(), i);
        }
        return idx;
    }

    private Integer getIndex(Map<String, Integer> idxByHeader, String expectedHeader) {
        Integer v = getIndexOptional(idxByHeader, expectedHeader);
        if (v == null) {
            throw new BadRequestException("Missing required CSV header: " + expectedHeader);
        }
        return v;
    }

    private Integer getIndexOptional(Map<String, Integer> idxByHeader, String expectedHeader) {
        // case-insensitive match
        for (Map.Entry<String, Integer> e : idxByHeader.entrySet()) {
            if (e.getKey().equalsIgnoreCase(expectedHeader)) {
                return e.getValue();
            }
        }
        return null;
    }

    private String safeGet(List<String> cols, Integer idx) {
        if (idx == null)
            return "";
        if (idx < 0 || idx >= cols.size())
            return "";
        return cols.get(idx);
    }

    private BigDecimal parseBigDecimal(String s) {
        if (s == null)
            return null;
        String trimmed = s.trim();
        if (trimmed.isBlank())
            return null;

        // remove common formatting
        String normalized = trimmed.replace(",", "");
        return new BigDecimal(normalized);
    }

    private String normalizeCategoryName(String raw) {
        // Keep it simple: trim and collapse whitespace, but preserve hyphens for
        // "Westernwear-Women"
        return raw.trim().replaceAll("\\s+", " ");
    }

    // Basic CSV parser:
    // - supports quoted fields with commas inside
    // - supports escaped quotes by doubling ("")
    private List<String> parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                // if double quote inside quotes
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    sb.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                result.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        result.add(sb.toString());
        return result;
    }
}
