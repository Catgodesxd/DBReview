"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function CoursePage() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `/api/courses?search=${encodeURIComponent(search)}`
        );
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [search]);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Search Courses</h1>

      <input
        type="text"
        placeholder="Search for a course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      <div style={listStyle}>
        {courses.length > 0 ? (
          courses.map((course: any) => (
            <div key={course.course_id} style={courseItemStyle}>
              <h3>
                <Link href={`/courses/${course.course_id}`} passHref>
                  <span style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }}>
                    {course.course_name}
                  </span>
                </Link>
              </h3>
              <p>Professor: {course.professor_name || "Unknown"}</p>
              <p>
                ⭐ {parseFloat(course.avg_rating).toFixed(1)} / 5 (
                {course.review_count} reviews)
              </p>
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>

      <BackButton /> {/* ✅ Add Floating Back Button */}
    </div>
  );
}

// Styles
const containerStyle = { maxWidth: "600px", margin: "auto", textAlign: "center", padding: "20px" };
const titleStyle = { fontSize: "24px", marginBottom: "20px" };
const searchStyle = { width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" };
const listStyle = { marginTop: "20px" };
const courseItemStyle = { padding: "10px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "10px" };
