import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export function useAuthLogic() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [mobile, setMobile] = useState('')
  const [role, setRole] = useState('Parent')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<any>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [lastEmail, setLastEmail] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const router = useRouter()

  // 🔹 Check session on load
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLastEmail(data.session?.user?.email ?? '')
    }

    getSession()

    // 🔥 Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event)
        setUser(session?.user ?? null)
        if (session?.user?.email) {
          setLastEmail(session.user.email)
        }
      }
    )

    return () => {
      if (listener?.subscription?.unsubscribe) {
        listener.subscription.unsubscribe()
      }
    }
  }, [])

  // 🔹 Signup
  const handleSignup = async () => {
    setErrorMessage('')
    setStatusMessage('')

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    if (user) {
      setErrorMessage(`Already signed in as ${user.email}. Please log out first.`)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // Yahan database trigger ke liye default meta_data bhej rahe hain
        options: {
          data: {
            first_name: firstname?.trim() || 'User',
            last_name: lastname?.trim() || 'User',
            mobile: mobile?.trim() || '',
            role: role || 'Parent'
          }
        }
      })

      if (error) {
        console.error('Signup error:', error)
        const rawMessage = typeof error.message === 'string' ? error.message : String(error)
        const friendlyMessage = rawMessage.toLowerCase().includes('already registered')
          ? 'This email is already registered. Please log in instead.'
          : rawMessage
        setErrorMessage(friendlyMessage)
        return
      }

      console.log('User created:', data)
      setStatusMessage('Signup successful! Check your email for confirmation or log in now.')
      setLastEmail(email)
    } catch (unexpected) {
      console.error('Unexpected signup error:', unexpected)
      setErrorMessage('An unexpected error occurred during signup. Please try again.')
    }
  }

  // 🔹 Login
  const handleLogin = async () => {
    setErrorMessage('')
    setStatusMessage('')

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    if (user) {
      setErrorMessage(`Already signed in as ${user.email}. Please log out first.`)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        const rawMessage = typeof error.message === 'string' ? error.message : String(error)
        setErrorMessage(rawMessage)
        return
      }

      console.log('Logged in:', data)
      setUser(data.user)
      setStatusMessage(`Logged in as ${data.user?.email}`)
      setLastEmail(data.user?.email ?? '')
      router.push('/admin')
    } catch (unexpected) {
      console.error('Unexpected login error:', unexpected)
      setErrorMessage('An unexpected error occurred during login. Please try again.')
    }
  }

  // 🔹 Logout
  const handleLogout = async () => {
    setErrorMessage('')
    setStatusMessage('')

    if (!user) {
      setStatusMessage('No user is currently signed in.')
      return
    }

    const previousEmail = user.email
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Logout error:', error)
        const rawMessage = typeof error.message === 'string' ? error.message : String(error)
        setErrorMessage(rawMessage)
        return
      }

      setUser(null)
      setStatusMessage(`Logged out from ${previousEmail}`)
      setLastEmail(previousEmail)
    } catch (unexpected) {
      console.error('Unexpected logout error:', unexpected)
      setErrorMessage('An unexpected error occurred during logout. Please try again.')
    }
  }

  // UI ko jo bhi logic aur variables chahiye wo yahan se return honge
  return {
    firstname, setFirstname,
    lastname, setLastname,
    mobile, setMobile,
    role, setRole,
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
  }
}