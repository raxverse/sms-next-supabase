'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import LoginDrawer from '@/components/auth/LoginDrawer'
import { useAuth } from '@/app/providers/AuthProvider'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { user, profile, authUser, isAuthenticated, logout, hasRole } = useAuth()

  // Get user role display name
  const getRoleDisplayName = () => {
    if (!authUser?.roles?.length) return 'User'
    const role = authUser.roles[0]
    const roleNames: Record<string, string> = {
      superadmin: 'Super Admin',
      schooladmin: 'School Admin',
      teacher: 'Teacher',
      classteacher: 'Class Teacher',
      student: 'Student',
      parent: 'Parent'
    }
    return roleNames[role] || role
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!profile?.first_name && !profile?.last_name) {
      return user?.email?.charAt(0).toUpperCase() || 'U'
    }
    return `${profile?.first_name?.charAt(0) || ''}${profile?.last_name?.charAt(0) || ''}`.toUpperCase()
  }

  // Handle logout
  const handleLogout = async () => {
    await logout()
    setProfileDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [profileDropdownOpen])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e8d7ca] bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#7b1d2f] to-[#931f38] text-white font-bold text-sm">
              SMS
            </div>
            <span className="hidden sm:block text-xl font-bold tracking-tight text-[#7b1d2f]">
              SchoolMS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 lg:flex text-sm font-medium text-[#5b1220]">
            <Link className="transition-colors hover:text-[#7b1d2f]" href="/">Home</Link>
            <Link className="transition-colors hover:text-[#7b1d2f]" href="/about">About</Link>
            <Link className="transition-colors hover:text-[#7b1d2f]" href="/contact">Contact</Link>
          </nav>

          {/* Right Side - Auth Aware */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Dashboard Button */}
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#931f38]"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setProfileDropdownOpen(!profileDropdownOpen)
                    }}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-3 py-1 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7b1d2f] to-[#931f38] text-white text-xs font-bold">
                      {getInitials()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-slate-900 leading-tight">
                        {profile?.first_name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        {getRoleDisplayName()}
                      </p>
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {/* Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-lg z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{profile?.first_name} {profile?.last_name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors sm:hidden"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <button
                  onClick={() => setLoginDrawerOpen(true)}
                  className="hidden sm:flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#931f38]"
                >
                  Login
                </button>
                <button
                  onClick={() => setLoginDrawerOpen(true)}
                  className="sm:hidden flex items-center justify-center h-9 w-9 rounded-lg bg-[#7b1d2f] text-white"
                >
                  <User size={18} />
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle navigation"
              className="lg:hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white py-4 px-4">
            <nav className="space-y-1">
              <Link
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                href="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Login Drawer */}
      <LoginDrawer isOpen={loginDrawerOpen} onClose={() => setLoginDrawerOpen(false)} />
    </>
  )
}
