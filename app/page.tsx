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
    <div className="flex flex-col gap-4 p-10">
      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-black text-white p-2" onClick={handleSignup}>
        Sign Up
      </button>

      <button className="bg-blue-600 text-white p-2" onClick={handleLogin}>
        Login
      </button>
      <button className="bg-red-500 text-white p-2" onClick={handleLogout}>
        Logout
      </button>

      {user && <p>Logged in as: {user.email}</p>}

    <div className="p-10">
      <Link href="/playground" className="text-blue-600 underline">
        Go to Playground
      </Link>
    </div>
    <div className="p-4">
      <Link href="/tictactoe" className="text-blue-600 underline">
        Play Tic Tac Toe
      </Link> 
      </div>
    </div>
  )
}