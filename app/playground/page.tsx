'use client'

import { useState, useEffect } from 'react'

export default function Playground() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [show, setShow] = useState(true)

  useEffect(() => {
    console.log('Component mounted or updated')
  }, [])

  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Playground</h1>

      {/* Counter */}
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 3)}>Increase</button>
      </div>

      {/* Input */}
      <div>
        <input
          className="border p-2"
          placeholder="Type your name"
          onChange={(e) => setName(e.target.value)}
        />
        <p>Your name: {name}</p>
      </div>

      {/* Toggle */}
      <div>
        <button onClick={() => setShow(!show)}>Toggle</button>
        {show && <p>This text can disappear</p>}
      </div>
    </div>
  )
}