import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const courseId = Number(params.id);

  if (isNaN(courseId)) return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });

  try {
    const [courses]: any = await pool.query(
      "SELECT course_name FROM courses WHERE course_id = ?",
      [courseId]
    );

    if (courses.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(courses[0]);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
