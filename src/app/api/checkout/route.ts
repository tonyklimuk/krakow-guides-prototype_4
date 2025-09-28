import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { guideId } = await request.json()

    if (!guideId) {
      return NextResponse.json({ error: "Guide ID is required" }, { status: 400 })
    }

    // Get guide details
    const guide = await prisma.guide.findUnique({
      where: { id: guideId }
    })

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 })
    }

    // Check if user already purchased this guide
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_guideId: {
          userId: session.user.id,
          guideId: guideId
        }
      }
    })

    if (existingPurchase) {
      return NextResponse.json({ error: "Guide already purchased" }, { status: 400 })
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: guide.title,
              description: guide.description,
              images: [guide.coverImage],
            },
            unit_amount: guide.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/?canceled=true`,
      metadata: {
        userId: session.user.id,
        guideId: guideId,
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
