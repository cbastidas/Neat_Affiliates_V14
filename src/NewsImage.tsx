import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function NewsImage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("visible", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading news:", error.message);
      } else {
        setNews(data || []);
      }

      setLoading(false);
    };

    fetchNews();
  }, []);

  return (
    <section
      id="News"
      className="py-16 mt-10 bg-white rounded-xl border shadow-sm px-6 max-w-4xl mx-auto
      border-transparent
      hover:border-purple-300
      hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
      transition-all 
      duration-300"
    >
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
        Latest News
      </h2>
      <p className="text-center text-gray-600 mb-8 hover:font-bold transition">
        Stay up to date with our latest updates and announcements.
      </p>

      {/* Loader */}
      {loading && (
        <p className="text-center text-gray-500">Loading news...</p>
      )}

      {/* No news available */}
      {!loading && news.length === 0 && (
        <p className="text-center text-gray-700 text-lg hover:text-purple-700 transition">
          No news available at the moment. Please check back soon! 😊
        </p>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
        {news.map((item) => (
          <div
            key={item.id}
            className="w-full rounded-xl overflow-hidden shadow hover:shadow-lg transition border bg-gray-50"
          >
            <img
              src={item.image_url}
              alt="News"
              className="w-full h-56 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
