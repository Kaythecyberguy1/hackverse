import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", category: "web", description: "", flag: "", points: 100 });
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true); setError(null);
    try { const data = await api.list("challenges"); setChallenges(data || []); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  function onChange(e) {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); setError(null);
    try {
      // SECURITY: Do not store plaintext flags in a public DB. Hash & verify server-side.
      const payload = { ...form, createdAt: new Date().toISOString() };
      const saved = await api.create("challenges", payload);
      setChallenges(prev => [saved, ...prev]);
      setForm({ title: "", category: "web", description: "", flag: "", points: 100 });
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Challenges</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Create Challenge</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" required className="w-full p-2 border rounded" />
            <select name="category" value={form.category} onChange={onChange} className="w-full p-2 border rounded">
              <option value="web">Web</option>
              <option value="crypto">Crypto</option>
              <option value="forensics">Forensics</option>
              <option value="pwn">Pwn</option>
              <option value="misc">Misc</option>
            </select>
            <textarea name="description" value={form.description} onChange={onChange} placeholder="Description / hint" className="w-full p-2 border rounded" />
            <input name="flag" value={form.flag} onChange={onChange} placeholder="FLAG{...} (hash on server)" className="w-full p-2 border rounded" />
            <input name="points" type="number" value={form.points} onChange={onChange} min={0} className="w-full p-2 border rounded" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white">Create Challenge</button>
          </form>
          <p className="text-xs mt-3 text-gray-500">Security: Always hash flags server-side; never expose plaintext flags publicly.</p>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            {loading && <p>Loading challenges...</p>}
            {!loading && challenges.length === 0 && <div className="border-dashed border-2 border-gray-200 rounded-lg p-6 text-center text-gray-500">No challenges yet — create one!</div>}
            {challenges.map(c => (
              <div key={c.id || c.title} className="p-4 border rounded-lg bg-white">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold">{c.title}</h4>
                    <p className="text-sm text-gray-500">{c.description}</p>
                    <div className="mt-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-gray-100">{c.category}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-50 ml-2">{c.points} pts</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
