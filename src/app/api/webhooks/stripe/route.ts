import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Create purchase record
      await prisma.purchase.create({
        data: {
          userId: session.metadata!.userId,
          guideId: session.metadata!.guideId,
          stripePaymentId: session.payment_intent as string,
          status: "completed",
          amount: session.amount_total!,
          currency: session.currency!,
        },
      })

      console.log("Purchase created successfully:", {
        userId: session.metadata!.userId,
        guideId: session.metadata!.guideId,
      })
    } catch (error) {
      console.error("Error creating purchase:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
