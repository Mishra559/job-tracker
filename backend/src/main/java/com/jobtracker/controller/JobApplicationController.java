package com.jobtracker.controller;

import com.jobtracker.dto.JobApplicationDto;
import com.jobtracker.entity.JobApplication.ApplicationStatus;
import com.jobtracker.service.JobApplicationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobApplicationController {

    private static final Logger log = LoggerFactory.getLogger(JobApplicationController.class);

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<JobApplicationDto.Response> create(
            @Valid @RequestBody JobApplicationDto.Request request) {
        log.info("POST /api/jobs - Creating application for: {}", request.getCompanyName());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<Page<JobApplicationDto.Response>> getAll(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "applicationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        log.info("GET /api/jobs - search='{}', status={}, page={}, size={}", search, status, page, size);
        return ResponseEntity.ok(service.getAll(search, status, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDto.Response> getById(@PathVariable Long id) {
        log.info("GET /api/jobs/{}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDto.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationDto.Request request) {
        log.info("PUT /api/jobs/{}", id);
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("DELETE /api/jobs/{}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<JobApplicationDto.DashboardStats> getDashboardStats() {
        log.info("GET /api/jobs/dashboard/stats");
        return ResponseEntity.ok(service.getDashboardStats());
    }

    @GetMapping("/dashboard/recent")
    public ResponseEntity<List<JobApplicationDto.Response>> getRecentApplications() {
        log.info("GET /api/jobs/dashboard/recent");
        return ResponseEntity.ok(service.getRecentApplications());
    }
}
