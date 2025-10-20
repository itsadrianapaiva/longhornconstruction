import { SectionShell } from "./SectionShell";

export default async function Contact() {
  return (
    <SectionShell
      id="contact"
      title="Contact"
      subtitle="Let’s talk about your project in the Algarve."
    >
      <form className="grid grid-cols-1 gap-3 md:max-w-lg">
        <input
          className="rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Name"
          name="name"
        />
        <input
          className="rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Email"
          type="email"
          name="email"
        />
        <textarea
          className="min-h-[120px] rounded-md border border-zinc-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Project details"
          name="message"
        />
        <button
          type="button"
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Send
        </button>
      </form>
    </SectionShell>
  );
}
