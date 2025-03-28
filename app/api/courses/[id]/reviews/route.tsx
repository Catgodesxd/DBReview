import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const courseId = Number(params.id);
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 10;
  const offset = Number(url.searchParams.get("offset")) || 0;

  if (isNaN(courseId)) return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });

  try {
    const [reviews]: any = await pool.query(
      `SELECT r.review_id, r.username, r.comment_text, r.content_interest, r.teaching, r.grading_criteria, 
              COALESCE(COUNT(l.username), 0) AS like_count
       FROM reviews r
       LEFT JOIN likes l ON r.review_id = l.review_id
       WHERE r.course_id = ?
       GROUP BY r.review_id
       ORDER BY r.review_id DESC
       LIMIT ? OFFSET ?`,
      [courseId, limit, offset]
    );

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
