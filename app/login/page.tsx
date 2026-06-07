// app/page.tsx
'use client'

import Link from 'next/link'
import { useAuthLogic } from '../hooks/useAuthLogic' // Apna hook import karein

export default function Home() {
  // Hook se saara logic aur state bahar nikal lein
  const {
    email, setEmail,
    password, setPassword,
    user,
    statusMessage, setStatusMessage,
    errorMessage, setErrorMessage,
    lastEmail,
    mode, setMode,
    handleSignup,
    handleLogin,
    handleLogout
  } = useAuthLogic()

  return (
    <main className="min-h-screen bg-[#f8f1e7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_20px_80px_rgba(88,28,39,0.18)] backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#7b1d2f] via-[#8f2438] to-[#5b1220] px-4 py-6 text-white sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ffe8d1]/90">
              Welcome back
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Project Playground
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#ffe8d1]/90 sm:text-base">
              Login or create an account to explore the app, then jump into the playground and Tic Tac Toe game to enjoy!.
            </p>
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-8 sm:py-10">
            {user ? (
              <div className="grid gap-3 rounded-[1.75rem] bg-[#fff7ed] p-4 shadow-sm ring-1 ring-slate-200/70">
                <Link href="/admin" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-[#7b1d2f] shadow-sm transition hover:bg-[#f8e7dc]/95">
                  Go to Admin Dashboard
                </Link>
              </div>
            ) : null}

            {mode === 'choice' && !user ? (
              <div className="space-y-4">
                <p className="text-center text-lg font-semibold text-[#6f2736]">
                  Are you an existing user?
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="rounded-2xl bg-[#7b1d2f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7b1d2f]/20 transition hover:bg-[#931f38]"
                    onClick={() => {
                      setMode('login')
                      setEmail('')
                      setPassword('')
                      setErrorMessage('')
                      setStatusMessage('')
                    }}
                  >
                    Yes, I have an account (Login)
                  </button>
                  <button
                    className="rounded-2xl bg-[#b33a4f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b33a4f]/20 transition hover:bg-[#922a3c]"
                    onClick={() => {
                      setMode('signup')
                      setEmail('')
                      setPassword('')
                      setErrorMessage('')
                      setStatusMessage('')
                    }}
                  >
                    No, I need to sign up
                  </button>
                </div>
              </div>
            ) : null}

            {mode === 'login' && !user ? (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-[#6f2736]">Login to your account</h2>

                <div className="rounded-[1.75rem] bg-[#fff7ed] p-4 shadow-sm ring-1 ring-slate-200/70">
                  <label className="block text-sm font-semibold text-[#6f2736]">Email</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[#d9b9b0] bg-white px-2 py-3 text-slate-900 shadow-sm outline-none transition focus:border-[#7b1d2f] focus:ring-2 focus:ring-[#7b1d2f]/10"
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="rounded-[1.75rem] bg-[#fff7ed] p-4 shadow-sm ring-1 ring-slate-200/70">
                  <label className="block text-sm font-semibold text-[#6f2736]">Password</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[#d9b9b0] bg-white px-2 py-3 text-slate-900 shadow-sm outline-none transition focus:border-[#7b1d2f] focus:ring-2 focus:ring-[#7b1d2f]/10"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="rounded-2xl bg-[#7b1d2f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7b1d2f]/20 transition hover:bg-[#931f38]"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <button
                    className="rounded-2xl bg-[#e6bfa8] px-5 py-3 text-sm font-semibold text-[#5d121f] shadow-lg shadow-[#ad7b6c]/20 transition hover:bg-[#f2d2c2]"
                    onClick={() => setMode('choice')}
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : null}

            {mode === 'signup' && !user ? (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-[#6f2736]">Create a new account</h2>

                <div className="rounded-[1.75rem] bg-[#fff7ed] p-4 shadow-sm ring-1 ring-slate-200/70">
                  <label className="block text-sm font-semibold text-[#6f2736]">Email</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[#d9b9b0] bg-white px-2 py-3 text-slate-900 shadow-sm outline-none transition focus:border-[#7b1d2f] focus:ring-2 focus:ring-[#7b1d2f]/10"
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="rounded-[1.75rem] bg-[#fff7ed] p-4 shadow-sm ring-1 ring-slate-200/70">
                  <label className="block text-sm font-semibold text-[#6f2736]">Password</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-[#d9b9b0] bg-white px-2 py-3 text-slate-900 shadow-sm outline-none transition focus:border-[#7b1d2f] focus:ring-2 focus:ring-[#7b1d2f]/10"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="rounded-2xl bg-[#b33a4f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b33a4f]/20 transition hover:bg-[#922a3c]"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </button>
                  <button
                    className="rounded-2xl bg-[#e6bfa8] px-5 py-3 text-sm font-semibold text-[#5d121f] shadow-lg shadow-[#ad7b6c]/20 transition hover:bg-[#f2d2c2]"
                    onClick={() => setMode('choice')}
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl bg-[#ffe3e3] px-4 py-4 text-sm text-[#821717] ring-1 ring-[#f0b2b2]/80">
                {errorMessage}
              </div>
            ) : null}

            <div className="rounded-2xl bg-[#f5f7f2] px-4 py-4 text-sm text-[#33403f] ring-1 ring-[#d6dfda]/80">
              {statusMessage
                ? statusMessage
                : user
                ? `Logged in as ${user.email}`
                : lastEmail
                ? `Logged out from ${lastEmail}`
                : 'Not signed in yet.'}
            </div>

            {user && (
              <button
                className="w-full rounded-2xl bg-[#e6bfa8] px-5 py-3 text-sm font-semibold text-[#5d121f] shadow-lg shadow-[#ad7b6c]/20 transition hover:bg-[#f2d2c2]"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}