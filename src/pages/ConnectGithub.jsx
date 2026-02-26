export default function ConnectGithub() {
  const handleConnect = () => {
    window.location.href =
      "http://localhost:5000/api/github/login";
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleConnect}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Connect GitHub
      </button>
    </div>
  );
}