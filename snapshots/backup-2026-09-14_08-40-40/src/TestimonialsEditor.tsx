import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

interface TestimonialRow {
  id: string;
  title: string;
  content: string;
  link: string;
}

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTestimonial, setEditedTestimonial] = useState<Partial<TestimonialRow>>({});
  const [newTestimonial, setNewTestimonial] = useState({ title: "", link: "", content: "" });

  // Load testimonials from Supabase
  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching testimonials:", error);
      return;
    }

    setTestimonials(data || []);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAdd = async () => {
    // Basic validation (optional)
    if (!newTestimonial.title.trim() || !newTestimonial.content.trim()) {
      alert("Title and Content are required.");
      return;
    }

    const { error } = await supabase.from("testimonials").insert({
      title: newTestimonial.title,
      content: newTestimonial.content,
      link: newTestimonial.link || null,
    });

    if (error) {
      console.error("Error adding testimonial:", error);
      alert("Error adding testimonial");
      return;
    }

    setNewTestimonial({ title: "", link: "", content: "" });
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      console.error("Error deleting testimonial:", error);
      alert("Error deleting testimonial");
      return;
    }

    fetchTestimonials();
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase.from("testimonials").update(editedTestimonial).eq("id", id);

    if (error) {
      console.error("Error updating testimonial:", error);
      alert("Error updating testimonial");
      return;
    }

    setEditingId(null);
    setEditedTestimonial({});
    fetchTestimonials();
  };

  return (
    <section id="TestimonialsEditor" className="p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">📝 Edit Testimonials</h2>

      {/* Add new testimonial */}
      <div className="flex flex-col gap-2 max-w-md mb-8">
        <input
          type="text"
          placeholder="Title *"
          value={newTestimonial.title}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Page Link (optional)"
          value={newTestimonial.link || ""}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, link: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Content *"
          value={newTestimonial.content}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
          className="border px-3 py-2 rounded min-h-[110px]"
        />

        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-fit"
        >
          ➕ Add Testimonial
        </button>
      </div>

      {/* Existing testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white shadow rounded p-4 border">
            {editingId === t.id ? (
              <>
                <input
                  type="text"
                  value={editedTestimonial.title || ""}
                  onChange={(e) => setEditedTestimonial({ ...editedTestimonial, title: e.target.value })}
                  className="w-full border px-2 py-1 mb-2 rounded"
                  placeholder="Title"
                />

                <input
                  type="text"
                  placeholder="Page Link (optional)"
                  value={editedTestimonial.link || ""}
                  onChange={(e) => setEditedTestimonial({ ...editedTestimonial, link: e.target.value })}
                  className="w-full border px-2 py-1 mb-2 rounded"
                />

                <textarea
                  value={editedTestimonial.content || ""}
                  onChange={(e) => setEditedTestimonial({ ...editedTestimonial, content: e.target.value })}
                  className="w-full border px-2 py-1 mb-3 rounded min-h-[110px]"
                  placeholder="Content"
                />

                <div className="flex gap-3">
                  <button onClick={() => handleSave(t.id)} className="text-green-600 font-semibold">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-1">{t.title}</h3>

                {/* Clickable link (only if exists) */}
                {t.link && (
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline text-sm block mb-2"
                  >
                    Visit Page →
                  </a>
                )}

                <p className="text-gray-700 mb-3">{t.content}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(t.id);
                      setEditedTestimonial({ title: t.title, content: t.content, link: t.link });
                    }}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDelete(t.id)} className="text-red-600 font-semibold">
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
