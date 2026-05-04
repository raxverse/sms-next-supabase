'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<any>(null)

  // 🔹 Check session on load
useEffect(() => {
  // Get initial session
  const getSession = async () => {
    const { data } = await supabase.auth.getSession()
    setUser(data.session?.user ?? null)
  }

  getSession()

  // 🔥 Listen to auth changes (THIS makes it real-time)
  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth event:', event)
      setUser(session?.user ?? null)
    }
  )

  return () => {
    listener.subscription.unsubscribe()
  }
}, [])

  // 🔹 Signup
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('Signup error:', error.message)
    } else {
      console.log('User created:', data)
    }
  }

  // 🔹 Login
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
    } else {
      console.log('Logged in:', data)
      setUser(data.user)
    }
  }

  // 🔹 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <main className="min-h-screen bg-[#f8f1e7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_20px_80px_rgba(88,28,39,0.18)] backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#7b1d2f] via-[#8f2438] to-[#5b1220] px-6 py-10 text-white sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ffe8d1]/90">
              Welcome back
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Project Next.js and Supabase with lots of activities
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#ffe8d1]/90 sm:text-base">
              Login or create an account to explore the app, then jump into the playground and Tic Tac Toe game with a cohesive, elegant theme.
            </p>
          </div>

          <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10">
            <div className="rounded-[1.75rem] bg-[#fff7ed] p-5 shadow-sm ring-1 ring-slate-200/70">
              <label className="block text-sm font-semibold text-[#6f2736]">Email</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[#d9b9b0] bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-[#7b1d2f] focus:ring-2 focus:ring-[#7b1d2f]/10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="rounded-[1.75rem] bg-[#fff7ed] p-5 shadow-sm ring-1 ring-slate-200/70">
              <label className="block text-sm font-semibold text-[#6f2736]">Password</label>
              <input
                className="mt-2 w-full rounded-2xl border border-[#d9b9b0] bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-[#7b1d2f] focus:ring-2 focus:ring-[#7b1d2f]/10"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                className="rounded-2xl bg-[#7b1d2f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7b1d2f]/20 transition hover:bg-[#931f38]"
                onClick={handleSignup}
              >
                Sign Up
              </button>
              <button
                className="rounded-2xl bg-[#b33a4f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b33a4f]/20 transition hover:bg-[#922a3c]"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="rounded-2xl bg-[#e6bfa8] px-5 py-3 text-sm font-semibold text-[#5d121f] shadow-lg shadow-[#ad7b6c]/20 transition hover:bg-[#f2d2c2]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

            {user && (
              <div className="rounded-2xl bg-[#faf1e8] px-4 py-4 text-sm text-[#5b1727] ring-1 ring-[#d9b9b0]/80">
                Logged in as <span className="font-semibold">{user.email}</span>
              </div>
            )}

            <div className="grid gap-3 rounded-[1.75rem] bg-[#fff7ed] p-5 shadow-sm ring-1 ring-slate-200/70">
              <Link href="/playground" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-[#7b1d2f] shadow-sm transition hover:bg-[#f8e7dc]/95">
                Go to Playground
              </Link>
              <Link href="/tictactoe" className="rounded-2xl bg-[#7b1d2f] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#931f38]">
                Play Tic Tac Toe
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}