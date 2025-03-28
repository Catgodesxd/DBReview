import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { newUsername } = await request.json();
    const currentUsername = cookies().get('username')?.value;

    if (!currentUsername) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if new username already exists
    const [existingUsers]: any = await pool.query(
      'SELECT * FROM users WHERE username = ?', 
      [newUsername]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ 
        error: "Username already exists", 
        success: false 
      }, { status: 400 });
    }

    // Update username in all relevant tables
    await pool.query(
      `UPDATE users SET username = ? WHERE username = ?`, 
      [newUsername, currentUsername]
    );

    await pool.query(
      `UPDATE reviews SET username = ? WHERE username = ?`, 
      [newUsername, currentUsername]
    );

    await pool.query(
      `UPDATE activity_log SET username = ? WHERE username = ?`, 
      [newUsername, currentUsername]
    );

    await pool.query(
      `UPDATE likes SET username = ? WHERE username = ?`, 
      [newUsername, currentUsername]
    );

    // Update username cookie
    cookies().set('username', newUsername, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production' 
    });

    return NextResponse.json({ 
      success: true, 
      message: "Username updated successfully" 
    });

  } catch (error) {
    console.error("Username change error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      success: false 
    }, { status: 500 });
  }
}