package com.jobtracker.service;

import com.jobtracker.dto.JobApplicationDto;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.JobApplication.ApplicationStatus;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.JobApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobApplicationService {

    private static final Logger log = LoggerFactory.getLogger(JobApplicationService.class);

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public JobApplicationDto.Response create(JobApplicationDto.Request request) {
        log.info("Creating new job application for company: {}", request.getCompanyName());
        JobApplication application = mapToEntity(request);
        JobApplication saved = repository.save(application);
        log.info("Job application created with ID: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<JobApplicationDto.Response> getAll(String search, ApplicationStatus status,
                                                    int page, int size, String sortBy, String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return repository.searchAndFilter(search, status, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public JobApplicationDto.Response getById(Long id) {
        log.info("Fetching job application with ID: {}", id);
        return repository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with ID: " + id));
    }

    public JobApplicationDto.Response update(Long id, JobApplicationDto.Request request) {
        log.info("Updating job application with ID: {}", id);
        JobApplication existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with ID: " + id));

        existing.setCompanyName(request.getCompanyName());
        existing.setJobTitle(request.getJobTitle());
        existing.setLocation(request.getLocation());
        existing.setStatus(request.getStatus());
        existing.setApplicationDate(request.getApplicationDate());
        existing.setNotes(request.getNotes());

        JobApplication updated = repository.save(existing);
        log.info("Job application updated successfully for ID: {}", id);
        return mapToResponse(updated);
    }

    public void delete(Long id) {
        log.info("Deleting job application with ID: {}", id);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Job application not found with ID: " + id);
        }
        repository.deleteById(id);
        log.info("Job application deleted successfully for ID: {}", id);
    }

    @Transactional(readOnly = true)
    public JobApplicationDto.DashboardStats getDashboardStats() {
        return JobApplicationDto.DashboardStats.builder()
                .totalApplications(repository.count())
                .applied(repository.countByStatus(ApplicationStatus.APPLIED))
                .interview(repository.countByStatus(ApplicationStatus.INTERVIEW))
                .offer(repository.countByStatus(ApplicationStatus.OFFER))
                .rejected(repository.countByStatus(ApplicationStatus.REJECTED))
                .build();
    }

    @Transactional(readOnly = true)
    public List<JobApplicationDto.Response> getRecentApplications() {
        return repository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private JobApplication mapToEntity(JobApplicationDto.Request request) {
        return JobApplication.builder()
                .companyName(request.getCompanyName())
                .jobTitle(request.getJobTitle())
                .location(request.getLocation())
                .status(request.getStatus())
                .applicationDate(request.getApplicationDate())
                .notes(request.getNotes())
                .build();
    }

    private JobApplicationDto.Response mapToResponse(JobApplication application) {
        return JobApplicationDto.Response.builder()
                .id(application.getId())
                .companyName(application.getCompanyName())
                .jobTitle(application.getJobTitle())
                .location(application.getLocation())
                .status(application.getStatus())
                .applicationDate(application.getApplicationDate())
                .notes(application.getNotes())
                .createdAt(application.getCreatedAt())
                .build();
    }
}
