import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Configurazione della Helix
const CONFIG = {
    spacing: 160,     // Spazio tra le card
    radius: 280,      // Larghezza della spirale (più larga = più cinematografica)
    rotationSpeed: 30 // Gradi per step (più basso = spirale più lunga e morbida)
};

// Generiamo dati finti "Cryptic"
const timelineData = Array.from({ length: 25 }, (_, i) => {
    const year = 1995 + i;
    return {
        year: year,
        title: i % 2 === 0 ? "GENETIC_MEMORY" : "FRAGMENT_LOST",
        status: i % 3 === 0 ? "CORRUPTED" : "SYNCED",
        desc: "Sequence loaded successfully. Genetic markers indicate high precursor activity."
    };
});

export default function AnimusScene() {
    const [activeIndex, setActiveIndex] = useState(10); // Partiamo dal centro

    // Calcolo posizione camera per centrare l'elemento attivo
    const targetX = -(activeIndex * CONFIG.spacing);
    
    // Funzione per gestire il click e centrare
    const handleSelect = (idx: number) => {
        setActiveIndex(idx);
    };

    return (
        <div className="h-screen w-full relative overflow-hidden animus-bg font-['Share_Tech_Mono'] selection:bg-[#c5a059] selection:text-black">
            
            {/* Noise Overlay per texture */}
            <div className="noise-overlay"></div>

            {/* HUD / UI ELEMENTS (Il contorno dello schermo) */}
            <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-50">
                <div className="flex justify-between items-start opacity-70">
                    <div>
                        <h1 className="text-3xl font-['Cinzel'] text-[#c5a059] tracking-[0.2em] drop-shadow-[0_0_10px_rgba(197,160,89,0.8)]">
                            ANIMUS <span className="text-white text-sm tracking-widest block font-sans opacity-50">OMEGA PROTOCOL // V.4.0</span>
                        </h1>
                    </div>
                    <div className="text-right text-xs text-[#00ffff] space-y-1">
                        <p>MEM_USAGE: 4024 TB</p>
                        <p>SYNC_RATE: 98.4%</p>
                        <div className="w-32 h-1 bg-[#00ffff]/20 mt-2"><div className="w-[80%] h-full bg-[#00ffff] animate-pulse"></div></div>
                    </div>
                </div>
                
                <div className="flex justify-between items-end opacity-50 text-[10px] tracking-widest text-gray-400">
                    <div>COORD: 45.4408° N, 12.3155° E</div>
                    <div>SUBJECT: 17</div>
                </div>
            </div>

            {/* --- 3D VIEWPORT --- */}
            <div className="absolute inset-0 flex items-center justify-center scene-container">
                
                {/* HELIX CONTAINER (Mondo che si muove) */}
                <motion.div 
                    className="relative h-full"
                    initial={false}
                    animate={{ 
                        x: targetX,
                        rotateX: 10, // Leggera inclinazione fissa per vedere la profondità
                        rotateZ: -5  // Leggera inclinazione artistica
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
                    style={{ transformStyle: 'preserve-3d', width: '100%' }}
                >
                    
                    {/* DNA STRAND (Il raggio centrale) */}
                    <div className="absolute top-1/2 left-[-5000px] w-[10000px] h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-30 blur-[1px]" 
                         style={{ transform: 'translateY(-50%) translateZ(0)' }} 
                    />

                    {/* ITEM GENERATION */}
                    {timelineData.map((item, index) => {
                        const angle = index * CONFIG.rotationSpeed; // Gradi
                        const rad = (angle * Math.PI) / 180;        // Radianti
                        
                        // Posizione sulla spirale
                        const x = index * CONFIG.spacing;
                        const y = Math.sin(rad) * CONFIG.radius;
                        const z = Math.cos(rad) * CONFIG.radius; // Profondità

                        // Stato "Attivo"
                        const isActive = index === activeIndex;
                        const dist = Math.abs(index - activeIndex);
                        
                        // Calcoli visivi basati sulla distanza dall'attivo
                        const scale = isActive ? 1.3 : Math.max(0.6, 1 - dist * 0.15);
                        const opacity = Math.max(0.1, 1 - dist * 0.25);
                        const blur = isActive ? 0 : Math.min(10, dist * 2); // Sfocatura per profondità

                        return (
                            <motion.div
                                key={item.year}
                                onClick={() => handleSelect(index)}
                                className="absolute top-1/2 left-1/2 cursor-pointer group"
                                style={{
                                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-20}deg)`, // Ruotati leggermente verso camera
                                    zIndex: 100 - dist, // Fix sovrapposizione
                                }}
                                animate={{
                                    rotateX: -angle, // Contro-rotazione per tenerli dritti
                                }}
                                transition={{ type: "spring", stiffness: 100 }}
                            >
                                
                                {/* CARD CONTENT */}
                                <motion.div 
                                    className={`
                                        relative w-64 h-40 rounded-lg overflow-hidden flex flex-col p-4
                                        transition-all duration-500 ease-out
                                        ${isActive ? 'active-card z-50' : 'glass-panel hover:bg-white/10'}
                                    `}
                                    style={{
                                        scale,
                                        opacity,
                                        filter: `blur(${blur}px)`, // Depth of Field reale
                                    }}
                                >
                                    {/* Scanlines solo se attivo */}
                                    {isActive && <div className="absolute inset-0 scanlines opacity-30"></div>}

                                    {/* Header Card */}
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                                        <span className={`text-3xl font-bold font-['Cinzel'] ${isActive ? 'text-[#c5a059] drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]' : 'text-gray-400'}`}>
                                            {item.year}
                                        </span>
                                        <div className={`w-2 h-2 rounded-full ${item.status === 'CORRUPTED' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-[#00ffff] shadow-[0_0_10px_cyan]'}`}></div>
                                    </div>

                                    {/* Body Card */}
                                    <div className="flex-1">
                                        <h3 className="text-xs text-gray-300 tracking-widest mb-1">{item.title}</h3>
                                        {isActive && (
                                            <motion.p 
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                                className="text-[10px] text-[#c5a059] leading-relaxed font-sans"
                                            >
                                                {item.desc}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Decorative Tech Footer */}
                                    <div className="flex justify-between items-end mt-auto opacity-50">
                                        <span className="text-[8px]">SEQ_{index}02</span>
                                        <div className="flex gap-1">
                                            {[1,2,3].map(d => <div key={d} className="w-1 h-3 bg-white/40"></div>)}
                                        </div>
                                    </div>

                                </motion.div>

                                {/* "Raggio" che connette la card al centro della spirale (Anchor) */}
                                <div 
                                    className={`absolute top-1/2 left-1/2 w-[1px] origin-top bg-gradient-to-b from-[#c5a059] to-transparent transition-all duration-500`}
                                    style={{ 
                                        height: CONFIG.radius, 
                                        transform: `rotate(${angle}deg)`, // Questo deve opporsi alla rotazione locale per puntare al centro
                                        opacity: isActive ? 0.6 : 0.1
                                    }}
                                ></div>

                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* CONTROLLI (Bottoni Sci-Fi) */}
            <div className="absolute bottom-12 w-full flex justify-center gap-8 z-50">
                <button 
                    onClick={() => handleSelect(Math.max(0, activeIndex - 1))}
                    className="px-8 py-2 bg-black/50 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/10 hover:border-[#00ffff] transition-all rounded backdrop-blur-md uppercase text-xs tracking-[0.2em]"
                >
                    &lt; Rewind
                </button>
                <button 
                    onClick={() => handleSelect(Math.min(timelineData.length - 1, activeIndex + 1))}
                    className="px-8 py-2 bg-black/50 border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059]/10 hover:border-[#c5a059] transition-all rounded backdrop-blur-md uppercase text-xs tracking-[0.2em]"
                >
                    Forward &gt;
                </button>
            </div>

        </div>
    );
};