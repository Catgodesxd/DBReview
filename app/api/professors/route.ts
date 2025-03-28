import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  try {
    const [professors]: any = await pool.query(
      `SELECT 
         p.professor_id, 
         p.professor_name, 
         p.professor_email,
         COALESCE(AVG(r.teaching), 0) AS rating
       FROM professors p
       LEFT JOIN courses c ON p.professor_id = c.professor_id
       LEFT JOIN reviews r ON c.course_id = r.course_id
       WHERE p.professor_name LIKE ? 
       GROUP BY p.professor_id
       ORDER BY p.professor_name ASC`,
      [`%${search}%`]
    );

    return NextResponse.json(professors);
  } catch (error) {
    console.error("Error fetching professors:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
