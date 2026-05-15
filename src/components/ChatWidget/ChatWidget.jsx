import { useState, useEffect, useRef } from "react";
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";

// ── Bot knowledge base ────────────────────────────────────────────────────────
const BOT_RULES = [
  {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy"],
    reply: "Hello! 👋 Great to see you at ZyroMart! I'm your virtual assistant. Ask me anything about products, shipping, returns, or payments!",
  },
  {
    keywords: ["ship", "delivery", "deliver", "arrive", "when will", "how long", "dispatch", "courier"],
    reply: "🚚 Delivery options:\n• **Standard** — 3–5 business days, FREE on orders over ৳3,000\n• **Express** — 1–2 business days for ৳150\n\nOrders are processed within 24 hours on business days.",
  },
  {
    keywords: ["return", "refund", "exchange", "replace", "send back", "money back"],
    reply: "↩️ **Return Policy:**\n• 7-day hassle-free returns\n• Item must be unused with original packaging\n• Refunds processed in 5–7 business days\n\nTo initiate a return, go to **My Orders** in your Profile.",
  },
  {
    keywords: ["pay", "payment", "cash", "cod", "card", "stripe", "online payment", "bkash", "method"],
    reply: "💳 **Payment Methods:**\n• Cash on Delivery (COD)\n• Credit / Debit Cards via Stripe (100% secure)\n\nAll card transactions are encrypted and safe.",
  },
  {
    keywords: ["warranty", "guarantee", "broken", "damaged", "defect", "faulty"],
    reply: "🛡️ All products carry the **manufacturer's warranty** — duration varies by product (check the product page).\n\nFor damaged items received, contact us within **48 hours** of delivery.",
  },
  {
    keywords: ["track", "where is my", "order status", "my order", "order number", "parcel"],
    reply: "📦 To track your order:\n1. Open **My Profile**\n2. Click **My Orders**\n3. Select the order to view real-time status\n\nNeed more help? Share your Order ID and our team will look into it.",
  },
  {
    keywords: ["cancel", "cancellation", "stop order", "cancel order"],
    reply: "❌ **Cancellation:**\n• Orders can be cancelled before they are processed\n• Go to **My Orders → Cancel Order**\n• Already shipped? You'll need to return it after delivery.",
  },
  {
    keywords: ["discount", "coupon", "promo", "offer", "sale", "deal", "voucher", "code"],
    reply: "🏷️ We regularly run exclusive deals! Check our **Homepage** banners and the **Online Exclusive** section for the latest offers.\n\nTip: Orders over ৳3,000 get **free shipping** automatically!",
  },
  {
    keywords: ["contact", "phone", "call", "support", "human", "agent", "talk", "speak", "representative"],
    reply: "📞 **Contact Us:**\n• Phone: **09727-070118**\n• Visit your nearest ZyroMart store (see Store Locator)\n\nOr keep chatting — I'll do my best to help right now!",
  },
  {
    keywords: ["store", "location", "branch", "showroom", "address", "near me", "offline"],
    reply: "📍 We have multiple store locations! Click **Store Locator** in the navigation menu to find the ZyroMart nearest to you, complete with address and hours.",
  },
  {
    keywords: ["account", "register", "sign up", "create account", "password", "forgot", "reset"],
    reply: "👤 **Account Help:**\n• **New here?** Click Login → Sign Up to create your account\n• **Forgot password?** Use the Forgot Password link on the login page\n• **Update info?** Go to My Profile after signing in",
  },
  {
    keywords: ["wishlist", "save", "favorite", "favourite", "saved", "heart"],
    reply: "❤️ Save any product to your **Wishlist** by clicking the heart icon on the product page. Access all saved items from the heart icon in the top navigation!",
  },
  {
    keywords: ["vendor", "sell", "seller", "shop", "become", "merchant", "partner"],
    reply: "🏪 **Become a ZyroMart Seller!**\nGo to **My Profile → Become a Vendor**, fill in your shop details, and our team will review your application. Start selling to thousands of buyers!",
  },
  {
    keywords: ["price", "cost", "how much", "budget", "affordable", "expensive", "cheap"],
    reply: "💰 Our prices are updated daily to stay competitive! Use the **price filter** on the product listing page to find items within your budget. Discounts are shown directly on product cards.",
  },
  {
    keywords: ["emi", "installment", "monthly", "pay later", "loan"],
    reply: "💳 **EMI Options** are available on select products! Check the product page — if EMI is available, you'll see monthly installment options (3, 6, 12 months etc.) right on the page.",
  },
  {
    keywords: ["cart", "bag", "add to cart", "basket"],
    reply: "🛒 Adding to cart is easy — just click **Add to Cart** on any product page. You can review your cart anytime by clicking the cart icon in the top navigation.",
  },
  {
    keywords: ["brand", "apple", "samsung", "xiaomi", "oppo", "realme", "oneplus", "google", "pixel"],
    reply: "📱 We carry all major brands — Apple, Samsung, Xiaomi, Oppo, Realme, OnePlus, Google, and many more!\n\nUse the **Brand filter** on the products page to browse by your preferred brand.",
  },
  {
    keywords: ["review", "rating", "feedback", "comment"],
    reply: "⭐ You can leave a review on any product you've purchased! Go to the product page, scroll to the **Reviews** tab, and click **Write a Review**. Your honest feedback helps other shoppers!",
  },
  {
    keywords: ["thank", "thanks", "appreciate", "great", "awesome", "perfect", "helpful", "good"],
    reply: "😊 You're so welcome! Is there anything else I can help you with today?",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later", "done", "no thanks", "nothing"],
    reply: "👋 Thanks for chatting with ZyroMart! Have a wonderful shopping experience. Come back anytime — I'm always here!",
  },
];

const FALLBACK_REPLIES = [
  "Hmm, I'm not 100% sure about that! 🤔 Could you rephrase? Or call us at **09727-070118** for direct help.",
  "I didn't quite catch that. Try asking about shipping, returns, payments, or orders — I'm great at those! 😊",
  "That one's a little tricky for me! For complex questions, our team at **09727-070118** can help you best.",
];

let fallbackIndex = 0;

function getBotReply(message) {
  const lower = message.toLowerCase().trim();
  for (const { keywords, reply } of BOT_RULES) {
    if (keywords.some((kw) => lower.includes(kw))) return reply;
  }
  const reply = FALLBACK_REPLIES[fallbackIndex % FALLBACK_REPLIES.length];
  fallbackIndex++;
  return reply;
}

// Render bot reply with basic markdown bold (**text**)
function BotText({ text }) {
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

// ── Main Widget ───────────────────────────────────────────────────────────────
const WELCOME = "Hi there! 👋 Welcome to **ZyroMart**! I'm your virtual shopping assistant. How can I help you today?";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-open after 3s on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);
    const openTimer = setTimeout(() => {
      if (!hasOpened) {
        setOpen(true);
        setHasOpened(true);
        setMessages([{ from: "bot", text: WELCOME, id: Date.now() }]);
      }
    }, 3500);
    return () => { clearTimeout(timer); clearTimeout(openTimer); };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setShowBubble(false);
    if (!hasOpened) {
      setHasOpened(true);
      setMessages([{ from: "bot", text: WELCOME, id: Date.now() }]);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { from: "user", text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const reply = getBotReply(text);
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: reply, id: Date.now() }]);
    }, delay);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const sendQuick = (text) => {
    const userMsg = { from: "user", text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    const delay = 800 + Math.random() * 500;
    setTimeout(() => {
      const reply = getBotReply(text);
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: reply, id: Date.now() }]);
    }, delay);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 lg:bottom-6 lg:right-6">
          {showBubble && (
            <div className="bg-white border border-gray-200 rounded-2xl rounded-br-sm shadow-xl px-4 py-2.5 text-sm text-gray-700 max-w-[200px] animate-bounce-soft">
              Hi! Need help? 👋
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-0 border-t-8 border-l-transparent border-t-white" />
            </div>
          )}
          <button
            onClick={handleOpen}
            className="w-14 h-14 rounded-full bg-orange-500 text-white shadow-2xl flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all duration-200 relative"
            aria-label="Open chat"
          >
            <FiMessageCircle size={26} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
          </button>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className={`fixed z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300
            bottom-20 right-2 left-2
            sm:left-auto sm:right-4 sm:w-80
            lg:bottom-6 lg:right-6 lg:w-96
            ${minimized ? "h-14 overflow-hidden" : "h-[500px] sm:h-[520px]"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-orange-500 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
                <BsRobot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">ZyroBot</p>
                <p className="text-orange-100 text-xs flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                  Online · Always ready
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized((m) => !m)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-orange-400 transition"
                aria-label="Minimize"
              >
                <FiMinimize2 size={15} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-orange-400 transition"
                aria-label="Close"
              >
                <FiX size={17} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}
                  >
                    {msg.from === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BsRobot size={14} className="text-orange-500" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-orange-500 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                      }`}
                    >
                      {msg.from === "bot" ? <BotText text={msg.text} /> : msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex justify-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <BsRobot size={14} className="text-orange-500" />
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-2 bg-gray-300 rounded-full inline-block animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length <= 1 && (
                <div className="px-3 pb-2 bg-gray-50 flex gap-2 flex-wrap">
                  {["Shipping info", "Return policy", "Track order", "Contact us"].map((s) => (
                    <button
                      key={s}
                      onClick={() => sendQuick(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-orange-300 text-orange-600 bg-white hover:bg-orange-50 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-3 py-3 border-t border-gray-100 bg-white rounded-b-2xl flex-shrink-0">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message…"
                    className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || typing}
                    className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    aria-label="Send"
                  >
                    <FiSend size={14} />
                  </button>
                </div>
                <p className="text-center text-gray-400 text-[10px] mt-1.5">
                  Powered by ZyroBot · 24/7 Support
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
