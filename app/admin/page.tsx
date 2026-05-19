'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AdminSidebar from '../components/AdminSidebar'

type School = {
  id: string
  name: string
  slug: string
  email?: string | null
  phone?: string | null
  address?: string | null
  logo_url?: string | null
  is_active?: boolean
  created_at?: string
}

type Session = {
  id: string
  school_id: string
  session_name: string
  start_date: string
  end_date: string
  is_current?: boolean
  is_active?: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // CRUD state
  const [schools, setSchools] = useState<School[]>([])
  const [loadingSchools, setLoadingSchools] = useState(false)

  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)

  const [schoolForm, setSchoolForm] = useState<Partial<School>>({ name: '', slug: '' })

  const [sessions, setSessions] = useState<Session[]>([])
  const [sessionForm, setSessionForm] = useState<Partial<Session>>({ session_name: '', start_date: '', end_date: '' })

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (!sessionUser) {
        router.push('/')
        return
      }

      setUser(sessionUser)
      await fetchSchools()
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

  async function fetchSchools() {
    setLoadingSchools(true)
    const { data, error } = await supabase.from('schools').select('*').order('created_at', { ascending: false })
    setLoadingSchools(false)
    if (error) {
      setErrorMessage(error.message)
      return
    }
    setSchools(data as School[])
  }

  async function selectSchool(s: School) {
    setSelectedSchool(s)
    setSchoolForm({ ...s })
    await fetchSessions(s.id)
  }

  async function fetchSessions(schoolId: string) {
    const { data, error } = await supabase.from('sessions').select('*').eq('school_id', schoolId).order('start_date', { ascending: false })
    if (error) {
      setErrorMessage(error.message)
      return
    }
    setSessions(data as Session[])
  }

  async function createOrUpdateSchool(e?: any) {
    if (e) e.preventDefault()
    setErrorMessage('')
    setStatusMessage('')

    if (!schoolForm.name || !schoolForm.slug) {
      setErrorMessage('Name and slug are required.')
      return
    }

    if (schoolForm.id) {
      const { error } = await supabase.from('schools').update(schoolForm).eq('id', schoolForm.id)
      if (error) return setErrorMessage(error.message)
      setStatusMessage('School updated')
    } else {
      const { error } = await supabase.from('schools').insert([schoolForm])
      if (error) return setErrorMessage(error.message)
      setStatusMessage('School created')
    }

    setSchoolForm({ name: '', slug: '' })
    setSelectedSchool(null)
    await fetchSchools()
  }

  async function deleteSchool(id: string) {
    if (!confirm('Delete this school? This will also remove sessions.')) return
    const { error } = await supabase.from('schools').delete().eq('id', id)
    if (error) return setErrorMessage(error.message)
    setStatusMessage('School deleted')
    setSelectedSchool(null)
    await fetchSchools()
  }

  async function createOrUpdateSession(e?: any) {
    if (e) e.preventDefault()
    setErrorMessage('')
    setStatusMessage('')

    if (!selectedSchool) return setErrorMessage('Select a school first')
    if (!sessionForm.session_name || !sessionForm.start_date || !sessionForm.end_date) {
      setErrorMessage('Session name and dates are required')
      return
    }

    const payload = { ...sessionForm, school_id: selectedSchool.id }

    if (sessionForm.id) {
      const { error } = await supabase.from('sessions').update(payload).eq('id', sessionForm.id)
      if (error) return setErrorMessage(error.message)
      setStatusMessage('Session updated')
    } else {
      const { error } = await supabase.from('sessions').insert([payload])
      if (error) return setErrorMessage(error.message)
      setStatusMessage('Session created')
    }

    setSessionForm({ session_name: '', start_date: '', end_date: '' })
    await fetchSessions(selectedSchool.id)
  }

  async function deleteSession(id: string) {
    if (!confirm('Delete this session?')) return
    const { error } = await supabase.from('sessions').delete().eq('id', id)
    if (error) return setErrorMessage(error.message)
    setStatusMessage('Session deleted')
    if (selectedSchool) await fetchSessions(selectedSchool.id)
  }

  return (
    <main className="min-h-screen bg-[#f8f1e7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-6">
          <AdminSidebar />

          <section className="flex-1 overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_20px_80px_rgba(88,28,39,0.18)] backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#7b1d2f] via-[#8f2438] to-[#5b1220] px-4 py-6 text-white sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ffe8d1]/90">
              Admin area
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#ffe8d1]/90 sm:text-base">
              Manage schools and sessions for the application.
            </p>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-10">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold text-[#7b1d2f]">Schools</h2>
                <p className="mt-2 text-sm text-[#33403f]">Create, edit, or delete schools.</p>

                <form onSubmit={createOrUpdateSchool} className="mt-4 space-y-3 rounded-lg bg-[#fff7ed] p-4 shadow-sm ring-1 ring-[#e6c7b8]">
                  <input
                    value={schoolForm.name || ''}
                    onChange={(e) => setSchoolForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Name"
                    className="w-full rounded-md border border-[#e8d7ca] bg-[#faf4ee] px-3 py-2 text-[#3f191f] placeholder:text-[#a77a7a] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                  />
                  <input
                    value={schoolForm.slug || ''}
                    onChange={(e) => setSchoolForm((s) => ({ ...s, slug: e.target.value }))}
                    placeholder="Slug (unique)"
                    className="w-full rounded-md border border-[#e8d7ca] bg-[#faf4ee] px-3 py-2 text-[#3f191f] placeholder:text-[#a77a7a] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                  />
                  <input
                    value={schoolForm.email || ''}
                    onChange={(e) => setSchoolForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="Email"
                    className="w-full rounded-md border border-[#e8d7ca] bg-[#faf4ee] px-3 py-2 text-[#3f191f] placeholder:text-[#a77a7a] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                  />
                  <input
                    value={schoolForm.phone || ''}
                    onChange={(e) => setSchoolForm((s) => ({ ...s, phone: e.target.value }))}
                    placeholder="Phone"
                    className="w-full rounded-md border border-[#e8d7ca] bg-[#faf4ee] px-3 py-2 text-[#3f191f] placeholder:text-[#a77a7a] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                  />
                  <textarea
                    value={schoolForm.address || ''}
                    onChange={(e) => setSchoolForm((s) => ({ ...s, address: e.target.value }))}
                    placeholder="Address"
                    className="w-full rounded-md border border-[#e8d7ca] bg-[#faf4ee] px-3 py-2 text-[#3f191f] placeholder:text-[#a77a7a] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                  />

                  <div className="flex gap-3">
                    <button className="rounded-full bg-[#7b1d2f] px-4 py-2 text-white" type="submit">Save</button>
                    <button type="button" className="rounded-full bg-white border px-4 py-2" onClick={() => { setSchoolForm({ name: '', slug: '' }); setSelectedSchool(null); }}>Reset</button>
                    {schoolForm.id && (
                      <button type="button" className="rounded-full bg-[#b33a4f] px-4 py-2 text-white" onClick={() => deleteSchool(schoolForm.id!)}>Delete</button>
                    )}
                  </div>
                </form>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-[#5b1220]">All schools</h3>
                  {loadingSchools ? (
                    <p className="mt-2 text-sm">Loading…</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {schools.map((s) => (
                        <li key={s.id} className="flex items-center justify-between rounded-md border border-[#eee] px-3 py-2">
                          <div>
                            <div className="font-semibold text-[#7b1d2f]">{s.name}</div>
                            <div className="text-xs text-[#5b1220]">{s.slug} {s.email ? `· ${s.email}` : ''}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-sm rounded px-3 py-1 bg-white border" onClick={() => selectSchool(s)}>Edit</button>
                            <button className="text-sm rounded px-3 py-1 bg-[#ffecec] text-[#821717]" onClick={() => deleteSchool(s.id)}>Delete</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold text-[#7b1d2f]">Sessions</h2>
                <p className="mt-2 text-sm text-[#33403f]">Manage academic sessions for the selected school.</p>

                <div className="mt-4 space-y-3 rounded-lg bg-[#fff7ed] p-4 shadow-sm ring-1 ring-[#e6c7b8]">
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Selected school</label>
                    <div className="mt-1 text-sm text-[#5b1220]">{selectedSchool ? selectedSchool.name : 'None'}</div>
                  </div>

                  <form onSubmit={createOrUpdateSession} className="space-y-2">
                    <input
                      value={sessionForm.session_name || ''}
                      onChange={(e) => setSessionForm((s) => ({ ...s, session_name: e.target.value }))}
                      placeholder="Session name"
                      className="w-full rounded-md border border-[#e8d7ca] bg-[#faf4ee] px-3 py-2 text-[#3f191f] placeholder:text-[#a77a7a] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={sessionForm.start_date || ''}
                        onChange={(e) => setSessionForm((s) => ({ ...s, start_date: e.target.value }))}
                        className="w-full rounded-md border border-[#e8d7ca] bg-[#faf4ee] px-3 py-2 text-[#3f191f] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                      />
                      <input
                        type="date"
                        value={sessionForm.end_date || ''}
                        onChange={(e) => setSessionForm((s) => ({ ...s, end_date: e.target.value }))}
                        className="w-full rounded-md border border-[#e8d7ca] bg-[#faf4ee] px-3 py-2 text-[#3f191f] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button className="rounded-full bg-[#7b1d2f] px-4 py-2 text-white" type="submit">Save session</button>
                      <button type="button" className="rounded-full bg-white border px-4 py-2" onClick={() => setSessionForm({ session_name: '', start_date: '', end_date: '' })}>Reset</button>
                    </div>
                  </form>

                  <div>
                    <h4 className="text-sm font-medium">Sessions list</h4>
                    <ul className="mt-2 space-y-2">
                      {sessions.map((sess) => (
                        <li key={sess.id} className="flex items-center justify-between rounded-md border border-[#eee] px-3 py-2">
                          <div>
                            <div className="font-semibold text-[#5b1220]">{sess.session_name}</div>
                            <div className="text-xs text-[#5b1220]">{sess.start_date} → {sess.end_date}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-sm rounded px-3 py-1 bg-white border" onClick={() => setSessionForm({ ...sess })}>Edit</button>
                            <button className="text-sm rounded px-3 py-1 bg-[#ffecec] text-[#821717]" onClick={() => deleteSession(sess.id)}>Delete</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

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
          </div>
        </section>
      </div>
    </div>
    </main>
  )
}