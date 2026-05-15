import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBriefcase, FiMapPin, FiClock, FiArrowRight, FiUsers, FiStar, FiHeart } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const PERKS = [
  { icon: <FiStar className="text-xl text-orange-500" />,    title: "Competitive Pay",       desc: "Market-rate salaries reviewed annually, with performance bonuses." },
  { icon: <FiClock className="text-xl text-orange-500" />,   title: "Flexible Hours",        desc: "Flexible scheduling and hybrid work options for eligible roles." },
  { icon: <FiUsers className="text-xl text-orange-500" />,   title: "Great Team",            desc: "Work alongside passionate tech enthusiasts in a collaborative environment." },
  { icon: <FiHeart className="text-xl text-orange-500" />,   title: "Health Coverage",       desc: "Medical and health insurance for you and your immediate family." },
  { icon: <MdStorefront className="text-xl text-orange-500" />, title: "Staff Discount",     desc: "Exclusive employee discount on all products across ZyroMart." },
  { icon: <FiBriefcase className="text-xl text-orange-500" />, title: "Career Growth",       desc: "Regular training, mentorship, and clear paths for advancement." },
];

const JOBS = [
  {
    id: 1,
    title: "Sales Associate",
    department: "Retail",
    location: "Mirpur, Dhaka",
    type: "Full-time",
    desc: "Assist customers on the showroom floor, demonstrate products, and meet monthly sales targets. Strong communication skills and a passion for technology required.",
    requirements: ["1+ year retail or sales experience", "Excellent communication in Bangla & English", "Basic knowledge of consumer electronics", "Ability to work weekends"],
  },
  {
    id: 2,
    title: "E-commerce Executive",
    department: "Digital",
    location: "Dhanmondi, Dhaka (Hybrid)",
    type: "Full-time",
    desc: "Manage product listings, pricing, and content on the ZyroMart platform. Coordinate with vendors, write product descriptions, and monitor catalogue health.",
    requirements: ["2+ years in e-commerce or digital marketing", "Proficient in MS Excel and basic data analysis", "Strong attention to detail", "Experience with product cataloguing preferred"],
  },
  {
    id: 3,
    title: "Customer Support Specialist",
    department: "Support",
    location: "Remote / Dhaka",
    type: "Full-time",
    desc: "Handle customer queries via phone, email, and live chat. Resolve order issues, coordinate returns, and ensure every customer leaves satisfied.",
    requirements: ["1+ year in customer service", "Patient, empathetic, and solution-oriented", "Good written and spoken English", "Familiarity with e-commerce platforms is a plus"],
  },
  {
    id: 4,
    title: "Warehouse & Logistics Coordinator",
    department: "Operations",
    location: "Mirpur, Dhaka",
    type: "Full-time",
    desc: "Oversee inbound and outbound shipments, manage inventory records, coordinate with couriers, and ensure accurate order fulfilment.",
    requirements: ["2+ years in logistics or warehouse management", "Experience with inventory software", "Strong organisational skills", "Physical fitness for warehouse duties"],
  },
  {
    id: 5,
    title: "Frontend Developer (React)",
    department: "Technology",
    location: "Remote / Dhaka (Hybrid)",
    type: "Full-time",
    desc: "Build and maintain the ZyroMart customer-facing web application. Work closely with designers and the backend team to ship high-quality features.",
    requirements: ["3+ years React experience", "Strong CSS / Tailwind skills", "Familiarity with REST APIs", "Experience with performance optimisation"],
  },
  {
    id: 6,
    title: "Graphic Designer (Part-time)",
    department: "Marketing",
    location: "Remote",
    type: "Part-time",
    desc: "Create visuals for social media campaigns, product banners, email newsletters, and promotional materials that align with the ZyroMart brand.",
    requirements: ["Proficient in Adobe Photoshop & Illustrator", "Strong portfolio of digital design work", "Understanding of e-commerce aesthetics", "Ability to meet tight deadlines"],
  },
];

const DEPARTMENTS = ["All", ...new Set(JOBS.map((j) => j.department))];

const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs bg-orange-50 text-orange-600 font-semibold px-2.5 py-0.5 rounded-full border border-orange-100">
              {job.department}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              job.type === "Full-time"
                ? "bg-green-50 text-green-600 border-green-100"
                : "bg-blue-50 text-blue-600 border-blue-100"
            }`}>
              {job.type}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800">{job.title}</h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <FiMapPin className="shrink-0" />
            {job.location}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 border border-orange-200 text-orange-600 text-xs font-semibold rounded-xl hover:bg-orange-50 transition"
        >
          {expanded ? "Show Less" : "View Details"}
        </button>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed">{job.desc}</p>

      {expanded && (
        <div>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Requirements</p>
          <ul className="space-y-1.5">
            {job.requirements.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-1 border-t border-gray-50">
        <Link
          to="/contact"
          className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
        >
          Apply via Contact Page <FiArrowRight />
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">
          Email your CV with the subject: <span className="font-medium text-gray-500">"{job.title} — Application"</span>
        </p>
      </div>
    </div>
  );
};

const Careers = () => {
  const [dept, setDept] = useState("All");

  const visible = dept === "All" ? JOBS : JOBS.filter((j) => j.department === dept);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-14 px-4 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-3">Careers at ZyroMart</p>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">
              Join the Team Behind <br className="hidden md:block" /> Dhaka's Favourite Tech Store
            </h1>
            <p className="text-orange-100 text-sm md:text-base leading-relaxed max-w-md">
              We're always looking for driven, curious people who love technology and want to help build something great. Browse our open positions below.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "30+", label: "Years in Business" },
              { value: "50+", label: "Team Members" },
              { value: "3",   label: "Office Locations" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-orange-100 mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 space-y-14">

        {/* Perks */}
        <section>
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Why Work Here</p>
            <h2 className="text-2xl font-extrabold text-gray-800">What We Offer</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
                <div className="p-2.5 bg-orange-50 rounded-xl h-fit">{p.icon}</div>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">{p.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Open Positions</p>
              <h2 className="text-2xl font-extrabold text-gray-800">
                {visible.length} Role{visible.length !== 1 ? "s" : ""} Available
              </h2>
            </div>
            {/* Department filter */}
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDept(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    dept === d
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <FiBriefcase className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No open positions in this department right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {visible.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </section>

        {/* Spontaneous application */}
        <section className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-10 text-center text-white shadow-md">
          <h2 className="text-xl font-extrabold mb-2">Don't See Your Role?</h2>
          <p className="text-orange-100 text-sm max-w-md mx-auto mb-6">
            We're always open to hearing from talented people. Send us your CV and a short note about yourself — we'll keep your profile on file.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-orange-600 text-sm font-bold rounded-xl hover:bg-orange-50 transition"
          >
            Send a Spontaneous Application <FiArrowRight />
          </Link>
        </section>

      </div>
    </div>
  );
};

export default Careers;
