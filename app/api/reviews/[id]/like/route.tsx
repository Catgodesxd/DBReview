import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const reviewId = Number(params.id);

  // Get username from cookie
  const cookieStore = cookies();
  const username = cookieStore.get("username")?.value;

  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if user already liked the review
    const [existingLikes]: any = await pool.query(
      "SELECT * FROM likes WHERE review_id = ? AND username = ?",
      [reviewId, username]
    );

    if (existingLikes.length > 0) {
      // Unlike (DELETE) if already liked
      await pool.query("DELETE FROM likes WHERE review_id = ? AND username = ?", [
        reviewId,
        username,
      ]);
      return NextResponse.json({ success: true, action: "unliked" });
    } else {
      // Like (INSERT) if not already liked
      await pool.query("INSERT INTO likes (review_id, username) VALUES (?, ?)", [
        reviewId,
        username,
      ]);
      return NextResponse.json({ success: true, action: "liked" });
    }
  } catch (error) {
    console.error("Error liking/unliking review:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
