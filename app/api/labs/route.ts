import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  try {
    const [labs]: any = await pool.query(
      `SELECT l.lab_id, l.lab_name, l.lab_description, 
              JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'professor_id', p.professor_id,
                      'professor_name', p.professor_name,
                      'professor_email', p.professor_email
                  )
              ) AS professors
       FROM lab l
       LEFT JOIN lab_professors lp ON l.lab_id = lp.lab_id
       LEFT JOIN professors p ON lp.professor_id = p.professor_id
       WHERE l.lab_name LIKE ? 
       GROUP BY l.lab_id
       ORDER BY l.lab_name ASC`,
      [`%${search}%`]
    );

    return NextResponse.json(labs);
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
