import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const username = cookies().get('username')?.value;

    if (!username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch current user's password
    const [users]: any = await pool.query(
      'SELECT password FROM users WHERE username = ?', 
      [username]
    );

    if (users.length === 0) {
      return NextResponse.json({ 
        error: "User not found", 
        success: false 
      }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword, 
      users[0].password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: "Current password is incorrect", 
        success: false 
      }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE username = ?', 
      [hashedNewPassword, username]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      success: false 
    }, { status: 500 });
  }
}