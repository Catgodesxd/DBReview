import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const labId = Number(params.id); // Ensure ID is a number
  if (isNaN(labId)) return NextResponse.json({ error: "Invalid Lab ID" }, { status: 400 });

  try {
    const [labData]: any = await pool.query(
      `SELECT l.lab_id, l.lab_name, l.lab_description, 
              GROUP_CONCAT(p.professor_name SEPARATOR ', ') AS professors
       FROM lab l
       LEFT JOIN lab_professors lp ON l.lab_id = lp.lab_id
       LEFT JOIN professors p ON lp.professor_id = p.professor_id
       WHERE l.lab_id = ?
       GROUP BY l.lab_id, l.lab_name, l.lab_description`,
      [labId]
    );

    if (!Array.isArray(labData) || labData.length === 0) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json(labData[0]);
  } catch (error) {
    console.error("Lab API Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
