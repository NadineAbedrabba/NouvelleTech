package com.utm.fst.project.repository;

import com.utm.fst.project.entities.SiteReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteReviewRepository extends JpaRepository<SiteReview, Long> {
    List<SiteReview> findByClientId(Long clientId);
    List<SiteReview> findTop10ByOrderByCreatedAtDesc();
    List<SiteReview> findTop10ByOrderByRatingDesc();
}
