import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const INFO_CARDS = [
  {
    icon: <FiPhone className="text-2xl text-orange-500" />,
    title: "Phone",
    lines: ["020-3300335", "017-00000000"],
  },
  {
    icon: <FiMail className="text-2xl text-orange-500" />,
    title: "Email",
    lines: ["support@zyromart.com", "info@zyromart.com"],
  },
  {
    icon: <FiMapPin className="text-2xl text-orange-500" />,
    title: "Head Office",
    lines: ["27 Square, Dhanmondi", "Dhaka, Bangladesh"],
  },
  {
    icon: <FiClock className="text-2xl text-orange-500" />,
    title: "Business Hours",
    lines: ["Sat – Thu: 10 AM – 9 PM", "Friday: Closed"],
  },
];

const SUBJECTS = [
  "Order Issue",
  "Product Inquiry",
  "Return & Refund",
  "Technical Support",
  "Partnership",
  "Other",
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    // Simulate a brief network delay then show success
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 px-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FiMessageSquare className="text-3xl opacity-90" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Contact Us</h1>
          </div>
          <p className="text-orange-100 text-sm md:text-base max-w-lg mt-1">
            Have a question or need help? We're here for you. Reach out and our team will respond within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {INFO_CARDS.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-start gap-3">
              <div className="p-2.5 bg-orange-50 rounded-xl">{card.icon}</div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                {card.lines.map((l) => (
                  <p key={l} className="text-sm text-gray-700 font-medium">{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Form + side note */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Send us a message</h2>
            <p className="text-sm text-gray-400 mb-6">Fill in the form below and we'll get back to you shortly.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
                >
                  <option value="">Select a subject…</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your issue or question in detail…"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition"
              >
                <FiSend />
                {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>

          {/* Side note */}
          <div className="flex flex-col gap-5">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-orange-700 mb-2">Quick Support</h3>
              <p className="text-xs text-orange-600 leading-relaxed mb-4">
                For urgent order issues or delivery queries, calling us directly is the fastest way to get help.
              </p>
              <a
                href="tel:020-3300335"
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
              >
                <FiPhone /> 020-3300335
              </a>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Visit a Store</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Prefer face-to-face help? Walk into any of our 3 locations across Dhaka.
              </p>
              <Link
                to="/storeLocations"
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
              >
                <MdStorefront /> Find a Store →
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Response Times</h3>
              <ul className="space-y-2">
                {[
                  { label: "Email", time: "Within 24 hours" },
                  { label: "Phone", time: "Immediate" },
                  { label: "Live Chat", time: "Within 1 hour" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-700">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
