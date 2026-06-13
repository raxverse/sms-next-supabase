import Link from 'next/link'
import Image from 'next/image'
import { Users, GraduationCap, IndianRupee, Calendar, Shield, Smartphone } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'User Management',
    description: 'Manage students, teachers, staff and parents with role-based access control.',
  },
  {
    icon: GraduationCap,
    title: 'Academic Excellence',
    description: 'Track classes, sections, subjects, exams, and results efficiently.',
  },
  {
    icon: IndianRupee,
    title: 'Fee Management',
    description: 'Generate invoices, track payments, and manage fee structures.',
  },
  {
    icon: Calendar,
    title: 'Attendance Tracking',
    description: 'Real-time attendance monitoring with detailed reports.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Secure multi-tenant system with granular permissions.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Access from any device, anywhere, anytime.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f1e7] to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7b1d2f] via-[#8f2438] to-[#5b1220] opacity-95" />

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm border border-white/10 mb-6">
                Multi-Tenant School Management
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Empower Your
                <span className="block text-[#ffe8d1]">Education System</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
                A comprehensive platform designed to streamline administration, connect parents,
                empower teachers, and enhance student learning experiences.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-[#7b1d2f] shadow-xl hover:bg-[#f8f1ed] transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="hidden lg:block relative">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/studentclass.png"
                  alt="Students in classroom"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#5b1220]/40 to-transparent" />
              </div>

              {/* Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <p className="text-2xl font-bold text-[#7b1d2f]">500+</p>
                <p className="text-xs text-slate-500">Schools Connected</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <p className="text-2xl font-bold text-[#7b1d2f]">100K+</p>
                <p className="text-xs text-slate-500">Students Managed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#7b1d2f]">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features to manage your entire school ecosystem from a single platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl border border-slate-200 bg-white hover:bg-[#faf7f5] transition-all duration-300 hover:shadow-lg hover:shadow-[#7b1d2f]/5"
                >
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-[#7b1d2f] to-[#931f38] text-white shadow-lg shadow-[#7b1d2f]/20">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#7b1d2f] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#7b1d2f] to-[#931f38]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Transform Your School?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Join hundreds of schools already using our platform to streamline their operations.
          </p>
          <div className="mt-8">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#7b1d2f] shadow-xl hover:bg-[#f8f1ed] transition-colors"
            >
              Start Managing Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7b1d2f] to-[#931f38] text-white font-bold text-xs">
                SMS
              </div>
              <span className="text-sm font-semibold text-slate-900">SchoolMS</span>
            </div>
            <p className="text-xs text-slate-500">
              © 2024 School Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
