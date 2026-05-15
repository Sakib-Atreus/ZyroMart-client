import { Link } from "react-router-dom";
import { FiShoppingBag, FiUsers, FiMapPin, FiStar, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { MdStorefront, MdSupportAgent, MdVerified } from "react-icons/md";

// ── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: <FiShoppingBag className="text-2xl text-orange-500" />, value: "10,000+", label: "Products Listed" },
  { icon: <FiUsers className="text-2xl text-orange-500" />,        value: "50,000+", label: "Happy Customers" },
  { icon: <MdStorefront className="text-2xl text-orange-500" />,   value: "3",        label: "Store Locations" },
  { icon: <FiStar className="text-2xl text-orange-500" />,         value: "4.8 / 5",  label: "Average Rating" },
];

const VALUES = [
  {
    icon: <MdVerified className="text-3xl text-orange-500" />,
    title: "Authenticity",
    desc: "Every product on ZyroMart is sourced from verified vendors and authorised distributors. We guarantee 100% genuine items, every time.",
  },
  {
    icon: <MdSupportAgent className="text-3xl text-orange-500" />,
    title: "Customer First",
    desc: "From browsing to after-sales support, our team is available 6 days a week to ensure you have the best shopping experience possible.",
  },
  {
    icon: <FiShoppingBag className="text-3xl text-orange-500" />,
    title: "Best Value",
    desc: "We work directly with brands and authorised distributors to offer competitive pricing without compromising on quality or service.",
  },
  {
    icon: <FiMapPin className="text-3xl text-orange-500" />,
    title: "Local Presence",
    desc: "With 3 physical stores across Dhaka, you can always walk in, touch the product, and get expert advice before you buy.",
  },
];

const TEAM = [
  { name: "Md. Sakib Mia",    role: "Founder & CEO",         initial: "M" },
  { name: "Samiul Islam",    role: "Head of Operations",    initial: "S" },
  { name: "Sakib", role: "Lead Product Manager",  initial: "S" },
  { name: "Atreus",    role: "Customer Experience",   initial: "A" },
];

const MILESTONES = [
  { year: "1992", text: "ZyroMart founded as a small electronics shop in Mirpur, Dhaka." },
  { year: "2005", text: "Expanded to a second location in Dhanmondi and introduced branded accessories." },
  { year: "2015", text: "Opened flagship store in Gulshan and launched a vendor partnership programme." },
  { year: "2022", text: "Launched zyromart.com — bringing our full catalogue online with nationwide delivery." },
  { year: "2024", text: "Surpassed 50,000 customers and introduced EMI payment options across all product categories." },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
    <div className="p-3 bg-orange-50 rounded-xl">{icon}</div>
    <p className="text-2xl font-extrabold text-gray-800">{value}</p>
    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">{label}</p>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
    <div className="p-3 bg-orange-50 rounded-xl w-fit">{icon}</div>
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TeamCard = ({ name, role, initial }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
      {initial}
    </div>
    <div>
      <p className="text-sm font-bold text-gray-800">{name}</p>
      <p className="text-xs text-gray-400 mt-0.5">{role}</p>
    </div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────

const About = () => (
  <div className="bg-gray-50 min-h-screen pb-16">

    {/* Hero */}
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16 px-4 shadow-md">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-3">About ZyroMart</p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Dhaka's Most Trusted <br className="hidden md:block" /> Tech Marketplace
          </h1>
          <p className="text-orange-100 text-sm md:text-base leading-relaxed max-w-md">
            Since 1992, ZyroMart has been helping people across Bangladesh find the best tech — from smartphones and laptops to accessories and smart home devices — all in one place.
          </p>
          <div className="flex gap-3 mt-7">
            <Link
              to="/phones"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 text-sm font-bold rounded-xl hover:bg-orange-50 transition"
            >
              Shop Now <FiArrowRight />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-5 py-2.5 border border-white/40 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex flex-col items-center text-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">{s.icon}</div>
              <p className="text-xl font-extrabold">{s.value}</p>
              <p className="text-xs text-orange-100 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Stats — mobile only */}
    <div className="md:hidden max-w-7xl mx-auto px-4 mt-8 grid grid-cols-2 gap-4">
      {STATS.map((s) => <StatCard key={s.label} {...s} />)}
    </div>

    <div className="max-w-7xl mx-auto px-4 mt-14 space-y-16">

      {/* Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Our Story</p>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-4 leading-snug">
            30+ Years of Serving <br /> Bangladesh's Tech Community
          </h2>
          <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
            <p>
              ZyroMart started as a small corner electronics shop in Mirpur in 1992. Our founder Rafiq Ahmed had a simple vision: make quality technology accessible to everyone in Bangladesh at honest prices.
            </p>
            <p>
              Over three decades, that corner shop grew into one of Dhaka's most recognised tech retail brands — with three physical stores, thousands of online products, and a network of verified vendors covering every major tech category.
            </p>
            <p>
              Today, ZyroMart serves tens of thousands of customers every month, offering everything from the latest smartphones and laptops to accessories, smart devices, and gaming gear — backed by genuine warranty and expert support.
            </p>
          </div>
          <ul className="mt-5 space-y-2">
            {["Authorised distributor for 50+ global brands", "7-day hassle-free returns", "EMI available on all major products", "Nationwide delivery"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <FiCheckCircle className="text-orange-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Milestones</p>
          <ol className="relative border-l-2 border-orange-100 space-y-6 ml-2">
            {MILESTONES.map(({ year, text }) => (
              <li key={year} className="pl-6 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow" />
                <p className="text-xs font-bold text-orange-600 mb-1">{year}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Why Choose Us</p>
          <h2 className="text-2xl font-extrabold text-gray-800">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => <ValueCard key={v.title} {...v} />)}
        </div>
      </section>

      {/* Team */}
      <section>
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">The People</p>
          <h2 className="text-2xl font-extrabold text-gray-800">Meet Our Team</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            A passionate group of tech enthusiasts dedicated to delivering the best shopping experience in Bangladesh.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {TEAM.map((t) => <TeamCard key={t.name} {...t} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-10 text-center text-white shadow-md">
        <h2 className="text-2xl font-extrabold mb-3">Ready to Shop?</h2>
        <p className="text-orange-100 text-sm max-w-md mx-auto mb-6">
          Browse thousands of genuine products from trusted brands — with fast delivery, easy returns, and expert support.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            to="/phones"
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-orange-600 text-sm font-bold rounded-xl hover:bg-orange-50 transition"
          >
            Browse Products <FiArrowRight />
          </Link>
          <Link
            to="/storeLocations"
            className="flex items-center gap-2 px-6 py-2.5 border border-white/40 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition"
          >
            <MdStorefront /> Find a Store
          </Link>
        </div>
      </section>

    </div>
  </div>
);

export default About;
