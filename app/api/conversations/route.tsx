import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { image } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!image) {
      return new NextResponse("Image are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    if (!isPro) {
      await increaseApiLimit();
    }
    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    console.log("[CONVERSATION_ERROR] ", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
