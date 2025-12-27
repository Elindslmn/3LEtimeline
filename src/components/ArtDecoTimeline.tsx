import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dati simulati dal 1995 al 2025
const timelineData = Array.from({ length: 31 }, (_, i) => {
  const year = 1995 + i;
  return {
    id: year,
    year: year,
    title: `Epoca ${year}`,
    content: "Dati storici recuperati. Frammenti visivi caricati nel database.",
    mediaType: i % 2 === 0 ? 'video' : 'image'
  };
});

const ArtDecoTimeline = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const scrollRef = useRef(null);

  return (
    <div className="h-screen w-full bg-[#0a0f14] text-[#c5a059] overflow-hidden flex flex-col relative font-mono selection:bg-[#c5a059] selection:text-black">
      
      {/* Background Decorativo (Linee Sottili) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #c5a059 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header Asimoviano */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center border-b border-[#c5a059]/30 z-10">
        <div className="text-xs tracking-[0.3em] uppercase">Sistema Archivio: <span className="text-white glow">Attivo</span></div>
        <div className="text-2xl font-serif tracking-widest text-[#c5a059]">CHRONOS DECO</div>
        <div className="text-xs">COORD: 45.91 / 12.33</div>
      </header>

      {/* Timeline Orizzontale Scrollabile */}
      <div className="flex-1 flex items-center overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing perspective-1000" ref={scrollRef}>
        <div className="flex px-[50vw] gap-20 items-center">
          {timelineData.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => setSelectedYear(item)}
              initial={{ scale: 1, opacity: 0.6 }}
              whileHover={{ scale: 1.2, opacity: 1, y: -10 }}
              animate={{ 
                color: selectedYear?.id === item.id ? '#ffffff' : '#c5a059',
                scale: selectedYear?.id === item.id ? 1.4 : 1
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative flex flex-col items-center group cursor-pointer min-w-[100px]"
            >
              {/* Decorazione Nodo (Rombo Art Deco) */}
              <div className="w-4 h-4 bg-[#0a0f14] border-2 border-[#c5a059] rotate-45 mb-4 group-hover:bg-[#c5a059] transition-colors shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
              
              {/* Anno */}
              <h2 className="text-4xl font-serif font-bold tracking-tighter group-hover:text-white transition-colors">
                {item.year}
              </h2>
              
              {/* Linea verticale che connette al binario */}
              <div className="h-10 w-[1px] bg-gradient-to-b from-transparent to-[#c5a059] mt-2 opacity-30" />
            </motion.div>
          ))}
        </div>
        
        {/* Il Binario Centrale (Linea Fissa) */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#c5a059]/20 -z-10 mt-6" />
      </div>

      {/* Modal / Overlay Dettagli */}
      <AnimatePresence>
        {selectedYear && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="absolute bottom-0 left-0 w-full h-[60vh] bg-[#0f141a] border-t-4 border-[#c5a059] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50 flex flex-col md:flex-row"
          >
            {/* Pulsante Chiudi */}
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedYear(null); }}
              className="absolute top-4 right-8 text-[#c5a059] hover:text-white text-xl z-50"
            >
              [CHIUDI_TERMINALE]
            </button>

            {/* Lato Sinistro: Visual (Foto/Video) */}
            <div className="md:w-1/2 h-full border-r border-[#c5a059]/30 relative overflow-hidden p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#c5a059]/5" /> {/* Tint */}
              {/* Cornice Art Deco */}
              <div className="border-2 border-[#c5a059] p-2 w-full h-full flex items-center justify-center relative">
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#c5a059]" />
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#c5a059]" />
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#c5a059]" />
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c5a059]" />
                 
                 <span className="text-[#c5a059]/50 font-mono text-sm animate-pulse">
                   {selectedYear.mediaType === 'video' ? '▶ CARICAMENTO BOBINA...' : '■ RENDERING IMMAGINE...'}
                 </span>
              </div>
            </div>

            {/* Lato Destro: Testo e Dati */}
            <div className="md:w-1/2 p-12 flex flex-col justify-center relative">
               <h3 className="text-6xl font-serif text-[#c5a059] mb-4 border-b border-[#c5a059]/50 pb-4 inline-block">
                 {selectedYear.year}
               </h3>
               <h4 className="text-white text-xl mb-6 font-mono tracking-wide uppercase">
                 {selectedYear.title}
               </h4>
               <p className="text-gray-400 font-mono leading-relaxed max-w-md border-l-2 border-[#c5a059] pl-4">
                 {selectedYear.content}
                 <br/><br/>
                 <span className="text-xs opacity-50">Log Entry #{selectedYear.id * 324}</span>
               </p>
               
               {/* Elementi decorativi stile Asimov */}
               <div className="absolute bottom-8 right-8 flex gap-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-2 h-8 bg-[#c5a059] opacity-30 animate-pulse" style={{animationDelay: `${i*0.2}s`}}/>
                 ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtDecoTimeline;