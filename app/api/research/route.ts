import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  try {
    const [research]: any = await pool.query(
      `SELECT 
         research_id, 
         research_name, 
         cited_amount
       FROM research
       WHERE research_name LIKE ?
       ORDER BY research_name ASC`,
      [`%${search}%`]
    );

    return NextResponse.json(research);
  } catch (error) {
    console.error("Error fetching research:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
