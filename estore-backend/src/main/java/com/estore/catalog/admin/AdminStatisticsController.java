package com.estore.catalog.admin;

import com.estore.catalog.admin.dto.AdminStatisticsDTO;
import com.estore.catalog.admin.service.AdminStatisticsService;
import com.estore.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticsController {

    private final AdminStatisticsService adminStatisticsService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminStatisticsDTO>> getStatistics() {
        AdminStatisticsDTO statistics = adminStatisticsService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success("Statistics fetched successfully", statistics));
    }
}
