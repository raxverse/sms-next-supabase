"use client";

import { FormEvent, useState } from "react";

const whatsappNumber = "919140271174";
const defaultMessage = "Hello, I have a quick question for you.";

export default function ContactPage() {
  const [query, setQuery] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = query.trim() || defaultMessage;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    setLastMessage(message);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#f8f1e7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_20px_80px_rgba(88,28,39,0.18)] backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#7b1d2f] via-[#8f2438] to-[#5b1220] px-6 py-8 text-white sm:px-10">
            <p className="text-sm uppercase tracking-[0.24em] opacity-80">Contact</p>
            <h1 className="mt-3 text-4xl font-bold">Send a WhatsApp query</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#f3e8df]">
              Enter a short query and click the button to open WhatsApp directly with a message ready to send.
            </p>
          </div>

          <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
            <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-[#fff7ed] p-6 shadow-sm ring-1 ring-[#e6c7b8]">
              <label className="block text-base font-semibold text-[#5b1220]">
                Your message
                <textarea
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Type a short question for WhatsApp..."
                  rows={5}
                  className="mt-3 w-full rounded-3xl border border-[#e8d7ca] bg-[#faf4ee] px-4 py-3 text-base text-[#3f191f] placeholder:text-[#a77a7a] focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#7b1d2f] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#931f38]"
              >
                Message on WhatsApp
              </button>
            </form>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#e6c7b8]">
              <h2 className="text-2xl font-semibold text-[#7b1d2f]">Need a quick link?</h2>
              <p className="mt-3 text-base leading-7 text-[#5b1220]">
                If WhatsApp does not open automatically, use the button below or copy the message to your own chat.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full bg-[#7b1d2f] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#931f38]"
              >
                Open WhatsApp
              </a>
              {lastMessage && (
                <p className="mt-4 text-sm text-[#5b1220]">
                  Last message: <span className="font-semibold">{lastMessage}</span>
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
