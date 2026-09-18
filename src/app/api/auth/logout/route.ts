import { NextResponse } from "next/server";
import { supabaseSignOut } from "@/lib/supabase";

export async function POST() {
  try {
    await supabaseSignOut();
  } catch (e) {
    console.warn("Supabase Auth logout notice:", e);
  }

  const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
