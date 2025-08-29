import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function CTFPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", difficulty: "Beginner" });
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true); setError(null);
    try { const data = await api.list("ctfs"); setRooms(data || []); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  function onChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault(); setError(null);
    try {
      const payload = { ...form, createdAt: new Date().toISOString() };
      const saved = await api.create("ctfs", payload);
      setRooms(prev => [saved, ...prev]);
      setForm({ title: "", description: "", difficulty: "Beginner" });
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">CTF Rooms</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Create Room</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" required className="w-full p-2 border rounded" />
            <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full p-2 border rounded" />
            <select name="difficulty" value={form.difficulty} onChange={onChange} className="w-full p-2 border rounded">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white">Create Room</button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            {loading && <p>Loading rooms...</p>}
            {!loading && rooms.length === 0 && <div className="border-dashed border-2 border-gray-200 rounded-lg p-6 text-center text-gray-500">No rooms yet — create one!</div>}
            {rooms.map(r => (
              <div key={r.id || r.title} className="p-4 border rounded-lg bg-white">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold">{r.title}</h4>
                    <p className="text-sm text-gray-500">{r.description}</p>
                    <div className="mt-2 text-xs"><span className="px-2 py-1 rounded-full bg-gray-100">{r.difficulty}</span></div>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
