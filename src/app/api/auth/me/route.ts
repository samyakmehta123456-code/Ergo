import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { supabaseGetUser } from "@/lib/supabase";

export async function GET() {
  const user = await getSessionUser();
  if (user) {
    return NextResponse.json({ user });
  }

  try {
    const supabaseUser = await supabaseGetUser();
    if (supabaseUser) {
      return NextResponse.json({
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "Supabase User",
        },
      });
    }
  } catch (e) {
    console.warn("Supabase Auth check notice:", e);
  }

  return NextResponse.json({ user: null }, { status: 401 });
}
