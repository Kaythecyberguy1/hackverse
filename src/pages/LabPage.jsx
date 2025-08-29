import React, { useEffect, useState } from "react";

export default function LabPage() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/labs", {
      headers: { Authorization: "Bearer hackverse-secret-token" },
    })
      .then((res) => res.json())
      .then((data) => setLabs(data))
      .catch((err) => console.error("API error:", err));
  }, []);

  const launchLab = async (labName) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:8080/api/labs/start/${labName}`, {
        method: "POST",
        headers: {
          Authorization: "Bearer hackverse-secret-token",
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${labName} started → ${data.url}`);
      } else {
        setMessage(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Error connecting to backend.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400">
        🔥 Hackverse Labs
      </h1>

      {labs.length === 0 ? (
        <p className="text-center text-gray-400">No labs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <div
              key={lab.name}
              className="p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-700 hover:border-blue-500 transition"
            >
              <h2 className="text-2xl font-bold text-blue-300">{lab.name}</h2>
              <p className="mt-2 text-gray-400 text-sm">{lab.description}</p>
              <button
                onClick={() => launchLab(lab.name)}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg w-full"
              >
                {loading ? "Launching..." : "Launch Lab"}
              </button>
            </div>
          ))}
        </div>
      )}

      {message && (
        <p className="mt-6 text-center text-lg font-semibold">{message}</p>
      )}
    </div>
  );
}
