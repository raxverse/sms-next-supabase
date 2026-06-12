import React from 'react';

export default function practice() {
  return (
    // MAIN WRAPPER: Poori screen ki height lega aur background color dega
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* ----------------------------------------------------
          1. HEADER (FLEXBOX DEMO)
          Flex ka use karke Logo aur Profile ko aamne-saamne kiya
          ---------------------------------------------------- */}
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Ek chota sa colored dabba logo ke liye */}
          <div className="h-8 w-8 rounded-lg bg-[#7b1d2f]">PG</div>
          <h1 className="text-xl font-extrabold text-[#7b1d2f]">Playground</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-medium md:block">Welcome, Admin</span>
          <button className="rounded-full bg-slate-100 p-2 hover:bg-slate-200">
            🔔
          </button>
        </div>
      </header>

      {/* ----------------------------------------------------
          MAIN CONTENT AREA
          ---------------------------------------------------- */}
      <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-sm text-slate-500">Manage your school efficiently today.</p>
          </div>
        </div>

        {/* ----------------------------------------------------
            2. STATS CARDS (GRID DEMO)
            Mobile pe 1 column, Tablet pe 2, Laptop pe 4 columns
            ---------------------------------------------------- */}
        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">12,543</p>
            <p className="mt-1 text-xs text-green-600">↑ 12% from last month</p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Total Teachers</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">640</p>
            <p className="mt-1 text-xs text-green-600">↑ 4 new hired</p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Fee Collection</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">₹4.2 Cr</p>
            <p className="mt-1 text-xs text-red-500">↓ 2% pending</p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Attendance Today</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">96.4%</p>
            <p className="mt-1 text-xs text-slate-400">Normal</p>
          </div>
        </div>

        {/* ----------------------------------------------------
            3. COMPLEX LAYOUT (GRID COL-SPAN DEMO)
            Laptop pe 3 columns banenge, jisme pehla dabba 2 ki jagah lega
            ---------------------------------------------------- */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          
          {/* Bada Dabba (Takes 2 Columns on Large Screens) */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-4 text-lg font-bold">Recent Admissions</h3>
            <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-400">Graph or Table Data will render here</p>
            </div>
          </div>

          {/* Chota Dabba (Takes 1 Column) */}
          <div className="rounded-2xl border border-slate-100 bg-[#fff7ed] p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#7b1d2f]">Pending Actions</h3>
            
            <div className="space-y-4">
              {/* Flexbox for list items */}
              <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                <span className="text-sm font-medium">New Admissions</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">15</span>
              </div>
              
              <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                <span className="text-sm font-medium">Leave Requests</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-600">8</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                <span className="text-sm font-medium">Fee Defaulters</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">42</span>
              </div>
            </div>
            
            <button className="mt-6 w-full rounded-xl bg-[#7b1d2f] py-2 text-sm font-semibold text-white transition hover:bg-[#5b1220]">
              View All Tasks
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}