import { connectDB } from "@/lib/db";
import { Transaction } from "@/models/Transection";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { amount, date, description, category, email } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }


    const transaction = await Transaction.create({
      amount,
      date,
      description,
      category,
      userId: user._id,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const transactions = await Transaction.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}