// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { Transaction } from "@/models/Transection";

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   await connectDB();

//   try {
//     await Transaction.findByIdAndDelete(params.id);
//     return NextResponse.json({ message: "Deleted" }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   await connectDB();
//   const body = await req.json();

//   try {
//     const updated = await Transaction.findByIdAndUpdate(params.id, body, {
//       new: true,
//     });
//     return NextResponse.json(updated, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Transaction } from "@/models/Transection";

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const id = req.nextUrl.pathname.split("/").pop(); // ✅ safely extract ID
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  try {
    const id = req.nextUrl.pathname.split("/").pop(); // ✅ safely extract ID
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await Transaction.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}