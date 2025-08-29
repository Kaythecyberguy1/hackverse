import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function LabPage() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", difficulty: "Beginner", summary: "", tags: "" });
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true); setError(null);
    try {
      const data = await api.list("labs");
      setLabs(data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        title: form.title,
        difficulty: form.difficulty,
        summary: form.summary,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString()
      };
      const saved = await api.create("labs", payload);
      setLabs(prev => [saved, ...prev]);
      setForm({ title: "", difficulty: "Beginner", summary: "", tags: "" });
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Labs</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Create Lab</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" required className="w-full p-2 border rounded" />
            <select name="difficulty" value={form.difficulty} onChange={onChange} className="w-full p-2 border rounded">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <textarea name="summary" value={form.summary} onChange={onChange} placeholder="Short summary" className="w-full p-2 border rounded" />
            <input name="tags" value={form.tags} onChange={onChange} placeholder="comma,separated" className="w-full p-2 border rounded" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white">Create Lab</button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            {loading && <p>Loading labs...</p>}
            {!loading && labs.length === 0 && (
              <div className="border-dashed border-2 border-gray-200 rounded-lg p-6 text-center text-gray-500">No labs yet — create one!</div>
            )}
            {labs.map(l => (
              <div key={l.id || l.title} className="p-4 border rounded-lg bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{l.title}</h4>
                    <p className="text-sm text-gray-500">{l.summary}</p>
                    <div className="mt-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-gray-100 mr-2">{l.difficulty}</span>
                      {(l.tags || []).map((t, i) => <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-50 mr-2">#{t}</span>)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(l.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
