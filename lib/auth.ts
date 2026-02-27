// Simple cookie-based auth for the Veridex platform
import { cookies } from "next/headers"
import { db } from "./db"

const SESSION_COOKIE = "veridex_session"

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)
  if (!sessionCookie) return null
  
  try {
    const data = JSON.parse(atob(sessionCookie.value))
    const user = db.user.findById(data.userId)
    return user
  } catch {
    return null
  }
}

export function createSessionToken(userId: string): string {
  return btoa(JSON.stringify({ userId, ts: Date.now() }))
}

export { SESSION_COOKIE }
