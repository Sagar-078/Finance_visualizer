import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ 
        error: "User already exists" 
    }, { status: 400 });
  }

  const user = new User({ email, password });
  await user.save();

  return NextResponse.json({ message: "Registered successfully" });
}