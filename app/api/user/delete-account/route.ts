import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function DELETE() {
  try {
    const username = cookies().get('username')?.value;

    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user from users table (cascading deletes will handle other tables)
    await pool.query('DELETE FROM users WHERE username = ?', [username]);

    // Clear cookies
    cookies().delete('token');
    cookies().delete('username');

    return NextResponse.json({ 
      success: true, 
      message: "Account deleted successfully" 
    });

  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      success: false 
    }, { status: 500 });
  }
}