import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/stripe"
import { PurchaseButton } from "@/components/PurchaseButton"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Clock, Users, Star } from "lucide-react"

interface GuidePageProps {
  params: {
    slug: string
  }
}

async function GuideContent({ guide }: { guide: any }) {
  const hasAccess = true // For MVP, we'll show content to everyone

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Доступ ограничен</CardTitle>
          <CardDescription>
            Для просмотра этого гайда необходимо его приобрести
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Этот гайд содержит эксклюзивный контент
            </p>
            <Button asChild>
              <Link href="/">Купить гайд</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, '<br>') }} />
    </div>
  )
}

export default async function GuidePage({ params }: GuidePageProps) {
  const session = await getServerSession(authOptions)
  
  const guide = await prisma.guide.findUnique({
    where: { slug: params.slug }
  })

  if (!guide) {
    redirect("/")
  }

  // Check if user has purchased this guide
  let hasAccess = false
  if (session?.user?.id) {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_guideId: {
          userId: session.user.id,
          guideId: guide.id
        }
      }
    })
    hasAccess = purchase?.status === "completed"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </Link>
              </Button>
              <Link href="/" className="text-xl font-bold text-blue-600">
                City Guides Kraków
              </Link>
            </div>
            {session ? (
              <Button variant="outline" asChild>
                <Link href="/dashboard">Личный кабинет</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">Войти</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-blue-600 text-white">
                {formatPrice(guide.price)}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {guide.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {guide.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Краков, Польша
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  3 дня
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Для всех
                </div>
              </div>
            </div>
            <div className="relative h-80 lg:h-96">
              <Image
                src={guide.coverImage}
                alt={guide.title}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasAccess ? (
          <GuideContent guide={guide} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Доступ ограничен</CardTitle>
                  <CardDescription>
                    Для просмотра этого гайда необходимо его приобрести
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Этот гайд содержит эксклюзивный контент с детальными маршрутами, 
                      рекомендациями местных жителей и практическими советами
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <PurchaseButton 
                guideId={guide.id}
                price={guide.price}
                title={guide.title}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
