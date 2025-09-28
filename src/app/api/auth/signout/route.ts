import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // In a real app, you might want to invalidate the session here
  // For now, we'll just return success
  return NextResponse.json({ message: "Signed out successfully" })
}
