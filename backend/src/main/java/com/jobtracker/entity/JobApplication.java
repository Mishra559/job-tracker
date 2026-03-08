package com.jobtracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company name is required")
    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @NotBlank(message = "Job title is required")
    @Column(name = "job_title", nullable = false, length = 200)
    private String jobTitle;

    @Column(name = "location", length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    @Column(name = "application_date", nullable = false)
    @NotNull(message = "Application date is required")
    private LocalDate applicationDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ApplicationStatus {
        APPLIED, INTERVIEW, OFFER, REJECTED
    }

    public JobApplication() {}

    public JobApplication(Long id, String companyName, String jobTitle, String location,
                          ApplicationStatus status, LocalDate applicationDate,
                          String notes, LocalDateTime createdAt) {
        this.id = id; this.companyName = companyName; this.jobTitle = jobTitle;
        this.location = location; this.status = status;
        this.applicationDate = applicationDate; this.notes = notes; this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String companyName; private String jobTitle;
        private String location; private ApplicationStatus status;
        private LocalDate applicationDate; private String notes; private LocalDateTime createdAt;

        public Builder id(Long v)                   { this.id = v; return this; }
        public Builder companyName(String v)        { this.companyName = v; return this; }
        public Builder jobTitle(String v)           { this.jobTitle = v; return this; }
        public Builder location(String v)           { this.location = v; return this; }
        public Builder status(ApplicationStatus v)  { this.status = v; return this; }
        public Builder applicationDate(LocalDate v) { this.applicationDate = v; return this; }
        public Builder notes(String v)              { this.notes = v; return this; }
        public Builder createdAt(LocalDateTime v)   { this.createdAt = v; return this; }

        public JobApplication build() {
            return new JobApplication(id, companyName, jobTitle, location, status, applicationDate, notes, createdAt);
        }
    }

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }
    public String getCompanyName()               { return companyName; }
    public void setCompanyName(String v)         { this.companyName = v; }
    public String getJobTitle()                  { return jobTitle; }
    public void setJobTitle(String v)            { this.jobTitle = v; }
    public String getLocation()                  { return location; }
    public void setLocation(String v)            { this.location = v; }
    public ApplicationStatus getStatus()         { return status; }
    public void setStatus(ApplicationStatus v)   { this.status = v; }
    public LocalDate getApplicationDate()        { return applicationDate; }
    public void setApplicationDate(LocalDate v)  { this.applicationDate = v; }
    public String getNotes()                     { return notes; }
    public void setNotes(String v)               { this.notes = v; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void setCreatedAt(LocalDateTime v)    { this.createdAt = v; }
}
