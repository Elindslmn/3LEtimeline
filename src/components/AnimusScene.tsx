import React, { useState } from 'react';
import { motion } from 'framer-motion';

type AnimusSceneProps = {
    years?: number[];
    activeYear?: number | null;
    onSelectYear?: (year: number) => void;
};

// Configurazione della Helix
const CONFIG = {
    spacing: 160,     // Spazio tra le card
    radius: 280,      // Larghezza della spirale (più larga = più cinematografica)
    rotationSpeed: 30 // Gradi per step (più basso = spirale più lunga e morbida)
};

const DEFAULT_YEARS = Array.from({ length: 25 }, (_, i) => 1995 + i);

export default function AnimusScene({ years, activeYear, onSelectYear }: AnimusSceneProps) {
    const yearList = years && years.length > 0 ? years : DEFAULT_YEARS;
    const [localIndex, setLocalIndex] = useState(() => Math.min(10, Math.max(0, yearList.length - 1)));
    const controlledIndex = activeYear != null ? yearList.indexOf(activeYear) : -1;
    const activeIndex = controlledIndex >= 0 ? controlledIndex : localIndex;
    const safeActiveIndex = Math.max(0, Math.min(activeIndex, yearList.length - 1));

    const items = yearList.map((year, index) => ({
        year,
        title: index % 2 === 0 ? "GENETIC_MEMORY" : "FRAGMENT_LOST",
        status: index % 3 === 0 ? "CORRUPTED" : "SYNCED",
        desc: "Sequence loaded successfully. Genetic markers indicate high precursor activity."
    }));

    const handleSelect = (idx: number) => {
        const safeIdx = Math.max(0, Math.min(idx, yearList.length - 1));
        const year = yearList[safeIdx];
        if (onSelectYear) {
            onSelectYear(year);
        }
        if (controlledIndex < 0) {
            setLocalIndex(safeIdx);
        }
    };

    if (yearList.length === 0) {
        return (
            <div className="animus-scene">
                <div className="animus-empty">No sequences available.</div>
            </div>
        );
    }

    return (
        <div className="animus-scene">
            {/* --- 3D VIEWPORT --- */}
            <div className="animus-stage scene-container">
                
                {/* HELIX CONTAINER (Mondo che si muove) */}
                <motion.div 
                    className="animus-helix"
                    initial={false}
                    animate={{ 
                        rotateX: 10, // Leggera inclinazione fissa per vedere la profondità
                        rotateZ: -5  // Leggera inclinazione artistica
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
                >
                    
                    {/* DNA STRAND (Il raggio centrale) */}
                    <div className="animus-beam" />

                    {/* ITEM GENERATION */}
                    {items.map((item, index) => {
                        const angle = index * CONFIG.rotationSpeed; // Gradi
                        const rad = (angle * Math.PI) / 180;        // Radianti
                        
                        // Posizione sulla spirale
                        const x = (index - safeActiveIndex) * CONFIG.spacing;
                        const y = Math.sin(rad) * CONFIG.radius;
                        const z = Math.cos(rad) * CONFIG.radius; // Profondità

                        // Stato "Attivo"
                        const isActive = index === safeActiveIndex;
                        const dist = Math.abs(index - safeActiveIndex);
                        
                        // Calcoli visivi basati sulla distanza dall'attivo
                        const scale = isActive ? 1.3 : Math.max(0.6, 1 - dist * 0.15);
                        const opacity = Math.max(0.1, 1 - dist * 0.25);
                        const blur = isActive ? 0 : Math.min(10, dist * 2); // Sfocatura per profondità

                        return (
                            <motion.div
                                key={item.year}
                                onClick={() => handleSelect(index)}
                                className="animus-node"
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
                                    className={`animus-card ${isActive ? 'active-card' : 'glass-panel'}`}
                                    style={{
                                        scale,
                                        opacity,
                                        filter: `blur(${blur}px)`, // Depth of Field reale
                                    }}
                                >
                                    {/* Scanlines solo se attivo */}
                                    {isActive && <div className="scanlines animus-scanlines"></div>}

                                    {/* Header Card */}
                                    <div className="animus-card-header">
                                        <span className={`animus-card-year${isActive ? ' is-active' : ''}`}>
                                            {item.year}
                                        </span>
                                        <span className={`animus-status-dot ${item.status === 'CORRUPTED' ? 'is-corrupt' : 'is-synced'}`}></span>
                                    </div>

                                    {/* Body Card */}
                                    <div className="animus-card-body">
                                        <h3 className="animus-card-title">{item.title}</h3>
                                        {isActive && (
                                            <motion.p 
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                                className="animus-card-desc"
                                            >
                                                {item.desc}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Decorative Tech Footer */}
                                    <div className="animus-card-footer">
                                        <span className="animus-card-seq">SEQ_{index}02</span>
                                        <div className="animus-bars">
                                            {[1,2,3].map(d => <span key={d} />)}
                                        </div>
                                    </div>

                                </motion.div>

                                {/* "Raggio" che connette la card al centro della spirale (Anchor) */}
                                <div 
                                    className="animus-anchor"
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
            <div className="animus-controls">
                <button 
                    onClick={() => handleSelect(Math.max(0, safeActiveIndex - 1))}
                    className="animus-control animus-control--cyan"
                >
                    &lt; Rewind
                </button>
                <button 
                    onClick={() => handleSelect(Math.min(yearList.length - 1, safeActiveIndex + 1))}
                    className="animus-control animus-control--gold"
                >
                    Forward &gt;
                </button>
            </div>

        </div>
    );
};
