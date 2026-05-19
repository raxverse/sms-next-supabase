'use client'

import Link from 'next/link'

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:block w-64">
      <nav className="sticky top-20 rounded-lg bg-white/95 p-4 shadow-sm ring-1 ring-[#e6c7b8]">
        <h3 className="text-sm font-semibold text-[#7b1d2f] mb-3">Admin</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/admin" className="block rounded-md px-3 py-2 text-[#5b1220] hover:bg-[#f8e7dc]">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin#schools" className="block rounded-md px-3 py-2 text-[#5b1220] hover:bg-[#f8e7dc]">Schools</Link>
          </li>
          <li>
            <Link href="/admin#sessions" className="block rounded-md px-3 py-2 text-[#5b1220] hover:bg-[#f8e7dc]">Sessions</Link>
          </li>
          <li>
            <Link href="/admin/users" className="block rounded-md px-3 py-2 text-[#5b1220] hover:bg-[#f8e7dc]">Users</Link>
          </li>
          <li>
            <Link href="/admin/settings" className="block rounded-md px-3 py-2 text-[#5b1220] hover:bg-[#f8e7dc]">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
