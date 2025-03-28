import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { course_id, comment_text, content_interest, teaching, grading_criteria } = await request.json();

    // Validate input
    if (!course_id || !comment_text || content_interest < 0 || content_interest > 5 ||
        teaching < 0 || teaching > 5 || grading_criteria < 0 || grading_criteria > 5) {
      return NextResponse.json({ error: "Invalid input values." }, { status: 400 });
    }

    // Get username from cookies
    const cookieHeader = request.headers.get("cookie");
    const cookies = new Map(cookieHeader?.split("; ").map(c => c.split("=")));
    const username = cookies.get("username");

    if (!username) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // Check if the user exists
    const [userCheck]: any = await pool.query("SELECT username FROM users WHERE username = ?", [username]);
    if (userCheck.length === 0) {
      return NextResponse.json({ error: "User does not exist." }, { status: 400 });
    }

    // Insert review into database
    await pool.query(
      `INSERT INTO reviews (username, course_id, comment_text, content_interest, teaching, grading_criteria)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, course_id, comment_text, content_interest, teaching, grading_criteria]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error posting review:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
