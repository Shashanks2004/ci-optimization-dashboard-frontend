export default function Overview() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">
        Continuous Integration Optimization
      </h2>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card title="Total Builds" value="256" />
        <Card title="Failure Rate" value="16%" />
        <Card title="AI Decisions" value="128" />
        <Card title="Time Saved" value="9 hrs" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white/5 rounded-xl p-6">
          <h3 className="text-indigo-400 mb-4">Recent Commits</h3>
          <p className="text-sm text-gray-400">
            Commit a91f2c — Risk High — FAIL — Action: Skip Tests
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-indigo-400 mb-4">Latest AI Decision</h3>
          <p className="text-sm text-gray-400">
            Skip Heavy Tests
          </p>
        </div>
      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-6 text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}