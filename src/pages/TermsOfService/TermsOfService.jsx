import { Link } from "react-router-dom";
import { FiFileText } from "react-icons/fi";

const LAST_UPDATED = "1 January 2025";

const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-6">
    <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
      <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
      {title}
    </h2>
    <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
  </section>
);

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <p>By accessing or using the ZyroMart website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. These terms apply to all visitors, users, vendors, and others who access the service.</p>
    ),
  },
  {
    id: "accounts",
    title: "2. User Accounts",
    content: (
      <>
        <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorised use of your account</li>
        </ul>
        <p>We reserve the right to terminate accounts that contain false information, violate these terms, or engage in fraudulent activity.</p>
      </>
    ),
  },
  {
    id: "products",
    title: "3. Products & Listings",
    content: (
      <>
        <p>ZyroMart is a marketplace that connects buyers with vendors. We make every effort to display product information accurately, including descriptions, prices, and images. However:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Product colours may vary slightly from what is displayed on screen</li>
          <li>We reserve the right to limit quantities of any product</li>
          <li>We reserve the right to discontinue any product at any time</li>
          <li>Vendor-listed products are the responsibility of the respective vendor</li>
        </ul>
      </>
    ),
  },
  {
    id: "orders",
    title: "4. Orders & Payment",
    content: (
      <>
        <p>By placing an order you are making an offer to purchase a product. We reserve the right to refuse or cancel any order for reasons including product unavailability, errors in product or pricing information, or suspected fraud.</p>
        <p>Payment must be made in full at the time of order. We accept major credit/debit cards and other payment methods displayed at checkout. All prices are listed in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise.</p>
      </>
    ),
  },
  {
    id: "shipping",
    title: "5. Shipping & Delivery",
    content: (
      <>
        <p>Estimated delivery times are provided as a guideline and are not guaranteed. Delivery times may be affected by factors outside our control such as courier delays, weather conditions, or public holidays.</p>
        <p>Risk of loss and title for items purchased pass to you upon delivery to the carrier. We are not responsible for delays once a package has been handed to the carrier.</p>
      </>
    ),
  },
  {
    id: "returns",
    title: "6. Returns & Refunds",
    content: (
      <>
        <p>We offer a <strong>7-day return policy</strong> for most items. To be eligible for a return, items must be:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Unused and in the same condition as received</li>
          <li>In original packaging with all accessories included</li>
          <li>Accompanied by a receipt or proof of purchase</li>
        </ul>
        <p>Certain items such as opened software, digital downloads, and hygiene products are non-returnable. Refunds are processed within 7–10 business days after we receive and inspect the returned item.</p>
      </>
    ),
  },
  {
    id: "vendor",
    title: "7. Vendor Terms",
    content: (
      <>
        <p>Vendors who sell on the ZyroMart platform agree to:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Provide accurate and complete product information</li>
          <li>Fulfil orders in a timely manner</li>
          <li>Not list counterfeit, illegal, or prohibited products</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Maintain customer service standards set by ZyroMart</li>
        </ul>
        <p>ZyroMart reserves the right to remove vendor listings, suspend, or permanently ban vendors who violate these terms.</p>
      </>
    ),
  },
  {
    id: "ip",
    title: "8. Intellectual Property",
    content: (
      <p>The ZyroMart name, logo, website design, and all content including text, images, graphics, and software are the exclusive property of ZyroMart and are protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.</p>
    ),
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: (
      <p>To the fullest extent permitted by law, ZyroMart and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, products, or inability to access our website. Our total liability to you for any claim shall not exceed the amount you paid for the specific product or service giving rise to the claim.</p>
    ),
  },
  {
    id: "prohibited",
    title: "10. Prohibited Activities",
    content: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Use the service for any unlawful purpose or in violation of these terms</li>
          <li>Attempt to gain unauthorised access to any part of the platform</li>
          <li>Post false, misleading, or fraudulent reviews</li>
          <li>Use automated tools to scrape or access the platform without permission</li>
          <li>Engage in any activity that disrupts or interferes with our services</li>
        </ul>
      </>
    ),
  },
  {
    id: "governing",
    title: "11. Governing Law",
    content: (
      <p>These Terms of Service shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.</p>
    ),
  },
  {
    id: "changes",
    title: "12. Changes to Terms",
    content: (
      <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of the platform after any changes constitutes your acceptance of the new terms. We encourage you to review these terms periodically.</p>
    ),
  },
  {
    id: "contact",
    title: "13. Contact Us",
    content: (
      <p>
        If you have questions about these Terms of Service, please{" "}
        <Link to="/contact" className="text-orange-600 hover:underline font-medium">contact us</Link>{" "}
        or email us at{" "}
        <a href="mailto:legal@zyromart.com" className="text-orange-600 hover:underline">legal@zyromart.com</a>.
      </p>
    ),
  },
];

const TOC = SECTIONS.map((s) => ({ id: s.id, title: s.title }));

const TermsOfService = () => (
  <div className="bg-gray-50 min-h-screen pb-16">

    {/* Hero */}
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 px-4 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FiFileText className="text-3xl opacity-90" />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Terms of Service</h1>
        </div>
        <p className="text-orange-100 text-sm md:text-base mt-1">
          Last updated: <span className="font-semibold">{LAST_UPDATED}</span>
        </p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Table of contents */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</p>
            <ul className="space-y-2">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-xs text-gray-500 hover:text-orange-600 transition-colors block leading-snug"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-7 md:p-10">
          <p className="text-sm text-gray-500 leading-relaxed mb-8 pb-6 border-b border-gray-100">
            Please read these Terms of Service carefully before using the ZyroMart website and services. These terms govern your use of our platform and constitute a legally binding agreement between you and ZyroMart.
          </p>

          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <Section key={s.id} id={s.id} title={s.title}>
                {s.content}
              </Section>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default TermsOfService;
