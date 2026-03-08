package com.jobtracker.dto;

import com.jobtracker.entity.JobApplication.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobApplicationDto {

    // ── Request ───────────────────────────────────────────────────────────────

    public static class Request {

        @NotBlank(message = "Company name is required")
        private String companyName;

        @NotBlank(message = "Job title is required")
        private String jobTitle;

        private String location;

        @NotNull(message = "Status is required")
        private ApplicationStatus status;

        @NotNull(message = "Application date is required")
        private LocalDate applicationDate;

        private String notes;

        public Request() {}

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
    }

    // ── Response ──────────────────────────────────────────────────────────────

    public static class Response {
        private Long id;
        private String companyName;
        private String jobTitle;
        private String location;
        private ApplicationStatus status;
        private LocalDate applicationDate;
        private String notes;
        private LocalDateTime createdAt;

        public Response() {}

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

            public Response build() {
                Response r = new Response();
                r.id = id; r.companyName = companyName; r.jobTitle = jobTitle;
                r.location = location; r.status = status;
                r.applicationDate = applicationDate; r.notes = notes; r.createdAt = createdAt;
                return r;
            }
        }

        public Long getId()                          { return id; }
        public String getCompanyName()               { return companyName; }
        public String getJobTitle()                  { return jobTitle; }
        public String getLocation()                  { return location; }
        public ApplicationStatus getStatus()         { return status; }
        public LocalDate getApplicationDate()        { return applicationDate; }
        public String getNotes()                     { return notes; }
        public LocalDateTime getCreatedAt()          { return createdAt; }
    }

    // ── DashboardStats ────────────────────────────────────────────────────────

    public static class DashboardStats {
        private long totalApplications;
        private long applied;
        private long interview;
        private long offer;
        private long rejected;

        public DashboardStats() {}

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private long totalApplications, applied, interview, offer, rejected;

            public Builder totalApplications(long v) { this.totalApplications = v; return this; }
            public Builder applied(long v)           { this.applied = v; return this; }
            public Builder interview(long v)         { this.interview = v; return this; }
            public Builder offer(long v)             { this.offer = v; return this; }
            public Builder rejected(long v)          { this.rejected = v; return this; }

            public DashboardStats build() {
                DashboardStats s = new DashboardStats();
                s.totalApplications = totalApplications; s.applied = applied;
                s.interview = interview; s.offer = offer; s.rejected = rejected;
                return s;
            }
        }

        public long getTotalApplications() { return totalApplications; }
        public long getApplied()           { return applied; }
        public long getInterview()         { return interview; }
        public long getOffer()             { return offer; }
        public long getRejected()          { return rejected; }
    }
}
