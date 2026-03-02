import { useEffect, useRef, useState } from "react";
import type { SupportBrand } from "./ContactSupportModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  brand: SupportBrand | null;
};

// Brand-based configuration (one modal, multiple behaviors)
const BRAND_CONFIG: Record<
  SupportBrand,
  { title: string; description: string; emailTo: string; subject: string }
> = {
  bluffbet: {
    title: "Bluffbet Email Support",
    description: "Send a message to Bluffbet support via email.",
    emailTo: "support@bluffbet.com",
    subject: "Bluffbet Support Request",
  },
  vidavegas: {
    title: "Vidavegas Email Support",
    description: "Send a message to Vidavegas support via email.",
    emailTo: "support@vidavegas.com",
    subject: "Vidavegas Support Request",
  },
  jackburst: {
    title: "Jackburst Email Support",
    description: "Send a message to Jackburst support via email.",
    emailTo: "support@jackburst.com",
    subject: "Jackburst Support Request",
  },
};

export default function ContactEmailModal({ isOpen, onClose, brand }: Props) {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setQuestion("");
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Close modal with ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const brandData = brand ? BRAND_CONFIG[brand] : null;

  const validate = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!question.trim()) {
      return "Please write your question.";
    }
    if (!brandData) {
      return "Brand support channel not available.";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    if (!brandData) return;

    // Build mailto (simple + reliable)
    const subjectEnc = encodeURIComponent(brandData.subject);
    const bodyEnc = encodeURIComponent(`Customer email: ${email}\n\nQuestion:\n${question}\n`);

    window.location.href = `mailto:${brandData.emailTo}?subject=${subjectEnc}&body=${bodyEnc}`;

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-start"
      onClick={(e) => {
        // Close when clicking outside the dialog
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="bg-white shadow-xl relative p-6 animate-slideInLeft
                   rounded-2xl
                   w-full max-w-[360px] mx-auto
                   md:w-[380px] md:mx-0"
        role="dialog"
        style={{
          marginTop: "40px",
          marginBottom: "20px",
          borderRadius: "20px",
          ...(window.innerWidth >= 768 && { marginLeft: "20px" }),
        }}
        aria-modal="true"
        aria-labelledby="email-support-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h3 id="email-support-title" className="text-xl font-bold mb-1 text-center">
          {brandData ? brandData.title : "Email Support"}
        </h3>

        <p className="text-center text-gray-600 mb-5">
          {brandData ? brandData.description : "Send a message via email."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your email <span className="text-red-600">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your question <span className="text-red-600">*</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 h-28 resize-vertical focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write your question here…"
              required
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Send Email ✉️
          </button>
        </form>
      </div>
    </div>
  );
}
