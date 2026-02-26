export default function StatCard({ title, value, accent }) {
  return (
    <div className="relative bg-white/50 backdrop-blur-md 
                    rounded-2xl p-6 
                    border border-[#DDB892] 
                    shadow-md overflow-hidden">

      <div
        className="absolute inset-0 opacity-20 blur-2xl"
        style={{ background: accent }}
      />

      <p className="text-sm text-[#6D4C41] uppercase tracking-wide">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-2 text-[#4E342E]">
        {value}
      </h2>

      <p className="text-xs text-[#8D6E63] mt-1">
        AI monitored
      </p>
    </div>
  );
}