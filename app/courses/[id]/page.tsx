'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";

type Review = {
  review_id: number;
  username: string;
  comment_text: string;
  content_interest: number;
  teaching: number;
  grading_criteria: number;
  like_count: number;
};

export default function CoursePage() {
  const { id } = useParams();
  const [courseName, setCourseName] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const hasMore = useRef(true);

  const fetchCourseName = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/courses/${id}`);
      const data = await res.json();
      setCourseName(data.course_name);
    } catch (err) {
      setCourseName("Unknown Course");
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    if (!id || loading || !hasMore.current) return;

    setLoading(true);
    const res = await fetch(`/api/courses/${id}/reviews?limit=${limit}&offset=${offset}`);
    const data: Review[] = await res.json();

    if (data.length < limit) hasMore.current = false;
    setReviews((prev) => [...prev, ...data]);
    setOffset((prev) => prev + limit);
    setLoading(false);
  }, [id, offset, loading]);

  useEffect(() => {
    fetchCourseName();
    fetchReviews();
  }, [fetchCourseName, fetchReviews]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastReviewRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) fetchReviews();
      });

      if (node) observer.current.observe(node);
    },
    [loading, fetchReviews]
  );

  const likeReview = async (reviewId: number) => {
    const res = await fetch(`/api/reviews/${reviewId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.success) {
      setReviews((prev) =>
        prev.map((r) =>
          r.review_id === reviewId
            ? { ...r, like_count: data.action === "liked" ? r.like_count + 1 : r.like_count - 1 }
            : r
        )
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{courseName || "Loading..."}</h1>
      <h2 className="text-2xl font-bold mb-4">Course Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={review.review_id}
            ref={index === reviews.length - 1 ? lastReviewRef : null}
            className="p-4 border border-white-700 rounded-lg shadow-md"
          >
            <p className="font-semibold">{review.username}</p>
            <p className="text-gray-300">{review.comment_text}</p>
            <div className="mt-2 text-sm text-gray-400">
              <p>📖 Content Interest: {review.content_interest}/5</p>
              <p>🎤 Teaching: {review.teaching}/5</p>
              <p>📜 Grading Criteria: {review.grading_criteria}/5</p>
            </div>
            <button
              onClick={() => likeReview(review.review_id)}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              👍 {review.like_count}
            </button>
          </div>
        ))}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
      </div>
      <BackButton />
    </div>
  );
}
