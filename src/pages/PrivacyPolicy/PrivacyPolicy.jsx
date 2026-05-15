import { Link } from "react-router-dom";
import { FiShield } from "react-icons/fi";

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
    id: "collection",
    title: "1. Information We Collect",
    content: (
      <>
        <p>We collect information you provide directly to us when you create an account, place an order, or contact us for support. This includes:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Name, email address, and password</li>
          <li>Billing and shipping addresses</li>
          <li>Payment information (processed securely — we do not store card numbers)</li>
          <li>Phone number and order history</li>
          <li>Messages you send us through contact forms or chat</li>
        </ul>
        <p>We also automatically collect certain information when you visit our website, including your IP address, browser type, pages visited, and device identifiers through cookies and similar tracking technologies.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Process and fulfill your orders and send related notifications</li>
          <li>Create and manage your account</li>
          <li>Respond to your comments, questions, and customer service requests</li>
          <li>Send promotional communications (with your consent)</li>
          <li>Monitor and analyze usage trends to improve our platform</li>
          <li>Detect and prevent fraudulent transactions and other illegal activities</li>
          <li>Comply with legal obligations</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "3. Sharing of Information",
    content: (
      <>
        <p>We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li><strong>Vendors:</strong> When you purchase a product from a third-party vendor on our platform, we share your order details with them solely to fulfill the order.</li>
          <li><strong>Service providers:</strong> We work with third-party companies to help operate our platform (e.g., payment processors, delivery partners, cloud infrastructure). They access your data only as necessary to perform these functions.</li>
          <li><strong>Legal requirements:</strong> We may disclose information if required by law, court order, or government authority.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "4. Cookies & Tracking Technologies",
    content: (
      <>
        <p>We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Keep you signed in across sessions</li>
          <li>Remember your cart and wishlist</li>
          <li>Understand how you navigate our site</li>
          <li>Deliver relevant advertisements (if applicable)</li>
        </ul>
        <p>You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of our website.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "5. Data Security",
    content: (
      <p>We take reasonable technical and organisational measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. This includes using HTTPS encryption for all data transmitted between your browser and our servers. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
    ),
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: (
      <p>We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. If you close your account, we will delete or anonymise your personal information within 90 days, except where we are required to retain it for legal or regulatory purposes.</p>
    ),
  },
  {
    id: "rights",
    title: "7. Your Rights",
    content: (
      <>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your account and associated data</li>
          <li>Opt out of marketing communications at any time</li>
          <li>Lodge a complaint with a data protection authority</li>
        </ul>
        <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@zyromart.com" className="text-orange-600 hover:underline">privacy@zyromart.com</a>.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    content: (
      <p>Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately and we will delete it promptly.</p>
    ),
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: (
      <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your information.</p>
    ),
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: (
      <p>
        If you have any questions or concerns about this Privacy Policy or our data practices, please{" "}
        <Link to="/contact" className="text-orange-600 hover:underline font-medium">contact us</Link>{" "}
        or email us directly at{" "}
        <a href="mailto:privacy@zyromart.com" className="text-orange-600 hover:underline">privacy@zyromart.com</a>.
      </p>
    ),
  },
];

const TOC = SECTIONS.map((s) => ({ id: s.id, title: s.title }));

const PrivacyPolicy = () => (
  <div className="bg-gray-50 min-h-screen pb-16">

    {/* Hero */}
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 px-4 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FiShield className="text-3xl opacity-90" />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        </div>
        <p className="text-orange-100 text-sm md:text-base mt-1">
          Last updated: <span className="font-semibold">{LAST_UPDATED}</span>
        </p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Table of contents — sticky sidebar */}
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
            At ZyroMart, your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read it carefully.
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

export default PrivacyPolicy;
