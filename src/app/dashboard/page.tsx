import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { LogOut, User, BookOpen, Calendar } from "lucide-react"
import { formatPrice } from "@/lib/stripe"

async function UserPurchases({ userId }: { userId: string }) {
  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
      status: "completed"
    },
    include: {
      guide: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  if (purchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Мои гайды
          </CardTitle>
          <CardDescription>
            Здесь будут отображаться купленные вами гайды
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              У вас пока нет купленных гайдов
            </p>
            <Button asChild>
              <Link href="/">Посмотреть гайды</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Мои гайды ({purchases.length})
        </CardTitle>
        <CardDescription>
          Гайды, к которым у вас есть доступ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{purchase.guide.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Куплен {new Date(purchase.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {formatPrice(purchase.amount)}
                </Badge>
                <Button asChild size="sm">
                  <Link href={`/guide/${purchase.guide.slug}`}>
                    Открыть
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              City Guides Kraków
            </Link>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{user.name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Все гайды
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <form action="/api/auth/signout" method="post" className="w-full">
                      <button type="submit" className="flex items-center gap-2 w-full text-left">
                        <LogOut className="h-4 w-4" />
                        Выйти
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {user.name || "путешественник"}!</h1>
          <p className="text-muted-foreground">
            Здесь вы можете управлять своими гайдами и настройками аккаунта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Информация о профиле
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="text-lg">
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name || "Без имени"}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Регистрация: {new Date(user.createdAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchases */}
          <div className="lg:col-span-2">
            <UserPurchases userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
