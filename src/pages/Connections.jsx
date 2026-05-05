import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Connections() {
  const [activeTab, setActiveTab] = useState("connections");
  const [githubData, setGithubData] = useState(null);

  const BACKEND_URL =
    "https://ci-optimization-dashboard-backend.onrender.com";

  const logout = () => {
    console.log("Logout");
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/github/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setGithubData(data))
      .catch(() => setGithubData({ connected: false }));
  }, []);

  const handleConnect = () => {
    window.location.href = `${BACKEND_URL}/api/auth/github`;
  };

  if (!githubData) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen text-[#4E342E] bg-gradient-to-br from-[#F8EDE3] to-[#C89F7A]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={logout} />
        <div className="p-8 space-y-8">
          <h2 className="text-2xl font-bold mb-6">GitHub Connection</h2>

          {!githubData.connected ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="mb-4">GitHub not connected.</p>
              <button
                onClick={handleConnect}
                className="bg-black text-white px-5 py-2 rounded-lg"
              >
                Connect GitHub
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <img
                src={githubData.user.avatar_url}
                alt="avatar"
                className="w-16 h-16 rounded-full mb-4"
              />
              <p><strong>Username:</strong> {githubData.user.login}</p>
              <p><strong>Repos:</strong> {githubData.user.public_repos}</p>
              <p><strong>Followers:</strong> {githubData.user.followers}</p>
              <p className="text-green-600 mt-2">Connected ✅</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}