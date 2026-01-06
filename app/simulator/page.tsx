"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Types ---
type SimulatorState = "IDLE" | "FILLING" | "DOSING" | "SUPPLYING";

// --- Logic Hook (The Brain) ---
const useNutrientSimulator = () => {
    // System State
    const [state, setState] = useState<SimulatorState>("IDLE");
    const [subState, setSubState] = useState("");
    const [autoMode, setAutoMode] = useState(true);
    const [safetyLock, setSafetyLock] = useState(false);
    const [logMsg, setLogMsg] = useState("System Ready");

    // Physics Vars
    const physics = useRef({
        rawWaterLevel: 500,
        tankLevel: 0,
        tankA: 20,
        tankB: 20,
        tankAcid: 20,
        ec: 0.5,
        temp: 20.0,
        realPh: 7.0,
        sensorPh: 7.0,
        solarRad: 500,
        dosingTime: 0,
        totalA: 0,
        totalB: 0,
        phWaitTimer: 0,
        displayEc: 0.5,
        displayPh: 7.0,
        displayTemp: 20.0,
    });

    // Actuators
    const [actuators, setActuators] = useState({
        rawPump: false,
        inletValve: false,
        mixingPump: false,
        supplyPump: false,
        valveA: 0,
        valveB: 0,
        acidValve: 0,
        chiller: false,
        uvLamp: true,
        sandFilter: false,
    });

    // Targets
    const targets = useRef({
        ec: 2.0,
        ph: 5.8,
        temp: 18.0,
        tolEc: 0.3,
        tolPh: 0.5,
        tolTemp: 2.0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const p = physics.current;
            const t = targets.current;
            const act = { ...actuators };

            // --- 1. Physics Engine ---
            if (act.rawPump) p.rawWaterLevel = Math.min(1000, p.rawWaterLevel + 2.0);

            if (act.inletValve) {
                if (p.rawWaterLevel > 0) {
                    p.tankLevel += 0.5;
                    p.rawWaterLevel -= 0.5;
                    if (p.tankLevel > 0) {
                        p.ec = (p.ec * (p.tankLevel - 0.5) + 0.5 * 0.5) / p.tankLevel;
                        p.realPh = (p.realPh * (p.tankLevel - 0.5) + 7.0 * 0.5) / p.tankLevel;
                    }
                }
            }

            if (act.supplyPump) p.tankLevel = Math.max(0, Math.min(200, p.tankLevel - 0.5));

            // Temp Physics
            const ambientTemp = 20 + (p.solarRad / 100);
            if (act.chiller) p.temp -= 0.1;
            else p.temp += (ambientTemp - p.temp) * 0.005;

            // Dosing Physics
            if (act.valveA > 0) {
                p.tankA -= 0.01 * act.valveA;
                p.totalA += 0.01 * act.valveA;
                p.ec += 0.05 * act.valveA;
            }
            if (act.valveB > 0) {
                p.tankB -= 0.01 * act.valveB;
                p.totalB += 0.01 * act.valveB;
                p.ec += 0.05 * act.valveB;
            }
            if (act.acidValve > 0) {
                p.tankAcid -= 0.01 * act.acidValve;
                p.realPh -= 0.1 * act.acidValve;
            }

            // Sensor Lag
            p.sensorPh += (p.realPh - p.sensorPh) * 0.05;

            // Noise
            p.displayEc = p.ec + (Math.random() - 0.5) * 0.02;
            p.displayPh = p.sensorPh + (Math.random() - 0.5) * 0.04;
            p.displayTemp = p.temp + (Math.random() - 0.5) * 0.2;

            // --- 2. Logic (Auto Mode) ---
            let nextState = state;
            let nextSubState = "";
            let isLocked = false;

            if (autoMode) {
                // Env Logic
                if (p.solarRad > 700) { t.ec = 2.4; setLogMsg("Mode: Sunny (High EC)"); }
                else if (p.solarRad > 300) { t.ec = 2.0; setLogMsg("Mode: Normal"); }
                else { t.ec = 1.6; setLogMsg("Mode: Low Light"); }

                // Raw Water
                if (p.rawWaterLevel < 200) act.rawPump = true;
                else if (p.rawWaterLevel > 900) act.rawPump = false;

                // Chiller Check
                if (p.displayTemp > t.temp + t.tolTemp) act.chiller = true;
                else if (p.displayTemp < t.temp - 0.5) act.chiller = false;

                // Reset Dosing Actuators
                act.valveA = 0; act.valveB = 0; act.acidValve = 0;

                const ecError = t.ec - p.displayEc;
                const phError = p.displayPh - t.ph;

                if (state === "IDLE") {
                    p.dosingTime = 0;
                    act.mixingPump = false; act.supplyPump = false;
                    if (p.tankLevel < 20) nextState = "FILLING";

                } else if (state === "FILLING") {
                    act.inletValve = true;
                    if (p.tankLevel >= 160) {
                        act.inletValve = false;
                        nextState = "DOSING";
                    }

                } else if (state === "DOSING") {
                    p.dosingTime += 0.1;
                    act.mixingPump = true;

                    // --- EMERGENCY DILUTION LOGIC ---
                    const isEcHigh = ecError < -(t.tolEc);
                    const isPhLow = phError < -(t.tolPh);

                    if (isEcHigh || isPhLow) {
                        if (p.tankLevel < 195) {
                            nextSubState = "⚠️ DILUTING (Overshoot)";
                            act.inletValve = true;
                            isLocked = true;
                        } else {
                            nextSubState = "🚨 ALARM: TANK FULL";
                            isLocked = true;
                        }
                    }
                    // --- Normal Logic ---
                    else if (p.phWaitTimer > 0) {
                        p.phWaitTimer -= 1;
                        nextSubState = `⏳ pH Reacting... (${Math.ceil(p.phWaitTimer / 10)})`;
                        isLocked = true;
                    }
                    else if (phError > (t.tolPh * 0.2)) {
                        nextSubState = "Acid Dosing (Pulse)";
                        act.acidValve = 1.0;
                        p.phWaitTimer = 30; // 3 sec wait
                        isLocked = true;
                    }
                    else if (ecError > (t.tolEc * 0.2)) {
                        const tick = Math.floor(Date.now() / 500);
                        if (tick % 2 === 0) {
                            nextSubState = "A-Sol Injecting";
                            act.valveA = ecError > 0.5 ? 1.0 : 0.2;
                        } else {
                            nextSubState = "B-Sol Injecting";
                            act.valveB = ecError > 0.5 ? 1.0 : 0.2;
                        }
                        isLocked = true;
                    }
                    else {
                        nextSubState = "Stabilizing";
                    }

                    // Completion Check
                    const ecOk = Math.abs(ecError) < 0.1;
                    const phOk = Math.abs(phError) < 0.1;
                    if (ecOk && phOk && p.phWaitTimer === 0 && !isEcHigh && !isPhLow) {
                        nextState = "SUPPLYING";
                    }

                } else if (state === "SUPPLYING") {
                    act.mixingPump = true; act.supplyPump = true;
                    if (p.tankLevel < 20) nextState = "IDLE";
                }
            }

            // Sync State
            setState(nextState);
            setSubState(nextSubState);
            setSafetyLock(isLocked);
            // Since actuators is a state object in the dependency array, 
            // updating it directly in a loop could cause infinite re-renders if not handled carefully.
            // But here we are inside an interval that reads from 'actuators' scope.
            // To properly update, we should use setActuators callback or ref, but for prototype simpler:
            setActuators(act);

        }, 100);

        return () => clearInterval(interval);
    }, [state, autoMode, actuators]);

    return { state, subState, autoMode, setAutoMode, safetyLock, logMsg, physics: physics.current, actuators, targets: targets.current };
};


// --- Components ---
const SemiCircleGauge = ({ value, target, tol, label, unit, min, max, color }: any) => {
    // Map value to angle: 180 (min) -> 0 (max)
    const range = max - min;
    const pct = Math.max(0, Math.min(1, (value - min) / range));
    const angle = 180 - (pct * 180);

    // Tolerance Band
    const minSafe = Math.max(min, target - tol);
    const maxSafe = Math.min(max, target + tol);
    // Convert to stroke-dasharray or easier: just rotate an arc
    // Start Angle for Safe Zone (in SVG coords, 0 is right, 180 is left)
    // Actually simpler to use rotation.
    // Let's use simple math for the Needle rotation

    return (
        <div className="relative w-64 h-32 bg-slate-800 rounded-tl-full rounded-tr-full overflow-hidden border-b-4 border-slate-600">
            {/* Safe Zone (Green Band) */}
            <div className="absolute bottom-0 left-0 w-full h-full opacity-20 bg-green-500"
                style={{ clipPath: 'polygon(10% 100%, 90% 100%, 90% 10%, 10% 10%)' }}>
                {/* Simplified Safe Zone Vis for Web Prototype */}
            </div>

            {/* Ticks */}
            {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="absolute bottom-0 left-1/2 w-1 h-28 origin-bottom bg-slate-500/30"
                    style={{ transform: `translateX(-50%) rotate(${180 - (i / 4) * 180}deg)` }} />
            ))}

            {/* Needle */}
            <div className="absolute bottom-0 left-1/2 w-1 h-24 bg-red-500 origin-bottom transition-all duration-300 ease-out z-10 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}></div>

            {/* Center Cap */}
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full translate-y-2 -translate-x-1/2 z-20"></div>

            {/* Text */}
            <div className="absolute bottom-8 w-full text-center">
                <div className="text-xs text-slate-400">{label}</div>
                <div className="text-3xl font-bold text-white font-mono">{value.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{unit}</div>
            </div>

            {/* Target Marker */}
            <div className="absolute bottom-0 left-1/2 w-0.5 h-28 bg-white/50 origin-bottom z-0 dashed"
                style={{ transform: `translateX(-50%) rotate(${180 - ((target - min) / range) * 180}deg)` }}></div>
        </div>
    )
}

const RainbowGauge = ({ value, target, tol }: any) => {
    // 0 to 14
    const pct = Math.max(0, Math.min(1, value / 14));
    const angle = -90 + (pct * 180); // -90 (Left) to +90 (Right) for a half circle approach

    return (
        <div className="relative w-64 h-32 flex items-end justify-center">
            {/* Rainbow Arc (CSS Conic Gradient masked) */}
            <div className="absolute w-64 h-64 rounded-full opacity-80"
                style={{
                    background: `conic-gradient(from 270deg, 
                        #e74c3c 0deg 51deg, 
                        #e67e22 51deg 77deg, 
                        #2ecc71 77deg 103deg, 
                        #3498db 103deg 128deg, 
                        #9b59b6 128deg 180deg, 
                        transparent 180deg
                    )`,
                    clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)"
                }}>
            </div>
            {/* Inner Mask */}
            <div className="absolute bottom-0 w-48 h-24 bg-slate-900 rounded-tl-full rounded-tr-full z-0"></div>

            {/* Needle */}
            <div className="absolute bottom-0 w-1 h-28 bg-white origin-bottom z-10 transition-all duration-500"
                style={{ transform: `rotate(${angle}deg)` }}></div>

            <div className="relative z-20 text-center mb-2">
                <div className="text-xs text-slate-400">pH Value</div>
                <div className="text-2xl font-bold text-white">{value.toFixed(2)}</div>
            </div>
        </div>
    )
}


export default function SimulatorPage() {
    const sim = useNutrientSimulator();
    const [tab, setTab] = useState<"DASH" | "NUTRI" | "WATER">("DASH");

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-green-500/30">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center font-bold text-slate-900 text-xl">K</div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">K-WASABI Simulator <span className="text-green-400 text-sm font-normal ml-2">v11.0 Web</span></h1>
                        <p className="text-xs text-slate-400">Integrated Nutrient Control System</p>
                    </div>
                </div>

                <button
                    onClick={() => sim.setAutoMode(!sim.autoMode)}
                    className={`px-6 py-2 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 ${sim.autoMode ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                >
                    {sim.autoMode ? <><Play size={18} fill="currentColor" /> AUTO MODE</> : <><Pause size={18} fill="currentColor" /> MANUAL MODE</>}
                </button>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto space-y-6">

                {/* Tabs */}
                <div className="flex gap-2">
                    {["DASH", "NUTRI", "WATER"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`px-8 py-3 rounded-t-xl font-bold text-sm transition-all ${tab === t ? 'bg-slate-800 text-white border-t-2 border-green-500' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            {t === "DASH" && "📊 DASHBOARD"}
                            {t === "NUTRI" && "🧪 NUTRIENT MIXING"}
                            {t === "WATER" && "💧 WATER FLOW"}
                        </button>
                    ))}
                </div>

                {/* DASHBOARD TAB */}
                {tab === "DASH" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Status Banner */}
                        <div className="bg-slate-800 rounded-2xl p-8 border border-white/5 flex justify-between items-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div>
                                <div className="text-slate-400 mb-1 font-medium">SYSTEM STATUS</div>
                                <div className="text-6xl font-black text-white tracking-tighter flex items-center gap-4">
                                    {sim.state}
                                    {sim.subState && <span className="text-2xl text-yellow-400 font-normal animate-pulse bg-yellow-400/10 px-4 py-1 rounded-full">{sim.subState}</span>}
                                </div>
                                <div className="mt-4 flex gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><CheckCircle size={14} /> Pump Ready</span>
                                    <span className="flex items-center gap-1"><CheckCircle size={14} /> Sensors Online</span>
                                    <span className="flex items-center gap-1"><CheckCircle size={14} /> Network Connected</span>
                                </div>
                            </div>

                            <div className="text-right z-10">
                                <div className="text-xl text-green-400 font-bold mb-2">{sim.logMsg}</div>
                                <div className="text-slate-400 text-sm">Target EC: {sim.targets.ec.toFixed(1)} | Target pH: {sim.targets.ph.toFixed(1)}</div>
                                <input
                                    type="range" min="0" max="1200" step="100"
                                    defaultValue="500"
                                    onChange={(e) => sim.physics.solarRad = parseInt(e.target.value)}
                                    className="mt-4 w-48 accent-green-500"
                                />
                                <div className="text-xs text-slate-500 mt-1">Simulated Solar Rad</div>
                            </div>
                        </div>

                        {/* Gauges Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* EC GAUGE */}
                            <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[300px] shadow-xl">
                                <h3 className="text-slate-400 font-bold mb-6 flex items-center gap-2">🔌 EC LEVEL <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full">REALTIME</span></h3>
                                <SemiCircleGauge
                                    value={sim.physics.displayEc}
                                    target={sim.targets.ec}
                                    tol={sim.targets.tolEc}
                                    label=""
                                    unit="mS/cm"
                                    min={0}
                                    max={4}
                                    color="green"
                                />
                                <div className="mt-4 text-center">
                                    <div className="text-sm text-slate-400">Tolerance: ±{sim.targets.tolEc}</div>
                                    <div className="text-xs text-slate-500">Target Zone: {(sim.targets.ec - sim.targets.tolEc).toFixed(1)} - {(sim.targets.ec + sim.targets.tolEc).toFixed(1)}</div>
                                </div>
                            </div>

                            {/* pH GAUGE */}
                            <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[300px] shadow-xl relative overflow-hidden">
                                {/* Safety Lock Overlay if Waiting */}
                                {sim.safetyLock && (
                                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center animate-in fade-in">
                                        <Lock className="text-red-500 w-12 h-12 mb-2 animate-bounce" />
                                        <div className="text-red-400 font-bold">SAFETY INTERLOCK</div>
                                        <div className="text-slate-300 text-sm">{sim.subState}</div>
                                    </div>
                                )}

                                <h3 className="text-slate-400 font-bold mb-6 flex items-center gap-2">🧪 pH LEVEL <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] rounded-full">SMART WAIT</span></h3>
                                <RainbowGauge
                                    value={sim.physics.displayPh}
                                    target={sim.targets.ph}
                                    tol={sim.targets.tolPh}
                                />
                                <div className="mt-8 text-center">
                                    <div className="text-sm text-slate-400">Target: {sim.targets.ph}</div>
                                    <div className="h-1.5 w-full bg-slate-700 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${(sim.physics.phWaitTimer / 30) * 100}%` }}></div>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">Reaction Wait Timer</div>
                                </div>
                            </div>

                            {/* TEMP GAUGE */}
                            <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[300px] shadow-xl">
                                <h3 className="text-slate-400 font-bold mb-6">🌡️ TEMPERATURE</h3>
                                <div className="relative w-16 h-48 bg-slate-700 rounded-full border-4 border-slate-600 p-1 flex items-end justify-center">
                                    <div className="w-full bg-gradient-to-t from-blue-500 to-red-500 rounded-full opacity-50 absolute inset-1"></div>
                                    <div className="w-full bg-slate-900 absolute top-0 left-0 right-0 rounded-t-full transition-all duration-300" style={{ height: `${100 - (sim.physics.displayTemp / 40) * 100}%` }}></div>
                                    <div className="absolute bottom-4 text-white font-bold drop-shadow-md z-10">{sim.physics.displayTemp.toFixed(1)}°C</div>
                                </div>
                                <div className="mt-4 flex gap-4 text-sm">
                                    <div className={`px-3 py-1 rounded-full ${sim.actuators.chiller ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-700 text-slate-400'}`}>Chiller</div>
                                    <div className="px-3 py-1 rounded-full bg-slate-700 text-slate-400">Heater</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Tabs Placeholder for Prototype */}
                {tab !== "DASH" && (
                    <div className="flex flex-col items-center justify-center h-96 bg-slate-800 rounded-2xl border border-dashed border-slate-600">
                        <AlertTriangle className="text-yellow-500 w-16 h-16 mb-4" />
                        <h2 className="text-2xl font-bold text-white">Coming to Web Soon</h2>
                        <p className="text-slate-400">The full {tab === "NUTRI" ? "Nutrient Mixing" : "Water Treatment"} control panel is available in the desktop version.</p>
                        <p className="text-slate-500 text-sm mt-2">Currently showing Dashboard only for web speed.</p>
                    </div>
                )}

            </main>
        </div>
    )
}
