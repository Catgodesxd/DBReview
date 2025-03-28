import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ message: 'Missing username or password' }, { status: 400 });
    }

    // Check if user exists
    const [existingUsers]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user and get inserted ID
    const [result]: any = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    const userId = result.insertId;

    // Generate a token 
    const token = `user_${userId}_${Date.now()}`;

    // Create response and set cookies
    const response = NextResponse.json({ message: 'User registered successfully', userId }, { status: 201 });

    response.cookies.set('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    });

    response.cookies.set('username', username, { 
      httpOnly: false, // Client-readable
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}