package com.utm.fst.project.service;

import com.utm.fst.project.dto.SiteReviewDTO;
import java.util.List;

public interface SiteReviewService {
    SiteReviewDTO createSiteReview(SiteReviewDTO siteReviewDTO);
    SiteReviewDTO getSiteReview(Long id);
    List<SiteReviewDTO> getAllSiteReviews();
    List<SiteReviewDTO> getRecentSiteReviews();
    List<SiteReviewDTO> getTopRatedSiteReviews();
    List<SiteReviewDTO> getSiteReviewsByClient(Long clientId);
    void deleteSiteReview(Long id);
}
