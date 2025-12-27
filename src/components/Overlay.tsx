import { Scroll } from '@react-three/drei';

export default function Overlay() {
  return (
    <Scroll html style={{ width: '100%' }}>
      {/* SECTION 1: HERO */}
      <section className="h-screen w-screen flex flex-col justify-center px-20 select-none">
        <h1 className="text-[12vw] leading-none font-bold tracking-tighter text-white mix-blend-difference opacity-90">
          WINTER
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
            2026
          </span>
        </h1>
        <p className="mt-8 text-xl text-gray-400 font-mono tracking-widest uppercase">
          The RenAIssance Edition
        </p>
      </section>

      {/* SECTION 2: BENTO GRID FEATURES */}
      <section className="min-h-screen w-screen bg-black/50 backdrop-blur-sm p-20">
        <h2 className="text-6xl text-white font-bold mb-12">150+ Updates</h2>
        
        {/* CSS GRID (The "Bento" Look) */}
        <div className="grid grid-cols-3 gap-6 h-[80vh] w-full max-w-7xl">
          
          <div className="col-span-2 row-span-2 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-10 hover:border-blue-500/50 transition-colors duration-500 group">
            <h3 className="text-4xl text-white mb-4 group-hover:text-blue-200">Sidekick AI</h3>
            <p className="text-gray-400 text-lg">Your new commerce assistant. Now fully context-aware.</p>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 hover:bg-white/5 transition-colors">
            <h3 className="text-2xl text-white mb-2">Checkout</h3>
            <p className="text-gray-500">60% Faster Load Times</p>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 hover:bg-white/5 transition-colors">
            <h3 className="text-2xl text-white mb-2">POS Terminal</h3>
            <p className="text-gray-500">Unified retail hardware.</p>
          </div>

          <div className="col-span-3 bg-gradient-to-r from-blue-900/20 to-neutral-900 border border-neutral-800 rounded-3xl p-10 flex items-center justify-between">
            <div>
              <h3 className="text-5xl text-white font-bold">Global Markets</h3>
              <p className="text-blue-200 mt-2">Sell everywhere, instantly.</p>
            </div>
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
              Explore Features
            </button>
          </div>
        </div>
      </section>
    </Scroll>
  );
}
