'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header({
  user,
  onLogout,
}: {
  user?: any
  onLogout?: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8d7ca] bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold uppercase tracking-[0.08em] text-[#7b1d2f]">
          Project Playground
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex text-base font-semibold text-[#5b1220]">
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/">Home</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/playground">Playground</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/tictactoe">Tic Tac Toe</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/about">About</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/contact">Contact</Link>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <Link
              href="/login"
              className="rounded-full bg-[#7b1d2f] px-5 py-2.5 text-base font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-[#931f38]"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/admin"
                className="rounded-full bg-[#fff7ed] px-5 py-2.5 text-base font-semibold text-[#7b1d2f] ring-1 ring-[#e6c7b8] transition-colors duration-200 hover:bg-[#f8e7dc]"
              >
                Dashboard
              </Link>

              <button
                onClick={onLogout}
                className="rounded-full bg-[#b33a4f] px-5 py-2.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#922a3c]"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile button */}
        <button
          aria-label="Toggle navigation"
          className="md:hidden rounded-full border border-[#e8d7ca] bg-white px-4 py-2 text-lg text-[#7b1d2f] shadow-sm transition-colors duration-200 hover:bg-[#f8f1ed]"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#e8d7ca] bg-white px-5 py-4 space-y-3 text-base">
          <Link href="/" className="block rounded-2xl px-4 py-3 font-semibold text-[#5b1220] transition-colors duration-200 hover:bg-[#f8e7dc]">Home</Link>
          <Link href="/playground" className="block rounded-2xl px-4 py-3 font-semibold text-[#5b1220] transition-colors duration-200 hover:bg-[#f8e7dc]">Playground</Link>
          <Link href="/tictactoe" className="block rounded-2xl px-4 py-3 font-semibold text-[#5b1220] transition-colors duration-200 hover:bg-[#f8e7dc]">Tic Tac Toe</Link>
          <Link href="/about" className="block rounded-2xl px-4 py-3 font-semibold text-[#5b1220] transition-colors duration-200 hover:bg-[#f8e7dc]">About</Link>
          <Link href="/contact" className="block rounded-2xl px-4 py-3 font-semibold text-[#5b1220] transition-colors duration-200 hover:bg-[#f8e7dc]">Contact</Link>

          {!user ? (
            <Link
              href="/login"
              className="mt-2 block rounded-2xl bg-[#7b1d2f] px-4 py-3 text-center text-base font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-[#931f38]"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={onLogout}
              className="mt-2 w-full rounded-2xl bg-[#b33a4f] px-4 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#922a3c]"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  )
}