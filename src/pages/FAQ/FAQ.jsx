import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHelpCircle, FiChevronDown, FiSearch } from "react-icons/fi";

const CATEGORIES = [
  {
    label: "Orders & Payment",
    icon: "🛒",
    faqs: [
      {
        q: "How do I place an order?",
        a: "Browse our product catalogue at /phones, select the item you want, choose your variant (colour, storage, etc.) and click 'Add to Cart'. When you're ready, go to your cart and proceed to checkout. You'll need to be logged in to complete a purchase.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major debit and credit cards (Visa, Mastercard), bKash, Nagad, Rocket, and cash on delivery for select areas. EMI options are available on eligible products — you'll see the 'EMI Available' badge on product pages.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "You can cancel or modify your order within 1 hour of placing it by visiting My Orders in your profile. After that window, the order may have already been dispatched and cannot be changed. Contact our support team as soon as possible if you need help.",
      },
      {
        q: "Is it safe to pay online on ZyroMart?",
        a: "Yes. All transactions on ZyroMart are encrypted with HTTPS/TLS. We do not store your card details — payments are processed through PCI-DSS compliant payment gateways.",
      },
      {
        q: "Will I receive a payment receipt?",
        a: "Yes. An order confirmation and payment receipt are sent to your registered email address immediately after a successful purchase. You can also view all invoices in your profile under Order History.",
      },
    ],
  },
  {
    label: "Shipping & Delivery",
    icon: "🚚",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Delivery within Dhaka typically takes 1–2 business days. For other cities and districts it's usually 3–5 business days. Delivery times may vary during peak seasons or public holidays.",
      },
      {
        q: "Do you deliver outside Dhaka?",
        a: "Yes, we deliver nationwide across Bangladesh. Shipping costs and estimated delivery times vary by location and are shown at checkout before you confirm your order.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is dispatched, you'll receive a tracking number via email and SMS. You can also track your order in real time from My Orders in your profile.",
      },
      {
        q: "What if I'm not available when the delivery arrives?",
        a: "Our delivery partner will attempt delivery up to 2 times. If you miss both attempts, the parcel will be held at the nearest hub for 3 days. After that it will be returned to us. You can reschedule delivery by calling the number on the delivery notification.",
      },
    ],
  },
  {
    label: "Returns & Refunds",
    icon: "↩️",
    faqs: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return policy on most products. Items must be unused, in original packaging, with all accessories and a proof of purchase. Some items (opened software, digital codes, hygiene items) are non-returnable.",
      },
      {
        q: "How do I initiate a return?",
        a: "Go to My Orders in your profile, select the order, and click 'Return Item'. Fill in the reason and submit. Our team will review your request within 1–2 business days and send a pickup confirmation.",
      },
      {
        q: "When will I get my refund?",
        a: "Once we receive and inspect the returned item, your refund is processed within 3–5 business days. The time it takes to reflect in your account depends on your payment method — card refunds typically appear within 7–10 business days.",
      },
      {
        q: "What if I received a damaged or wrong item?",
        a: "We're sorry to hear that. Please contact us within 48 hours of delivery with photos of the damaged or incorrect item. We'll arrange a free return pickup and send the correct replacement at no extra cost.",
      },
    ],
  },
  {
    label: "Products & Warranty",
    icon: "📱",
    faqs: [
      {
        q: "Are all products on ZyroMart genuine?",
        a: "Yes. Every product sold on ZyroMart is sourced from authorised distributors or verified vendors. We do not allow counterfeit or grey-market products. If you ever suspect a product is not genuine, please contact us immediately.",
      },
      {
        q: "Do products come with a manufacturer warranty?",
        a: "Yes, unless otherwise stated in the product listing. Warranty coverage varies by brand and product — details are shown on each product page under the 'Specifications' tab. Keep your invoice as proof of purchase for warranty claims.",
      },
      {
        q: "How do I claim a warranty?",
        a: "For warranty claims, you can either visit one of our physical stores or contact us through the Contact page. Bring your original invoice and the product. We'll coordinate with the brand's service centre on your behalf.",
      },
      {
        q: "Can I check product availability before visiting a store?",
        a: "Yes — the stock status is shown on every product page. You can also call any of our 3 store locations directly. Store contact details are available on our Store Locations page.",
      },
    ],
  },
  {
    label: "Account & Profile",
    icon: "👤",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click 'Register' in the top navigation bar. Enter your name, email, and a password. Once registered, you can track orders, manage your wishlist, and check out faster.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "On the login page, click 'Forgot Password' and enter your registered email address. You'll receive a password reset link. The link expires after 30 minutes for security.",
      },
      {
        q: "How do I update my delivery address?",
        a: "Log in and go to your Profile page. You can add, edit, or remove saved delivery addresses from the 'Addresses' section.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Please contact our support team through the Contact page and request account deletion. We'll process it within 5–7 business days. Note that order history required for legal or tax purposes may be retained as per our Privacy Policy.",
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-gray-100 last:border-0 transition-colors ${open ? "bg-orange-50/40" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-3 py-4 px-1 text-left min-h-[52px]"
      >
        <span className={`text-sm font-semibold leading-snug pt-0.5 ${open ? "text-orange-600" : "text-gray-700"}`}>
          {q}
        </span>
        <span className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
          open ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
        }`}>
          <FiChevronDown className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && (
        <p className="pb-4 px-1 text-sm text-gray-500 leading-relaxed">{a}</p>
      )}
    </div>
  );
};

const FAQ = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const filtered = search.trim()
    ? CATEGORIES.map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
          (f) =>
            f.q.toLowerCase().includes(search.toLowerCase()) ||
            f.a.toLowerCase().includes(search.toLowerCase()),
        ),
      })).filter((cat) => cat.faqs.length > 0)
    : CATEGORIES;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md">
        <div className="max-w-3xl mx-auto text-center px-4 pt-8 pb-6 md:pt-12 md:pb-10">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FiHelpCircle className="text-2xl md:text-3xl opacity-90" />
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Help & FAQ</h1>
          </div>
          <p className="text-orange-100 text-xs md:text-base mt-1.5 mb-5 max-w-sm mx-auto leading-relaxed">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveTab(0); }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md"
            />
          </div>
        </div>

        {/* ── Category tab strip — always visible at bottom of hero ── */}
        {!search.trim() && (
          <div className="overflow-x-auto scrollbar-hide border-t border-white/10">
            <div className="flex min-w-max md:min-w-0 md:justify-center px-4 py-0">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === i
                      ? "border-white text-white"
                      : "border-transparent text-orange-200 hover:text-white hover:border-white/50"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 mt-6">

        {/* Search results */}
        {search.trim() ? (
          filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <FiHelpCircle className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500 mb-1">No results found</p>
              <p className="text-xs text-gray-400">Try different keywords or clear the search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((cat) => (
                <div key={cat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <span>{cat.icon}</span>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">{cat.label}</p>
                    <span className="ml-auto text-xs text-gray-400">{cat.faqs.length} results</span>
                  </div>
                  <div className="px-5">
                    {cat.faqs.map((f) => <FAQItem key={f.q} {...f} />)}
                  </div>
                </div>
              ))}
            </div>
          )

        ) : (
          /* Tab content */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
              <span className="text-lg">{CATEGORIES[activeTab].icon}</span>
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest leading-none mb-0.5">
                  {CATEGORIES[activeTab].label}
                </p>
                <p className="text-[11px] text-gray-400">
                  {CATEGORIES[activeTab].faqs.length} questions
                </p>
              </div>
            </div>
            {/* Accordion list */}
            <div className="px-5">
              {CATEGORIES[activeTab].faqs.map((f) => <FAQItem key={f.q} {...f} />)}
            </div>
          </div>
        )}

        {/* ── Still need help ── */}
        <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-800 mb-0.5">Still have a question?</p>
            <p className="text-xs text-gray-500">Our team is available Sat–Thu, 10 AM – 9 PM.</p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
