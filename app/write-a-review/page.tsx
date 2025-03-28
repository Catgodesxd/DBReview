'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function PostReviewPage() {
  const [courses, setCourses] = useState<{ course_id: number; course_name: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [comment, setComment] = useState("");
  const [contentInterest, setContentInterest] = useState(0);
  const [teaching, setTeaching] = useState(0);
  const [gradingCriteria, setGradingCriteria] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
    }
    fetchCourses();
  }, []);

  const submitReview = async () => {
    if (!selectedCourse || !comment) {
      alert("Please select a course and enter a review.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_id: selectedCourse,
        comment_text: comment,
        content_interest: contentInterest,
        teaching,
        grading_criteria: gradingCriteria,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Review posted successfully!");
      router.push(`/courses/${selectedCourse}`);
    } else {
      alert("Failed to post review.");
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Post a Course Review</h1>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Course</label>
        <select 
          value={selectedCourse} 
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={selectStyle}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Review Comment</label>
        <textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          style={textareaStyle}
          placeholder="Share your detailed course experience..."
        />
      </div>

      <div style={ratingContainerStyle}>
        <div style={ratingGroupStyle}>
          <label style={ratingLabelStyle}>Content Interest</label>
          <input 
            type="range" 
            min="0" 
            max="5" 
            value={contentInterest} 
            onChange={(e) => setContentInterest(Number(e.target.value))}
            style={rangeStyle}
          />
          <span style={ratingValueStyle}>{contentInterest}</span>
        </div>

        <div style={ratingGroupStyle}>
          <label style={ratingLabelStyle}>Teaching Quality</label>
          <input 
            type="range" 
            min="0" 
            max="5" 
            value={teaching} 
            onChange={(e) => setTeaching(Number(e.target.value))}
            style={rangeStyle}
          />
          <span style={ratingValueStyle}>{teaching}</span>
        </div>

        <div style={ratingGroupStyle}>
          <label style={ratingLabelStyle}>Grading Criteria</label>
          <input 
            type="range" 
            min="0" 
            max="5" 
            value={gradingCriteria} 
            onChange={(e) => setGradingCriteria(Number(e.target.value))}
            style={rangeStyle}
          />
          <span style={ratingValueStyle}>{gradingCriteria}</span>
        </div>
      </div>

      <button 
        onClick={submitReview} 
        disabled={loading}
        style={submitButtonStyle}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      <BackButton />
    </div>
  );
}

// Styles
const containerStyle = { 
  maxWidth: '600px', 
  margin: 'auto', 
  textAlign: 'center', 
  padding: '20px' 
};

const titleStyle = { 
  fontSize: '24px', 
  marginBottom: '20px' 
};

const formGroupStyle = { 
  marginBottom: '20px', 
  textAlign: 'left' 
};

const labelStyle = { 
  display: 'block', 
  marginBottom: '8px', 
  fontSize: '16px' 
};

const selectStyle = { 
  width: '100%', 
  padding: '10px', 
  fontSize: '16px', 
  borderRadius: '5px', 
  border: '1px solid white', 
  color: 'gray',
  backgroundColor: 'black',
  appearance: 'none',
};

const textareaStyle = { 
  width: '100%', 
  padding: '10px', 
  fontSize: '16px', 
  borderRadius: '5px', 
  border: '1px solid #ccc', 
  minHeight: '120px' 
};

const ratingContainerStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '15px', 
  marginBottom: '20px' 
};

const ratingGroupStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px' 
};

const ratingLabelStyle = { 
  flex: '1', 
  textAlign: 'left' 
};

const rangeStyle = { 
  flex: '2' 
};

const ratingValueStyle = { 
  width: '30px', 
  textAlign: 'center' 
};

const submitButtonStyle = { 
  width: '100%', 
  padding: '12px', 
  fontSize: '16px', 
  backgroundColor: '#007bff', 
  color: 'white', 
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer' 
};