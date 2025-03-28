import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  try {
    const [courses]: any = await pool.query(
      `SELECT c.course_id, c.course_name, p.professor_name,
              COALESCE(AVG((r.content_interest + r.teaching + r.grading_criteria) / 3), 0) AS avg_rating,
              COUNT(r.review_id) AS review_count
       FROM courses c
       LEFT JOIN professors p ON c.professor_id = p.professor_id
       LEFT JOIN reviews r ON c.course_id = r.course_id
       WHERE c.course_name LIKE ?
       GROUP BY c.course_id, c.course_name, p.professor_name
       ORDER BY c.course_name ASC`,
      [`%${search}%`]
    );

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
