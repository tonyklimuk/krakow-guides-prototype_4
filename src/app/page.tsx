import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/stripe"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Users, Clock } from "lucide-react"

async function GuideCard({ guide }: { guide: any }) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden">
      <div className="relative h-48">
        <Image
          src={guide.coverImage}
          alt={guide.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-4 right-4 bg-white/90 text-black">
          {formatPrice(guide.price)}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{guide.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {guide.description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/guide/${guide.slug}`}>
            Купить гайд
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

async function GuidesSection() {
  const guides = await prisma.guide.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Наши гайды</h2>
          <p className="text-muted-foreground text-lg">
            Персонализированные маршруты для незабываемого отдыха в Кракове
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            City Guides Kraków
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Теперь ваш отдых в Кракове будет максимально интересным и персонализированным
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Личный кабинет</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/auth/signin">Войти</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/signup">Регистрация</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Почему выбирают нас?</h2>
            <p className="text-muted-foreground text-lg">
              Мы создаем уникальные маршруты, основанные на местных знаниях
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Уникальные маршруты</h3>
              <p className="text-sm text-muted-foreground">
                Только проверенные места, которые знают местные жители
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Высокое качество</h3>
              <p className="text-sm text-muted-foreground">
                Детальные описания и рекомендации от экспертов
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Персонализация</h3>
              <p className="text-sm text-muted-foreground">
                Маршруты под ваши интересы и предпочтения
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Экономия времени</h3>
              <p className="text-sm text-muted-foreground">
                Готовые планы без необходимости планирования
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <Suspense fallback={<div className="py-16 text-center">Загрузка гайдов...</div>}>
        <GuidesSection />
      </Suspense>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы начать приключение?</h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к тысячам путешественников, которые уже открыли для себя Краков
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="#guides">Посмотреть гайды</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
