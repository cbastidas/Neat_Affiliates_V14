import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import LoginSignupModal from "./LoginSignupModal";

interface WhyJoinItem {
  id: string;
  title: string;
  description: string;
  emoji_url: string;
  order: number;
}

export default function WhyJoin() {
  const [items, setItems] = useState<WhyJoinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<"login" | "signup" | null>(null);

  // ------------------------------------------------------------
  // Load all cards directly from Supabase
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchWhyJoinItems = async () => {
      const { data, error } = await supabase
        .from("why_join")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error loading Why Join cards:", error.message);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    };

    fetchWhyJoinItems();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Loading Why Join section...
      </p>
    );
  }

  // ------------------------------------------------------------
  // Animation keyframes (slide from left)
  // ------------------------------------------------------------
  const cardAnimation = `
    @keyframes slideIn {
      0% {
        opacity: 0;
        transform: translateX(-40px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;

  return (
    <>
      {/* Inject animation into page */}
      <style>{cardAnimation}</style>

      <section id="WhyJoin" className="py-16 bg-white rounded-2xl border">
        <div className="max-w-6xl mx-auto px-4">

          {/* ------------------------------------------------------------
              Section Header
          ------------------------------------------------------------ */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Why Join Neat Affiliates?
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Top reasons why affiliates love working with us
          </p>

          {/* ------------------------------------------------------------
              MOBILE VERSION — 1 card per row
          ------------------------------------------------------------ */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 bg-white shadow-sm rounded-lg border border-gray-200 flex items-start gap-3 opacity-0"
                style={{
                  animation: "slideIn 1.2s ease-out forwards",
                  animationDelay: `${index}s`,
                }}
              >
                {/* Icon */}
                {item.emoji_url && (
                  <img
                    src={item.emoji_url}
                    alt="Icon"
                    className="mt-1 flex-shrink-0"
                    style={{ width: 32, height: 32 }}
                  />
                )}

                {/* Title + Description */}
                <div>
                  <h3 className="text-gray-800 font-semibold text-sm mb-1">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-xs leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ------------------------------------------------------------
              DESKTOP VERSION — 3 columns
          ------------------------------------------------------------ */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="
                  p-8 bg-white shadow-md rounded-xl border border-gray-200
                  hover:shadow-lg hover:border-purple-300 transition text-center opacity-0
                "
                style={{
                  animation: "slideIn 1.2s ease-out forwards",
                  animationDelay: `${index}s`,
                }}
              >
                {/* Icon */}
                {item.emoji_url && (
                  <img
                    src={item.emoji_url}
                    alt="Icon"
                    className="mx-auto mb-4"
                    style={{ width: 60, height: 60 }}
                  />
                )}

                {/* Title */}
                <h3 className="text-gray-800 font-bold text-lg mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm px-4 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* ------------------------------------------------------------
              CTA BUTTON
          ------------------------------------------------------------ */}
          <div className="text-center mt-12">
            <button
              onClick={() => setModalType("signup")}
              className="
                text-xl font-bold px-6 py-3 rounded-full
                bg-purple-600 text-white hover:bg-purple-800
                shadow-lg transition
              "
            >
              Join Neat Affiliates
            </button>
          </div>

          {modalType && (
            <LoginSignupModal
              isOpen={true}
              type={modalType}
              onClose={() => setModalType(null)}
              onInstance1Signup={() => {}}
              onInstance2Signup={() => {}}
              onInstanceVidavegasBrSignup={() => {}}
              onBluffbetSignup={() => {}}
              onVidavegasLatamSignup={() => {}}
              onJackburstSignup={() => {}}
            />
          )}
        </div>
      </section>
    </>
  );
}
