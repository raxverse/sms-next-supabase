import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f1e7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_20px_80px_rgba(88,28,39,0.18)] backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#7b1d2f] via-[#8f2438] to-[#5b1220] px-6 py-8 text-white sm:px-10">
            <p className="text-sm uppercase tracking-[0.24em] opacity-80">About</p>
            <h1 className="mt-3 text-4xl font-bold">Hello, I’m raxverse</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#f3e8df]">
              I build clean, modern interfaces with a focus on simple interactions and strong visuals.
              This page shares who I am, how to reach me, and where to find my social links.
            </p>
          </div>

          <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
            <div className="rounded-[2rem] bg-[#fff7ed] p-6 shadow-sm ring-1 ring-[#e6c7b8]">
              <h2 className="text-2xl font-semibold text-[#7b1d2f]">Quick profile</h2>
              <p className="mt-4 text-base leading-7 text-[#5b1220]">
                I am raxverse and I enjoy building responsive web pages with a polished look and easy navigation.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#e6c7b8]">
              <h2 className="text-2xl font-semibold text-[#7b1d2f]">Social media</h2>
              <p className="mt-3 text-base text-[#5b1220]">Find me on these networks for more updates and projects.</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="https://www.facebook.com/raxverse"
                  className="rounded-2xl border border-[#e8d7ca] bg-[#fdf7f1] px-4 py-3 text-base font-semibold text-[#5b1220] transition hover:bg-[#f8e7dc]"
                >
                  Facebook
                </Link>
                <Link
                  href="https://www.instagram.com/raxverse"
                  className="rounded-2xl border border-[#e8d7ca] bg-[#fdf7f1] px-4 py-3 text-base font-semibold text-[#5b1220] transition hover:bg-[#f8e7dc]"
                >
                  Instagram
                </Link>
                <Link
                  href="https://www.youtube.com/@raxverse"
                  className="rounded-2xl border border-[#e8d7ca] bg-[#fdf7f1] px-4 py-3 text-base font-semibold text-[#5b1220] transition hover:bg-[#f8e7dc]"
                >
                  YouTube
                </Link>
                <Link
                  href="https://github.com/raxverse"
                  className="rounded-2xl border border-[#e8d7ca] bg-[#fdf7f1] px-4 py-3 text-base font-semibold text-[#5b1220] transition hover:bg-[#f8e7dc]"
                >
                  GitHub
                </Link>
                <Link
                  href="https://www.linkedin.com/in/raxverse"
                  className="rounded-2xl border border-[#e8d7ca] bg-[#fdf7f1] px-4 py-3 text-base font-semibold text-[#5b1220] transition hover:bg-[#f8e7dc]"
                >
                  LinkedIn
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#e6c7b8]">
              <h2 className="text-2xl font-semibold text-[#7b1d2f]">Need to contact?</h2>
              <p className="mt-3 text-base leading-7 text-[#5b1220]">
                Use the Contact page for a fast WhatsApp query. It opens a direct message with a simple question, so you can reach me quickly.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex rounded-full bg-[#7b1d2f] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#931f38]"
              >
                Go to Contact
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
