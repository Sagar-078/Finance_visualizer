import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ 
        error: "Invalid email or password" 
    }, { status: 401 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ 
        error: "Invalid email or password" 
    }, { status: 401 });
  }

  return NextResponse.json({ message: "Login successful", userId: user._id });
}