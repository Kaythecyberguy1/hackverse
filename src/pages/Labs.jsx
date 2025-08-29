import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [status, setStatus] = useState({});
  const [instances, setInstances] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/labs")
      .then((res) => res.json())
      .then(setLabs);
  }, []);

  async function launchLab(slug) {
    setStatus((prev) => ({ ...prev, [slug]: "Launching..." }));
    try {
      const res = await fetch(`http://localhost:5000/api/labs/${slug}/start`, {
        method: "POST",
      });
      const data = await res.json();
      setInstances((prev) => ({ ...prev, [slug]: data.url }));
      setStatus((prev) => ({ ...prev, [slug]: "Running" }));
    } catch (err) {
      setStatus((prev) => ({ ...prev, [slug]: "Error" }));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Labs</h1>
      <ul className="space-y-6">
        {labs.map((lab) => (
          <li
            key={lab.slug}
            className="border border-white/10 bg-white/5 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold">{lab.name}</h2>
            <p className="text-white/70 mb-4">{lab.desc}</p>
            <p className="mb-2 text-sm text-indigo-300">
              Status: {status[lab.slug] || "Stopped"}
            </p>
            {instances[lab.slug] && (
              <a
                href={instances[lab.slug]}
                target="_blank"
                rel="noreferrer"
                className="text-green-400 hover:underline"
              >
                Open Instance →
              </a>
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => launchLab(lab.slug)}
                className="px-4 py-2 bg-indigo-500 rounded-lg font-semibold hover:bg-indigo-600"
              >
                Launch Lab
              </button>
              <Link
                to={`/labs/${lab.slug}`}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                Details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
