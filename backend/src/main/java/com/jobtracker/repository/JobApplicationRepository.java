package com.jobtracker.repository;

import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.JobApplication.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for JobApplication entity.
 * Provides CRUD operations and custom query methods.
 */
@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    /**
     * Counts job applications grouped by status.
     * Returns a list of Object[] where [0] = status, [1] = count.
     */
    @Query("SELECT j.status, COUNT(j) FROM JobApplication j GROUP BY j.status")
    List<Object[]> countByStatus();

    /**
     * Searches applications by company name or job title (case-insensitive),
     * with optional status filtering, returning paginated results.
     *
     * @param search  keyword to match against company name or job title
     * @param status  filter by status (null to include all statuses)
     * @param pageable pagination and sort configuration
     * @return paginated results
     */
    @Query("""
        SELECT j FROM JobApplication j
        WHERE (:search IS NULL OR :search = '' OR
               LOWER(j.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:status IS NULL OR j.status = :status)
        """)
    Page<JobApplication> searchAndFilter(
            @Param("search") String search,
            @Param("status") ApplicationStatus status,
            Pageable pageable
    );

    /**
     * Returns the 5 most recently created applications for the dashboard.
     */
    List<JobApplication> findTop5ByOrderByCreatedAtDesc();

    /**
     * Counts the number of applications with the given status.
     */
    long countByStatus(ApplicationStatus status);
}
