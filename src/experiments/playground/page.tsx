'use client'

import { useState, useEffect } from 'react'

export default function Playground() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [show, setShow] = useState(true)
  const [tasks, setTasks] = useState<string[]>([])
  const [taskInput, setTaskInput] = useState('')
  const [loading, setLoading] = useState(true)

  // Load tasks from JSON file on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch('/api/tasks')
        const data = await response.json()
        if (data.success) {
          setTasks(data.tasks)
        }
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  // Save tasks to JSON file when they change
  useEffect(() => {
    if (!loading) {
      const saveTasks = async () => {
        try {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tasks }),
          })
        } catch (error) {
          console.error('Error saving tasks:', error)
        }
      }
      saveTasks()
    }
  }, [tasks, loading])

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks((prev) => [...prev, taskInput])
      setTaskInput('')
    }
  }

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <main className="min-h-screen bg-[#f4ebe0] px-3 py-4 text-[#3d121d] sm:px-4 sm:py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <section className="grid gap-4 md:gap-6 lg:grid-cols-[1.8fr_0.9fr]">
          <div className="rounded-[1.5rem] bg-white/95 p-4 shadow-[0_30px_90px_rgba(80,24,35,0.12)] ring-1 ring-[#8d2d41]/10 sm:p-6 md:rounded-[2rem] md:p-8">
            <div className="mb-6 rounded-[1.25rem] bg-[#7b1d2f] px-4 py-5 text-white shadow-lg shadow-[#7b1d2f]/20 sm:px-6 sm:py-6 md:rounded-[1.75rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffe8d1]/80">
                Project playground
              </p>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-3xl md:text-4xl">
                Practice workspace
              </h1>
              <p className="mt-2 max-w-2xl text-xs leading-6 text-[#ffe8d1]/90 sm:mt-3 sm:text-sm md:leading-7 md:text-base">
                Use this workspace for quick experiments, UI checks, and small project tests.
              </p>
            </div>

            <div className="grid gap-4 md:gap-6">
              <div className="rounded-[1.25rem] border border-[#e8d9cd] bg-[#fff7ed] p-4 shadow-sm sm:p-5 md:rounded-[1.75rem] md:p-6">
                <h2 className="text-base font-semibold text-[#7b1d2f] sm:text-lg">Counter</h2>
                <p className="mt-2 text-xs text-[#5c2830] sm:text-sm">A simple counter to test state updates.</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="rounded-full bg-[#f1e4d9] px-3 py-2 text-xs font-semibold text-[#5b2c31] sm:px-4">Count: {count}</span>
                  <button
                    className="rounded-2xl bg-[#7b1d2f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#931f38] sm:px-5"
                    onClick={() => setCount((prev) => prev + 1)}
                  >
                    Increase
                  </button>
                  <button
                    className="rounded-2xl bg-[#e6bfa8] px-4 py-2 text-xs font-semibold text-[#5d121f] transition hover:bg-[#f2d2c2] sm:px-5"
                    onClick={() => setCount(0)}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[#e8d9cd] bg-[#fff7ed] p-4 shadow-sm sm:p-5 md:rounded-[1.75rem] md:p-6">
                <h2 className="text-base font-semibold text-[#7b1d2f] sm:text-lg">Text input</h2>
                <p className="mt-2 text-xs text-[#5c2830] sm:text-sm">Type here to verify input handling and state binding.</p>
                <input
                  className="mt-3 w-full rounded-xl border border-[#d9b9b0] bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none transition focus:border-[#7b1d2f] focus:ring-2 focus:ring-[#7b1d2f]/10 sm:mt-4 sm:rounded-2xl sm:px-4 sm:py-3"
                  placeholder="Type your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="mt-2 text-xs text-[#5b1727] sm:mt-3 sm:text-sm">Your name: <span className="font-semibold">{name || '...'}</span></p>
              </div>

              <div className="rounded-[1.25rem] border border-[#e8d9cd] bg-[#fff7ed] p-4 shadow-sm sm:p-5 md:rounded-[1.75rem] md:p-6">
                <h2 className="text-base font-semibold text-[#7b1d2f] sm:text-lg">Toggle panel</h2>
                <p className="mt-2 text-xs text-[#5c2830] sm:text-sm">Use this to test conditional rendering and visibility changes.</p>
                <button
                  className="mt-3 rounded-2xl bg-[#b33a4f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#922a3c] sm:mt-4 sm:px-5"
                  onClick={() => setShow((prev) => !prev)}
                >
                  {show ? 'Hide' : 'Show'} note
                </button>
                {show && <p className="mt-3 rounded-xl bg-[#f8e3d8] px-3 py-2 text-xs text-[#5b1727] sm:mt-4 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">This text can disappear when toggled.</p>}
              </div>
            </div>
          </div>

          <aside className="rounded-[1.5rem] bg-[#fcf3eb] p-4 shadow-[0_20px_60px_rgba(124,41,45,0.12)] ring-1 ring-[#d8c5b7]/80 sm:p-5 md:rounded-[2rem] md:p-6">
            <div className="rounded-[1.25rem] bg-[#fff7ed] p-4 shadow-sm ring-1 ring-[#e7d7ca]/80 sm:p-5 md:rounded-[1.75rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#7b1d2f]/80">Side window</p>
              <h2 className="mt-3 text-xl font-bold text-[#5b1727] sm:mt-4 md:text-2xl">Practice notes</h2>
              <p className="mt-2 text-xs leading-6 text-[#5c2830] sm:mt-3 sm:text-sm md:leading-7">
                Keep this panel for quick reminders and tasks.
              </p>
            </div>

            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4 md:mt-6">
              <div className="rounded-[1.25rem] bg-[#fff5eb] p-3 text-xs text-[#5b1727] ring-1 ring-[#e8d4c9]/80 sm:p-4 md:rounded-[1.75rem]">
                <p className="font-semibold text-[#7b1d2f]">Task list</p>
                <div className="mt-2 flex gap-2 sm:mt-3">
                  <input
                    className="flex-1 rounded-lg border border-[#d9b9b0] bg-white px-2 py-1.5 text-xs text-slate-900 outline-none transition focus:border-[#7b1d2f] focus:ring-1 focus:ring-[#7b1d2f]/20 sm:rounded-xl sm:px-3 sm:py-2"
                    placeholder="Add a task..."
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <button
                    className="rounded-lg bg-[#7b1d2f] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#931f38] sm:rounded-xl sm:px-4 sm:py-2"
                    onClick={addTask}
                  >
                    Add
                  </button>
                </div>
                {!loading && tasks.length > 0 && (
                  <ul className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
                    {tasks.map((task, index) => (
                      <li key={index} className="flex items-center justify-between gap-2 rounded-lg bg-[#f8e3d8] px-2 py-1.5 sm:px-3 sm:py-2">
                        <span className="truncate text-xs">{task}</span>
                        <button
                          className="flex-shrink-0 text-[#7b1d2f] hover:text-[#931f38]"
                          onClick={() => removeTask(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {!loading && tasks.length === 0 && <p className="mt-2 text-xs italic text-[#9b7a85] sm:mt-3">No tasks yet...</p>}
                {loading && <p className="mt-2 text-xs text-[#9b7a85] sm:mt-3">Loading tasks...</p>}
              </div>

              <div className="rounded-[1.25rem] bg-[#fff5eb] p-3 text-xs text-[#5b1727] ring-1 ring-[#e8d4c9]/80 sm:p-4 md:rounded-[1.75rem]">
                <p className="font-semibold text-[#7b1d2f]">Quick tips</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-[#5c2830] sm:mt-3 sm:space-y-1.5">
                  <li className="text-xs">Test UI components</li>
                  <li className="text-xs">Try Tailwind layouts</li>
                  <li className="text-xs">Save your tasks</li>
                </ul>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
