import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f1e7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_20px_80px_rgba(88,28,39,0.18)] backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#7b1d2f] via-[#8f2438] to-[#5b1220] px-4 py-6 text-white sm:px-8">
            <h1 className="text-4xl font-bold mb-4">Project Playground</h1> 
            <p className="text-lg mb-4">This is the main page of the app.</p>
            <p className="text-lg mb-4">Use the navigation links above to explore the different sections of the app.</p>
            <Link href="https://colab.research.google.com/drive/1M6UQUSGW2--qz08KHxWclTbXnINhKyVX?usp=sharing" className="inline-block mt-4 rounded-2xl bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#931f38]">
              Python Notebook
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}