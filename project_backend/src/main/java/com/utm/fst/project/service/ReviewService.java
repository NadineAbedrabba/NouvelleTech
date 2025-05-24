package com.utm.fst.project.service;

import com.utm.fst.project.dto.ReviewDTO;
import java.util.List;

public interface ReviewService {

    ReviewDTO createReview(ReviewDTO reviewDTO);

    List<ReviewDTO> getReviewsByEntreprise(Long entrepriseId);

    List<ReviewDTO> getReviewsByClient(Long clientId);

    void deleteReview(Long reviewId);
}
