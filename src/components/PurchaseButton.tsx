"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/stripe"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface PurchaseButtonProps {
  guideId: string
  price: number
  title: string
}

export function PurchaseButton({ guideId, price, title }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handlePurchase = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error("Stripe publishable key not configured")
      return
    }

    if (!session) {
      router.push("/auth/signin")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guideId }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await import("@stripe/stripe-js")
        const stripeInstance = await stripe.loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        )

        if (stripeInstance) {
          const { error } = await stripeInstance.redirectToCheckout({
            sessionId,
          })

          if (error) {
            console.error("Stripe error:", error)
          }
        }
      }
    } catch (error) {
      console.error("Purchase error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          Получите доступ к полному гайду
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatPrice(price)}
          </div>
          <Badge variant="secondary">Одноразовая покупка</Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Полный доступ к гайду</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Детальные маршруты</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Рекомендации местных</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Практические советы</span>
          </div>
        </div>

        <Button 
          onClick={handlePurchase} 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обработка...
            </>
          ) : (
            "Купить гайд"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Безопасная оплата через Stripe
        </p>
      </CardContent>
    </Card>
  )
}
