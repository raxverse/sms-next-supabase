'use client'

import Link from 'next/link'
import { useState } from 'react'
import Sidebar from './Sidebar';

export default function Header({
  user,
  onLogout,
}: {
  user?: any
  onLogout?: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8d7ca] bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-2 py-2 sm:px-4 md:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold uppercase tracking-[0.08em] text-[#7b1d2f]">
          Project Playground
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex text-base font-semibold text-[#5b1220]">
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/">Home</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/contact">Contact</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/about">About</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/practice">Practice</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/playground">Playground</Link>
          <Link className="transition-colors duration-200 hover:text-[#7b1d2f]" href="/tictactoe">Tic Tac Toe</Link>
        </nav>

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
        <Sidebar/>
        )
      }
    </header>
  )
}