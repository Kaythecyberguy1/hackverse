import React, { useEffect, useState } from "react";
import "../assets/css/ChallengePage.css";

export default function ChallengePage() {
  const [labs, setLabs] = useState([
    { name: "dvwa", description: "Damn Vulnerable Web App" },
    { name: "bwapp", description: "Buggy Web App" },
    { name: "juice-shop", description: "OWASP Juice Shop" },
  ]); // fallback mock data

  const [labUrls, setLabUrls] = useState({});
  const [flags, setFlags] = useState({});
  const [loading, setLoading] = useState(false);

  // Try fetching labs from backend
  useEffect(() => {
    async function fetchLabs() {
      try {
        const res = await fetch("http://localhost:8080/api/labs", {
          headers: { Authorization: "Bearer hackverse-secret-token" },
        });
        if (res.ok) {
          const data = await res.json();
          setLabs(data);
        }
      } catch (err) {
        console.log("Backend not running, using mock data");
      }
    }
    fetchLabs();
  }, []);

  const startLab = async (name) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/labs/start/${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer hackverse-secret-token",
        },
      });
      const data = await res.json();
      setLabUrls((prev) => ({ ...prev, [name]: data.url }));
    } catch (err) {
      alert("Error starting lab, backend might be down");
    }
    setLoading(false);
  };

  const submitFlag = async (name) => {
    try {
      const res = await fetch(`http://localhost:8080/api/labs/submit/${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer hackverse-secret-token",
        },
        body: JSON.stringify({ flag: flags[name] || "" }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("Error submitting flag");
    }
  };

  return (
    <div className="challenge-page">
      <h1 className="text-4xl font-bold text-center mb-8">
        🔥 Hackverse Challenges
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <div key={lab.name} className="challenge-card p-6">
            <h2 className="text-xl font-semibold mb-2">{lab.name}</h2>
            <p className="text-gray-400 mb-4">{lab.description}</p>

            {!labUrls[lab.name] ? (
              <button
                onClick={() => startLab(lab.name)}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-800"
              >
                🚀 Start Lab
              </button>
            ) : (
              <div>
                <p className="text-green-400 mb-2">
                  ✅ Running at:{" "}
                  <a
                    href={labUrls[lab.name]}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-400"
                  >
                    {labUrls[lab.name]}
                  </a>
                </p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter flag"
                    className="flex-1 p-2 rounded bg-gray-800 text-white"
                    value={flags[lab.name] || ""}
                    onChange={(e) =>
                      setFlags((prev) => ({ ...prev, [lab.name]: e.target.value }))
                    }
                  />
                  <button
                    onClick={() => submitFlag(lab.name)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-800 rounded-xl"
                  >
                    🏁 Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
