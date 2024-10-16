import axiosInstance from "@/lib/axiosInstance";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const username_searched = searchParams.get("username");

  try {
    const findUserQuery = `
      SELECT * FROM users WHERE username ILIKE $1;
    `;

    const result = await pool.query(findUserQuery, [username_searched]);

    if (result.rows.length === 0) {
      const user = await axiosInstance.get(
        `https://api.sleeper.app/v1/user/${username_searched}`
      );

      const user_id = user.data.user_id;
      const display_name = user.data.display_name;
      const avatar = user.data.avatar || null;

      const insertQuery = `
        INSERT INTO users (user_id, username, avatar, type, createdat, updatedat) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const values = [
        user_id,
        display_name,
        avatar,
        "S",
        new Date(),
        new Date(),
      ];

      const result = await pool.query(insertQuery, values);

      return NextResponse.json(result.rows[0], { status: 200 });
    } else {
      return NextResponse.json(result.rows[0], { status: 200 });
    }
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json("Username not found", { status: 404 });
  }
}
