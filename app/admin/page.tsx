'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (!sessionUser) {
        router.push('/')
        return
      }

      setUser(sessionUser)
    }

    loadSession()
  }, [router])

  const handleLogout = async () => {
    setErrorMessage('')
    setStatusMessage('')

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      setErrorMessage(error.message)
      return
    }

    setStatusMessage('Logged out successfully.')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#f8f1e7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_20px_80px_rgba(88,28,39,0.18)] backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#7b1d2f] via-[#8f2438] to-[#5b1220] px-4 py-6 text-white sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ffe8d1]/90">
              Admin area
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#ffe8d1]/90 sm:text-base">
              This page uses your Supabase session to show current user information.
            </p>
          </div>

          <div className="space-y-4 px-4 py-6 sm:px-8 sm:py-10">
            {user ? (
              <div className="rounded-[1.75rem] bg-[#fff7ed] p-6 shadow-sm ring-1 ring-slate-200/70">
                <h2 className="text-lg font-semibold text-[#7b1d2f]">Signed in as</h2>
                <p className="mt-2 text-sm text-[#33403f]">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="mt-1 text-sm text-[#33403f]">
                  <strong>User ID:</strong> {user.id}
                </p>
                <p className="mt-1 text-sm text-[#33403f]">
                  <strong>Last sign in:</strong> {user.last_sign_in_at ?? 'n/a'}
                </p>
              </div>
            ) : (
              <div className="rounded-[1.75rem] bg-[#fff7ed] p-6 shadow-sm ring-1 ring-slate-200/70">
                <p className="text-sm text-[#33403f]">Loading admin session...</p>
              </div>
            )}

            <button
              className="rounded-2xl bg-[#b33a4f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b33a4f]/20 transition hover:bg-[#922a3c]"
              onClick={handleLogout}
            >
              Logout
            </button>

            {errorMessage ? (
              <div className="rounded-2xl bg-[#ffe3e3] px-4 py-4 text-sm text-[#821717] ring-1 ring-[#f0b2b2]/80">
                {errorMessage}
              </div>
            ) : null}

            {statusMessage ? (
              <div className="rounded-2xl bg-[#f5f7f2] px-4 py-4 text-sm text-[#33403f] ring-1 ring-[#d6dfda]/80">
                {statusMessage}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-2xl bg-[#7b1d2f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7b1d2f]/20 transition hover:bg-[#931f38]"
                onClick={() => router.push('/')}
              >
                Back to Home
              </button>
              <button
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#7b1d2f] shadow-sm transition hover:bg-[#f8e7dc]/95"
                onClick={() => router.push('/playground')}
              >
                Go to Playground
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}