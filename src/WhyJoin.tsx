import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import LoginSignupModal from "./LoginSignupModal";

interface WhyJoinItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  emoji_url: string;
}

export default function WhyJoin() {
  const [items, setItems] = useState<WhyJoinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<"login" | "signup" | null>(null);

  // ------------------------------------------------------------
  // Fetch items from Supabase
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
    return <p className="text-center text-gray-500">Loading Why Join section...</p>;
  }

  // ------------------------------------------------------------
  // Groups defined by TITLE (Option A: "group by title")
  // Each entry is an array of titles contained in the group
  // ------------------------------------------------------------
  const GROUPS = [
    [
      "Fiat and Crypto Payment method",
      "Monthly and Bi-monthly Payments"
    ],
    [
      "Known and trusted brands",
      "High Conversion Rate"
    ],
    [
      "High Commission Rates",
      "No negative carryover"
    ],
    [
      "Many brands with unique selling points",
      "24/7 support for players"
    ],
    [
      "Postbacks and real time tracking",
      "Transparent stats"
    ],
    [
      "Many creatives options"
    ],
  ];

  // ------------------------------------------------------------
  // Build final grouped structure using titles
  // ------------------------------------------------------------
  const grouped = GROUPS.map((groupTitles) => {
    // Find matching items by title (the order is defined by titles)
    const foundItems = groupTitles
      .map((t) => items.find((it) => it.title === t))
      .filter(Boolean) as WhyJoinItem[];

    return {
      // Use emoji of the first item found (per your rule)
      emoji: foundItems[0]?.emoji_url || "",
      // Titles rendered as bullets
      titles: groupTitles
    };
  });

  return (
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
    MOBILE VERSION — Ultra compact cards with emoji on the left
------------------------------------------------------------ */}
<div className="md:hidden grid grid-cols-1 gap-3">

  {grouped.map((group, index) => (
    <div
      key={index}
      className="
        p-2
        bg-white
        shadow-sm
        rounded-lg
        border border-gray-200
        flex
        items-start
        gap-3
      "
    >
      {/* Compact emoji on the left */}
      {group.emoji && (
        <img
          src={group.emoji}
          alt="Group icon"
          className="flex-shrink-0 mt-1"
          style={{ width: 30, height: 30 }}
        />
      )}

      {/* Bullet list on the right */}
      <ul className="space-y-1 leading-tight">
        {group.titles.map((t, i) => (
          <li key={i} className="flex items-start text-sm">
            <span className="mr-2 mt-1 text-purple-600 font-bold">•</span>
            <span className="text-gray-800 font-medium">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  ))}

</div>



        {/* ------------------------------------------------------------
            DESKTOP VERSION: 3 columns × 2 rows
            Each card contains 1 emoji + multiple bullet points
        ------------------------------------------------------------ */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {grouped.map((group, index) => (
            <div
              key={index}
              className="
                p-8
                bg-white
                shadow-md
                rounded-xl
                border border-gray-200
                hover:shadow-lg
                hover:border-purple-300
                transition
                text-center
              "
            >
              {/* Card Emoji */}
              {group.emoji && (
                <img
                  src={group.emoji}
                  alt="Group icon"
                  className="mx-auto mb-4"
                  style={{ width: 60, height: 60 }}
                />
              )}

              {/* Bullet Items */}
              <ul className="space-y-2 mt-2">
                {group.titles.map((t, i) => (
                  <li key={i} className="flex items-start justify-center">
                    <span className="mr-2 text-purple-600 font-bold">•</span>
                    <span className="text-gray-800 font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------
            CTA Button
        ------------------------------------------------------------ */}
        <div className="text-center mt-10">
          <button
            onClick={() => setModalType("signup")}
            className="text-xl font-bold px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-800 shadow-lg transition"
          >
            Join Neat Affiliates
          </button>
        </div>

            {modalType && (
             <LoginSignupModal
               isOpen={true}
               type={modalType}
               onClose={() => setModalType(null)}
               onInstance1Signup={() => {}}   // ← FIX
             />
           )}

      </div>
    </section>
  );
}
