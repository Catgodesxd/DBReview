import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Professor ID is required" }, { status: 400 });

  try {
    const [[professor]] = await pool.query(
      `SELECT professor_id, professor_name, professor_email FROM professors WHERE professor_id = ?`, 
      [id]
    );
    if (!professor) return NextResponse.json({ error: "Professor not found" }, { status: 404 });

    const [labs] = await pool.query(
      `SELECT l.lab_id, l.lab_name, l.lab_description 
       FROM lab l JOIN lab_professors lp ON l.lab_id = lp.lab_id 
       WHERE lp.professor_id = ?`,
      [id]
    );

    const [research] = await pool.query(
      `SELECT r.research_id, r.research_name, r.cited_amount 
       FROM research r JOIN research_professors rp ON r.research_id = rp.research_id 
       WHERE rp.professor_id = ?`,
      [id]
    );

    return NextResponse.json({ ...professor, labs, research });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
