// components/AuthForm.tsx
'use client'

import { useAuthLogic } from '@/hooks/useAuthLogic'

export default function AuthForm() {
  const {
    email, setEmail,
    password, setPassword,
    firstname, setFirstname,
    lastname, setLastname,
    mobile, setMobile,
    role, setRole, user,
    statusMessage,
    errorMessage,
    lastEmail,
    mode, setMode,
    handleSignup, handleLogin, handleLogout
  } = useAuthLogic()

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 1. Main Form Card */}
      <section className="auth-card">
        
        {/* 2. Top Header Gradient */}
        <div className="auth-header">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ffe8d1]/90">
            Welcome back
          </p>
        </div>
        
        <div className="space-y-3 px-4 py-4 sm:px-8 sm:py-10">

          {/* ================= LOGIN SECTION ================= */}
          {mode === 'login' && !user ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[var(--label-color)]">Login to your account</h2>
              
              <div className="input-group">  
                <label className="input-label">Email</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button className="btn-primary" onClick={handleLogin}>
                  Login
                </button>
                <button className="btn-secondary" onClick={() => setMode('signup')}>
                  Signup
                </button>
              </div>
            </div>
          ) : null}

          {/* ================= SIGNUP SECTION ================= */}
          {mode === 'signup' && !user ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[var(--label-color)]">Create a new account</h2>

              <div className="grid grid-cols-2 gap-2">
                <div className="input-group">
                  <label className="input-label">First Name</label>
                  <input
                    className="input-field"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Last Name</label>
                  <input
                    className="input-field"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Mobile</label>
                <input
                  className="input-field"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Role</label>
                <select
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="schooladmin">School Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  className="input-field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button className="btn-primary" onClick={handleSignup}>
                  Sign Up
                </button>
                <button className="btn-secondary" onClick={() => setMode('login')}>
                  Login
                </button>
              </div>
            </div>
          ) : null}

          {/* ================= ALERTS & MESSAGES ================= */}
          {errorMessage ? (
            <div className="alert-error">
              {errorMessage}
            </div>
          ) : null}

          <div className="alert-info">
            {statusMessage ? statusMessage : user ? `Logged in as ${user.email}` : lastEmail ? `Logged out from ${lastEmail}` : 'Not signed in yet.'}
          </div>

          {/* ================= LOGOUT BUTTON ================= */}
          {user && (
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          )}
          
        </div>
      </section>
    </div>
  )
}