"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, Text, Grid, Button, Group, Slider, Badge, Stack, Center, ThemeIcon, Overlay, Title, rem, PasswordInput, Divider, ActionIcon, SimpleGrid, Code, SegmentedControl, Modal, Tooltip } from '@mantine/core';
import { Play, Pause, Lock, CheckCircle, AlertTriangle, Activity, Droplet, Zap, LayoutDashboard, Fan, ThermometerSnowflake, Wind, Layers, Magnet, Download, FileText, Info, Briefcase, Network, Cpu, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useDisclosure } from '@mantine/hooks';

// --- Types ---
type SimulatorState = "IDLE" | "FILLING" | "DOSING" | "SUPPLYING";

interface TierData {
    temp: number;
    hum: number;
    fan: boolean;
    heater: boolean;
    pest?: boolean; // 🐛 Pest Detected?
    growthDay: number; // Days since planting
    biomass: number;   // Current weight in grams (per tier)
}

// --- Logic Hook (Ref-based for Physics Loop stability) ---
const useNutrientSimulator = () => {
    // 1. Mutable State (The Physics Engine)
    const engine = useRef({
        state: "IDLE" as SimulatorState,
        subState: "",
        logMsg: "System Ready",
        autoMode: true,
        safetyLock: false,
        physics: {
            rawWaterLevel: 500, tankLevel: 0, tankA: 20, tankB: 20, tankAcid: 20,
            ec: 0.5, temp: 18.0, realPh: 7.0, sensorPh: 7.0,
            solarRad: 500, dosingTime: 0, totalA: 0, totalB: 0,
            phWaitTimer: 0, displayEc: 0.5, displayPh: 7.0, displayTemp: 18.0,
            rootStress: 0,    // Stress Level (0-100)
            lastShock: 0,     // Last Thermal Shock Delta
            dli: 0.0,         // Daily Light Integral (mol/m2/d)
            ppfd: 0           // Instantaneous Flux (umol/m2/s)
        },
        // Aeroponics Specific State
        // [FIX] Initialize Aeroponics in HF mode for immediate action
        aeroponics: {
            isSpraying: false,
            activeRack: null as number | null,
            pressure: 6.2,
            sprayTimer: 0,
            cycleMode: "HF",      // Start active
            rackDuration: 30,     // 3s spray
            rackGap: 10,          // 1s gap
            onDuration: 30,       // Legacy support
            offDuration: 50,      // 5s rest (Quick start)
            softStart: true,
            nozzleStatus: "OK"
        },
        env: {
            time: 9.0, // ☀️ Start at 9 AM
            airTemp: 20.0, airHum: 60.0, // WASABI OPTIMIZED (Mountain Cool)
            bedTemp: 19.0, bedHum: 45.0,
            externalTemp: 25.0, // Stable Mountain Temp
            // Initialize with 25 tiers (Static defaults for SSR safety)
            tiers: Array(25).fill(null).map((_, i) => ({
                temp: 24.0, hum: 60.0, fan: false, heater: false, pest: false,
                growthDay: 10,   // Static default
                biomass: 150.0   // Static default
            })) as TierData[]
        },
        // [NEW] Moving Light System
        lighting: {
            mode: "MOVING", // Default to Moving to show off the animation
            pos: 0.0,      // 0.0 (Bottom) ~ 4.0 (Top)
            speed: 0.1,    // Speed multiplier
            direction: 1,
            sides: "DOUBLE", // "SINGLE" | "DOUBLE"
            cameraOn: false,
            laserOn: false, // AI Defense Mode
            isFiring: false,
            pestAlarm: false
        },
        recycling: {
            // Sand Filter
            filterPressureIn: 2.5,
            filterPressureOut: 2.4,
            isBackwashing: false,
            backwashTimer: 0,

            // Activated Carbon Filter (New)
            carbonPressureIn: 2.3,
            carbonPressureOut: 2.2,
            isCarbonBackwashing: false,
            carbonBackwashTimer: 0,

            turbidity: 0.5, // NTU
            uvStatus: true,
            uvIntensity: 98,
            magneticMode: false, // 🧲 Default OFF
            magneticStrength: 150 // 150 mT (Optimal for growth)
        },
        actuators: {
            rawPump: false, inletValve: false, mixingPump: false, supplyPump: false, // High Pressure Pump stats
            supplyPumpMode: "A", // "A" or "B" (Dual Redundancy)
            valveA: 0, valveB: 0, acidValve: 0,
            chiller: false, uvLamp: true, sandFilter: false,
            // New Auto Valves
            autoValveSand: false,
            autoValveCarbon: false
        },
        hvac: {
            fan_circ: false, fan_exh: false, heater_bed: false
        },
        history: [] as any[], // [FIX] Hydration Mismatch: Initialize empty, populate in useEffect
        targets: { ec: 2.0, ph: 5.8, temp: 18.0, tolEc: 0.3, tolPh: 0.5, tolTemp: 2.0, dli: 5.0, ratioAB: 1.0 },
        systemStatus: {
            health: "OK" as "OK" | "WARNING" | "CRITICAL",
            message: "SYSTEM NOMINAL",
            remoteReady: true
        }
    });

    // 2. React State (For Rendering)
    const [renderTick, setRenderTick] = useState(0);

    // [HOTFIX] Force Migration to 25 Tiers on Mount/Update
    // [HOTFIX] State Validation on every Tick
    useEffect(() => {
        // 1. Tier Migration (Auto-Upgrade State) & Initial Randomization (Client Only)
        if (engine.current.env.tiers.length < 25 || !('growthDay' in engine.current.env.tiers[0]) || engine.current.env.tiers[0].biomass === 150.0) {
            console.warn("🌱 Initializing Client-side Biomass Data...");
            const currentTiers = engine.current.env.tiers;
            const newTiers = Array(25).fill(null).map((_, i) => {
                const existing = currentTiers[i];
                // Only randomize if it's the static default or missing
                const needsRandom = !existing || existing.biomass === 150.0;

                if (existing && !needsRandom) {
                    return existing;
                }

                return {
                    temp: 24.0, hum: 60.0, fan: false, heater: false, pest: false,
                    growthDay: Math.floor(Math.random() * 60),
                    biomass: 50 + Math.random() * 200
                } as TierData;
            });
            engine.current.env.tiers = newTiers;
        }

        // 2. Lighting Rescue (Fix NaN Bug)
        const l = engine.current.lighting;
        if (typeof l.pos !== 'number' || isNaN(l.pos)) {
            l.pos = 0.0;
            l.direction = 1;
            l.speed = 0.1;
            console.log("💡 Lighting System Reset");
        }
        if (!l.sides) (l as any).sides = "DOUBLE";

        // [FORCE RESET] Ensure new defaults are applied even if Ref is preserved
        if (renderTick < 2) {
            // Force Moving Mode
            if (l.mode === "FIXED") l.mode = "MOVING";
            // Force HF Mode if inactive
            if (engine.current.aeroponics.cycleMode === "STD") {
                engine.current.aeroponics.cycleMode = "HF";
                engine.current.aeroponics.offDuration = 50;
            }
        }

    }, [renderTick]);

    useEffect(() => {
        const interval = setInterval(() => {
            try {
                const e = engine.current;
                const p = e.physics;
                const aero = e.aeroponics;
                const act = e.actuators;
                const env = e.env;
                const hvac = e.hvac;
                const t = e.targets;

                // --- Aeroponic Cycle Logic ---
                // [FIXED] Removed the forced overwrite line. Duration is now fully state-controlled.

                // Sequence Logic: 5 Racks * (Duration + Gap)
                const seqStep = aero.rackDuration + aero.rackGap;
                const totalSeqTime = seqStep * 5;
                const cycleTotal = totalSeqTime + aero.offDuration;

                if (e.state === "SUPPLYING" || e.autoMode) {
                    aero.sprayTimer++;
                    const timeInCycle = aero.sprayTimer % cycleTotal;

                    if (timeInCycle < totalSeqTime) {
                        // --- SEQUENCE PHASE (Racks 0-4) ---
                        const currentRackIndex = Math.floor(timeInCycle / seqStep);
                        const timeInStep = timeInCycle % seqStep;

                        if (currentRackIndex < 5 && timeInStep < aero.rackDuration) {
                            // ** SPRAY ON (Specific Rack) **
                            aero.isSpraying = true;
                            aero.activeRack = currentRackIndex;

                            // Pressure Physics (Soft Start)
                            const rampSpeed = aero.softStart ? 0.05 : 0.8;
                            aero.pressure += (7.0 - aero.pressure) * rampSpeed;
                            act.supplyPump = true;

                            // Localized Cooling (Only current Rack's tiers)
                            const startTier = currentRackIndex * 5;
                            for (let i = startTier; i < startTier + 5; i++) {
                                const tier = env.tiers[i];
                                if (tier) {
                                    tier.temp += (p.temp - tier.temp) * 0.2; // Cool
                                    tier.hum = Math.min(100, tier.hum + 5.0);
                                }
                            }

                            // Global Consumption & Root Stress Recovery
                            // Global Consumption & Root Stress Recovery
                            const sprayRate = 0.05;
                            p.tankLevel = Math.max(0, p.tankLevel - sprayRate);
                            p.rootStress = Math.max(0, p.rootStress - 0.1);

                            // [DRAINAGE RECOVERY] 80% Returns to Intermediate Tank
                            p.rawWaterLevel = Math.min(1000, p.rawWaterLevel + (sprayRate * 0.8));

                            e.logMsg = `Aeroponics: 🚿 RACK 0${currentRackIndex + 1} ACTIVE`;

                        } else {
                            // ** GAP / PAUSE between Racks **
                            aero.isSpraying = false;
                            aero.activeRack = null;
                            aero.pressure += (0 - aero.pressure) * 0.2;
                            act.supplyPump = false;
                        }
                    } else {
                        // ** FULL IDLE PHASE **
                        aero.isSpraying = false;
                        aero.activeRack = null;
                        aero.pressure = 0;
                        act.supplyPump = false;

                        // Stress Accumulation (Heat Creep)
                        if (env.bedTemp > p.temp + 5) p.rootStress += 0.05;

                        const remaining = cycleTotal - timeInCycle;
                        if (remaining % 10 === 0) e.logMsg = `Aeroponics: IDLE (Next in ${(remaining / 10).toFixed(0)}s)`;
                    }
                } else {
                    aero.isSpraying = false;
                    aero.activeRack = null;
                    aero.pressure = 0;
                    e.logMsg = "Manual Control Mode";
                }

                // --- Feed System (Inline Mixing -> Buffer Tank) ---
                // Raw Pump = Fresh Water Supply (Cooling Effect)
                if (act.rawPump) {
                    p.rawWaterLevel = Math.min(1000, p.rawWaterLevel + 2.0);
                    // Cooling effect: Fresh water(15C) vs Tank(p.temp)
                    p.temp -= (p.temp - 15.0) * 0.002;
                }

                // Inlet Valve: Feeds Raw Water into Line Mixer -> Buffer Tank
                if (act.inletValve && p.rawWaterLevel > 0) {
                    p.tankLevel += 0.5; p.rawWaterLevel -= 0.5;
                    // Dilution effect in Buffer Tank
                    if (p.tankLevel > 0) {
                        p.ec = (p.ec * (p.tankLevel - 0.5) + 0.5 * 0.5) / p.tankLevel;
                        p.realPh = (p.realPh * (p.tankLevel - 0.5) + 7.0 * 0.5) / p.tankLevel;
                    }
                }
                // Ext Temp (Stable Mountain Air)
                env.externalTemp = 25.0 + Math.sin(Date.now() / 20000) * 1.5;

                // Heat Model (Insulated Indoor Farm - Sandwich Panel)
                // SolarRad is treated as LED Heat Load here
                if (hvac.fan_exh) env.airTemp -= 0.08; // Cool mountain air ventilation effective
                else env.airTemp += (p.solarRad / 40000) + (env.externalTemp - env.airTemp) * 0.0005;

                // Dosing logic
                if (act.valveA > 0) { p.tankA -= 0.01 * act.valveA; p.ec += 0.05 * act.valveA; }
                if (act.valveB > 0) { p.tankB -= 0.01 * act.valveB; p.ec += 0.05 * act.valveB; }
                if (act.acidValve > 0) { p.realPh -= 0.1 * act.acidValve; }
                p.sensorPh += (p.realPh - p.sensorPh) * 0.05;

                // --- 1. Sand Filter Physics (Auto Valve Logic) ---
                const rec = e.recycling;

                // Clock (Simulated Time Flow)
                const prevTime = env.time || 9.0;
                env.time = prevTime + 0.005;

                // Midnight Reset
                if (env.time >= 24) {
                    env.time = 0;
                    p.dli = 0;
                    e.logMsg = "📅 NEW DAY: DLI RESET";
                }

                const isNight = env.time >= 22 || env.time <= 5;

                // --- DLI Calculator ---
                // 1. Solar PPFD (Approx 2.1 umol/J for sunlight, varies by spectrum)
                const ppfdSolar = p.solarRad * 2.1;

                // 2. LED PPFD (Contribution based on mode)
                // Moving Mode reduces avg intensity per spot but increases uniformity
                const ppfdLed = (e.lighting.mode === "MOVING") ? 180 : 300;

                // Total Instantaneous PPFD (umol/m2/s)
                p.ppfd = ppfdSolar + ppfdLed;

                // Accumulate DLI (mol/m2/day)
                // Sim Step: 0.005 hr = 18 seconds
                p.dli += (p.ppfd * 18) / 1000000;

                // Normal Filtering Mode
                if (act.supplyPump && !act.autoValveSand) {
                    rec.filterPressureIn = 3.0 + (Math.sin(Date.now() / 1000) * 0.1);
                    rec.turbidity = Math.min(20.0, rec.turbidity + 0.002); // Clogging over time
                    rec.filterPressureOut = rec.filterPressureIn - 0.2 - (rec.turbidity * 0.1);
                } else {
                    rec.filterPressureIn = 0.5; rec.filterPressureOut = 0.5;
                }

                const sandDiff = rec.filterPressureIn - rec.filterPressureOut;

                // [LOGIC] Backwash Trigger: Diff > 1.2 AND Night Time AND Pump OFF
                if (sandDiff > 1.2 && isNight && !act.supplyPump && !act.autoValveSand) {
                    act.autoValveSand = true;
                    rec.backwashTimer = 80;
                    e.logMsg = "🌙 NIGHT OPS: SAND FILTER AUTO-BACKWASH START";
                } else if (sandDiff > 1.2 && !isNight && !act.autoValveSand) {
                    if (Math.random() < 0.005) e.logMsg = "⚠️ FILTER CLOGGED - SCHEDULED FOR TONIGHT";
                }

                // Backwashing Process
                if (act.autoValveSand) {
                    act.sandFilter = true; rec.backwashTimer--;
                    rec.turbidity = Math.max(0.2, rec.turbidity - 0.3); // Cleaning
                    p.tankLevel = Math.max(0, p.tankLevel - 0.1); // Waste water discharge

                    if (rec.backwashTimer <= 0) {
                        act.autoValveSand = false; act.sandFilter = false;
                        e.logMsg = "✅ SAND FILTER CLEANED";
                    }
                }

                // --- 2. Activated Carbon Filter Physics (Post-Sand) ---
                // Only receives water if Sand Filter is NOT backwashing
                if (act.supplyPump && !act.autoValveSand && !act.autoValveCarbon) {
                    rec.carbonPressureIn = rec.filterPressureOut - 0.1;
                    rec.carbonPressureOut = rec.carbonPressureIn - 0.1 - (rec.turbidity * 0.05);
                } else {
                    rec.carbonPressureIn = 0.4; rec.carbonPressureOut = 0.4;
                }

                const carbonDiff = rec.carbonPressureIn - rec.carbonPressureOut;

                // Carbon Backwash (Night Only)
                if (carbonDiff > 0.8 && isNight && !act.supplyPump && !act.autoValveCarbon && !act.autoValveSand) {
                    act.autoValveCarbon = true;
                    rec.carbonBackwashTimer = 60;
                    e.logMsg = "🌙 NIGHT OPS: CARBON FILTER AUTO-BACKWASH START";
                }

                // Carbon Backwash (Night Only)
                if (carbonDiff > 0.8 && isNight && !act.supplyPump && !act.autoValveCarbon && !act.autoValveSand) {
                    act.autoValveCarbon = true;
                    rec.carbonBackwashTimer = 60;
                    e.logMsg = "🌙 NIGHT OPS: CARBON FILTER AUTO-BACKWASH START";
                }

                if (act.autoValveCarbon) {
                    rec.carbonBackwashTimer--;
                    p.tankLevel = Math.max(0, p.tankLevel - 0.05);
                    if (rec.carbonBackwashTimer <= 0) {
                        act.autoValveCarbon = false;
                        e.logMsg = "✅ CARBON FILTER CLEANED";
                    }
                }

                // --- Magnetotropism Physics (Root Boosting) ---
                // [Independent Logic]
                if (rec.magneticMode) {
                    // 1. Antioxidant Effect: Reduce Root Stress
                    if (p.rootStress > 0) p.rootStress -= 0.05;

                    // 2. Enhanced Uptake (Magnetized Water)
                    if (act.supplyPump) {
                        // Consumes nutrients slightly faster (simulating better absorption)
                        p.ec = Math.max(0, p.ec - 0.0002);
                        // Plants drink more water
                        p.tankLevel -= 0.02;
                    }
                }

                // Lighting Physics (Moving)
                const l = e.lighting;
                if (l.mode === "MOVING") {
                    l.pos += l.speed * l.direction * 0.5;
                    if (l.pos >= 4.0) { l.pos = 4.0; l.direction = -1; }
                    if (l.pos <= 0.0) { l.pos = 0.0; l.direction = 1; }

                    // --- AI VISION & LASER DEFENSE ---
                    const scanLevel = Math.round(l.pos); // 0 (Bottom) to 4 (Top)
                    l.isFiring = false;

                    // Global pest check for alarm
                    const activePests = env.tiers.filter(t => t.pest).length;
                    l.pestAlarm = activePests > 0;

                    if (l.cameraOn) {
                        // 1. Pest Spawn Logic (Random)
                        if (Math.random() < 0.005) { // Reduced spawn rate for better simulation
                            const randIdx = Math.floor(Math.random() * 25);
                            if (env.tiers[randIdx] && !env.tiers[randIdx].pest) {
                                env.tiers[randIdx].pest = true;
                                p.rootStress += 5; // Pest causes stress
                            }
                        }

                        // 2. Scan & Destroy (Only if Laser is ON/Armed)
                        for (let r = 0; r < 5; r++) {
                            const targetIdx = r * 5 + scanLevel;
                            const tier = env.tiers[targetIdx];

                            if (tier && tier.pest && l.laserOn) {
                                // ⚡ LASER STRIKE (Destroys pest immediately)
                                tier.pest = false;
                                l.isFiring = true;
                                p.rootStress = Math.max(0, p.rootStress - 5);
                            }
                        }
                    }
                }

                // Tier Physics (Stack Effect + Light Heat)
                env.tiers.forEach((tier, i) => {
                    if (!tier) return;
                    const tierLevel = i % 5;
                    const heightOffset = -1.0 + (tierLevel * 0.75);

                    // Light Intensity Calc
                    let lightIntensity = 1.0;
                    if (l.mode === "MOVING") {
                        // Beam A (Primary/Left)
                        const distA = Math.abs(tierLevel - l.pos);
                        let intensity = Math.exp(-Math.pow(distA / 0.6, 2));

                        if (l.sides === "DOUBLE") {
                            // Beam B (Secondary/Right - Counter Movement)
                            const posB = 4.0 - l.pos;
                            intensity += Math.exp(-Math.pow(Math.abs(tierLevel - posB) / 0.6, 2));
                        } else {
                            // SINGLE Mode Penalty
                            intensity *= 0.6;
                        }
                        lightIntensity = intensity;
                    }

                    let targetTemp = env.airTemp + heightOffset;
                    // LED Heat (Direct influence) [AMPLIFIED FOR DEMO]
                    targetTemp += (p.solarRad * lightIntensity / 120); // Heat only when lit

                    // Evaporative Cooling is stronger if mist just happened (simplified by hum)
                    targetTemp -= (tier.hum - 50) * 0.05;

                    if (tier.fan) targetTemp -= 1.5;
                    tier.temp += (targetTemp - tier.temp) * 0.05;

                    let targetHum = env.airHum + (4 - tierLevel) * 2;
                    if (tier.fan) targetHum -= 5.0;
                    tier.hum += (targetHum - tier.hum) * 0.05;

                    // --- GROWTH & BIOMASS SIMULATION ---
                    // Wasabi grows best at 12-15°C. Heat slows it down.
                    const isOptimal = tier.temp >= 12 && tier.temp <= 22;
                    const growthRate = isOptimal ? 0.005 : 0.001; // g per tick

                    if (!tier.pest) {
                        tier.biomass += growthRate;
                    }

                    // Age Simulation (Roughly)
                    if (Math.random() < 0.01) tier.growthDay += 0.01;
                });

                // HVAC
                if (act.chiller) p.temp -= 0.1; else p.temp += (env.airTemp - p.temp) * 0.005; // Chiller affects nutrient temp

                // Display Noise
                p.displayEc = p.ec + (Math.random() - 0.5) * 0.02;
                p.displayPh = p.sensorPh + (Math.random() - 0.5) * 0.04;
                p.displayTemp = p.temp + (Math.random() - 0.5) * 0.2;

                // --- Control Logic ---
                if (e.autoMode) {
                    // Precision Tier Control
                    env.tiers.forEach(tier => {
                        if (tier && tier.temp > t.temp + 0.5) tier.fan = true;
                        else if (tier && tier.temp < t.temp) tier.fan = false;
                    });

                    if (p.solarRad > 700) t.ec = 2.4; else t.ec = 1.6;

                    if (p.rawWaterLevel < 200) act.rawPump = true; else if (p.rawWaterLevel > 900) act.rawPump = false;
                    if (p.displayTemp > t.temp + t.tolTemp) act.chiller = true; else if (p.displayTemp < t.temp - 0.5) act.chiller = false;

                    const deltaExt = Math.abs(env.airTemp - env.externalTemp);
                    if (deltaExt > 6.0) hvac.fan_circ = true;

                    if (env.airTemp > t.temp + 5.0) hvac.fan_exh = true;
                    else if (env.airTemp < t.temp + 2.0) hvac.fan_exh = false;

                    // --- System Health Check (Failsafe for Remote Control) ---
                    const s = e.systemStatus;
                    let newHealth: "OK" | "WARNING" | "CRITICAL" = "OK";
                    let newMsg = "SYSTEM NOMINAL";

                    // 1. Critical Faults (Disable Remote)
                    if (p.tankLevel <= 5 && !act.inletValve) { newHealth = "CRITICAL"; newMsg = "ERR: BUFFER TANK EMPTY"; }
                    else if (p.rawWaterLevel <= 10) { newHealth = "CRITICAL"; newMsg = "ERR: RAW WATER SOURCE EMPTY"; }
                    else if (p.displayPh < 3.0 || p.displayPh > 9.0) { newHealth = "CRITICAL"; newMsg = "ALARM: pH CRITICAL LEVEL"; }
                    else if (p.displayEc > 4.5) { newHealth = "CRITICAL"; newMsg = "ALARM: EC DANGEROUS HIGH"; }

                    // 2. Warnings (Remote Allowed but Caution)
                    else if (p.tankLevel < 20) { newHealth = "WARNING"; newMsg = "WARN: LOW BUFFER LEVEL"; }
                    else if (Math.abs(t.ec - p.displayEc) > 0.5) { newHealth = "WARNING"; newMsg = "WARN: UNSTABLE EC"; }
                    else if (p.rootStress > 50) { newHealth = "WARNING"; newMsg = "WARN: CROP STRESS HIGH"; }
                    else if (rec.filterPressureIn - rec.filterPressureOut > 1.5) { newHealth = "WARNING"; newMsg = "MAINT: FILTER CLOGGED"; }

                    s.health = newHealth;
                    s.message = newMsg;
                    s.remoteReady = (newHealth !== "CRITICAL");

                    // State Machine Transition
                    act.valveA = 0; act.valveB = 0; act.acidValve = 0;
                    const ecError = t.ec - p.displayEc;
                    const phError = p.displayPh - t.ph;
                    e.safetyLock = false;

                    if (e.state === "IDLE") {
                        p.dosingTime = 0; act.mixingPump = false;
                        if (p.tankLevel < 20) e.state = "FILLING";
                    } else if (e.state === "FILLING") {
                        act.inletValve = true;
                        if (p.tankLevel >= 160) { act.inletValve = false; e.state = "DOSING"; }
                    } else if (e.state === "DOSING") {
                        act.mixingPump = true;
                        if (p.phWaitTimer > 0) {
                            p.phWaitTimer -= 1; e.subState = `Reacting...`; e.safetyLock = true;
                        } else if (Math.abs(phError) > t.tolPh * 0.2) {
                            e.subState = "Acid Dosing"; act.acidValve = 1.0; p.phWaitTimer = 30; e.safetyLock = true;
                        } else if (ecError > t.tolEc * 0.2) {
                            const tick = Math.floor(Date.now() / 500);

                            // A/B Ratio Logic (Adjusts valve opening based on Recipe)
                            // ratioAB = (Part A Volume) / (Part B Volume)
                            if (tick % 2 === 0) {
                                // A-Sol Injection
                                e.subState = "A-Sol";
                                act.valveA = t.ratioAB >= 1.0 ? 1.0 : t.ratioAB;
                            } else {
                                // B-Sol Injection
                                e.subState = "B-Sol";
                                act.valveB = t.ratioAB >= 1.0 ? (1.0 / t.ratioAB) : 1.0;
                            }

                            e.safetyLock = true;
                        } else { e.subState = "Stabilizing"; }
                        if (Math.abs(ecError) < 0.1 && Math.abs(phError) < 0.1 && p.phWaitTimer === 0) e.state = "SUPPLYING";
                    } else if (e.state === "SUPPLYING") {
                        act.mixingPump = true;
                        if (p.tankLevel < 20) e.state = "IDLE";
                    }
                }

                // --- Auto Data Logging (Fix for Graph) ---
                if (Math.random() < 0.2) { // Robust Logging: Sample approx every 0.5s
                    const h = engine.current.history;
                    const nowStr = new Date().toLocaleTimeString();
                    if (h.length === 0 || h[h.length - 1].name !== nowStr) {
                        // Calculate artificial stress
                        const stress = Math.abs(engine.current.targets.ec - engine.current.physics.displayEc) * 20
                            + Math.abs(engine.current.targets.ph - engine.current.physics.displayPh) * 10;

                        h.push({
                            name: nowStr,
                            ec: engine.current.physics.displayEc,
                            ph: engine.current.physics.displayPh,
                            temp: engine.current.physics.displayTemp,
                            level: engine.current.physics.tankLevel,
                            targetEc: engine.current.targets.ec,
                            stress: Math.min(100, Math.max(0, stress))
                        });
                        if (h.length > 60) h.shift();
                    }
                }
            } catch (err) {
                console.error("SIM ERROR:", err);
            }
            setRenderTick(t => t + 1);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const setSolar = (v: number) => { engine.current.physics.solarRad = v; setRenderTick(t => t + 1); };
    const setAuto = (v: boolean) => { engine.current.autoMode = v; setRenderTick(t => t + 1); };
    const setCycleMode = (m: string) => {
        const e = engine.current.aeroponics;
        e.cycleMode = m;
        if (m === "STD") e.offDuration = 300; // 30s
        if (m === "HF") e.offDuration = 100;  // 10s
        setRenderTick(t => t + 1);
    };
    const setIntervalTime = (sec: number) => {
        const e = engine.current.aeroponics;
        e.offDuration = sec * 10; // Convert sec to ticks
        e.cycleMode = "CUSTOM";
        setRenderTick(t => t + 1); // Force immediate re-render for smooth slider
    };
    const toggleSoftStart = () => { engine.current.aeroponics.softStart = !engine.current.aeroponics.softStart; setRenderTick(t => t + 1); };
    const toggleActuator = (key: keyof typeof engine.current.actuators) => {
        const val = engine.current.actuators[key];
        if (key === 'supplyPumpMode') {
            engine.current.actuators.supplyPumpMode = val === "A" ? "B" : "A";
        } else if (typeof val === 'boolean') {
            (engine.current.actuators as any)[key] = !val;
        } else if (typeof val === 'number') {
            (engine.current.actuators as any)[key] = val > 0 ? 0 : 1.0;
        }
        setRenderTick(t => t + 1);
    };
    const toggleHvac = (key: keyof typeof engine.current.hvac) => { engine.current.hvac[key] = !engine.current.hvac[key]; setRenderTick(t => t + 1); };
    const toggleTierFan = (index: number) => {
        engine.current.env.tiers[index].fan = !engine.current.env.tiers[index].fan;
        setRenderTick(t => t + 1);
    };
    const toggleLightingMode = () => {
        const l = engine.current.lighting;
        l.mode = l.mode === "FIXED" ? "MOVING" : "FIXED";
        setRenderTick(t => t + 1);
    };
    const toggleLightSides = () => {
        const l = engine.current.lighting;
        l.sides = l.sides === "DOUBLE" ? "SINGLE" : "DOUBLE";
        setRenderTick(t => t + 1);
    };
    const toggleMagnetic = () => {
        engine.current.recycling.magneticMode = !engine.current.recycling.magneticMode;
        setRenderTick(t => t + 1);
    };

    const setRatio = (v: number) => {
        engine.current.targets.ratioAB = v;
        setRenderTick(t => t + 1);
    };

    const downloadHistory = () => {
        const data = engine.current.history;
        if (!data || data.length === 0) {
            alert("No simulation data available to export.");
            return;
        }

        const csvContent = [
            "Timestamp,EC(mS/cm),pH,Temp(°C),BufferLevel(L),TargetEC,Stress(%)",
            ...data.map((r: any) => `${r.name},${r.ec.toFixed(3)},${r.ph.toFixed(2)},${r.temp.toFixed(1)},${r.level.toFixed(1)},${r.targetEc.toFixed(2)},${r.stress.toFixed(1)}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `K-WASABI_Log_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleLaser = () => {
        const l = engine.current.lighting;
        l.laserOn = !l.laserOn;
        l.cameraOn = l.laserOn; // Auto-enable camera with laser
        setRenderTick(t => t + 1);
    };

    return { ...engine.current, setSolar, setAuto, setCycleMode, setIntervalTime, toggleSoftStart, toggleActuator, toggleHvac, toggleTierFan, toggleLightingMode, toggleLightSides, toggleMagnetic, setRatio, downloadHistory, toggleLaser } as any;
};

// --- GAUGE COMPONENTS ---
const MustangNeedle = ({ angle, color = "#e74c3c" }: { angle: number, color?: string }) => (
    <>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: `70px solid ${color}`, transformOrigin: 'bottom center', transform: `translateX(-50 %) rotate(${angle}deg)`, transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 50, filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }} />
        <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #555, #000)', border: '2px solid #333', zIndex: 60, boxShadow: '0 2px 5px rgba(0,0,0,0.8)' }}></div>
    </>
);
// ... Reuse Bezels for brevity if needed, but here writing compact for reliability ...
const GaugeBezel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ position: 'relative', width: '100%', height: '100px', margin: '0 auto', maxWidth: 180, padding: '10px', background: '#151515', borderRadius: '90px 90px 0 0', boxShadow: `inset 0 2px 5px rgba(255, 255, 255, 0.2), 0 5px 15px rgba(0, 0, 0, 0.8), 0 0 0 4px #2c3e50, 0 0 0 6px #555`, overflow: 'hidden' }}>{children}</div>
);
const SemiCircleGauge = ({ value, label, unit, min, max }: any) => {
    const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const angle = -90 + (pct * 180);
    return (
        <div style={{ width: '100%', maxWidth: 180, margin: '0 auto' }}>
            <GaugeBezel>
                <div style={{ position: 'absolute', top: 10, left: 10, right: 10, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, #222 0%, #000 90%)' }} />
                <div style={{ position: 'absolute', top: 10, left: 10, right: 10, height: 160, borderRadius: '50%', background: `conic - gradient(from 270deg, #3498db 0deg 60deg, #2ecc71 60deg 120deg, #e74c3c 120deg 180deg, transparent 180deg)`, clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", opacity: 0.9 }}></div>
                <MustangNeedle angle={angle} color="#e74c3c" />
            </GaugeBezel>
            <div style={{ textAlign: 'center', marginTop: '-35px', position: 'relative', zIndex: 70 }}>
                <Text size={rem(24)} fw={600} c="white">{value.toFixed(2)}</Text>
                <Text size="xs" c="dimmed" fw={500}>{unit}</Text>
            </div>
        </div>
    )
}
const PressureGauge = ({ value }: { value: number }) => (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg viewBox="0 0 100 100">
            <path d="M 20 85 A 40 40 0 1 1 80 85" fill="none" stroke="#2C2E33" strokeWidth="8" strokeLinecap="round" />
            <path d="M 20 85 A 40 40 0 1 1 80 85" fill="none" stroke={value > 6 ? "#40C057" : "#228BE6"} strokeWidth="8" strokeDasharray="250" strokeDashoffset={250 - (Math.min(value, 10) / 10) * 250} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.2s' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, transform: `rotate(${(Math.min(value, 10) / 10) * 260 - 130}deg)`, transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)' }}>
            <div style={{ position: 'absolute', bottom: -0, left: -2, width: 4, height: 45, background: '#FA5252', borderRadius: '4px 4px 0 0' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 25, left: 0, right: 0, textAlign: 'center' }}>
            <Text c="white" fw={600} size="lg" style={{ lineHeight: 1 }}>{value.toFixed(1)}</Text>
            <Text c="dimmed" size={rem(10)} fw={500}>BAR</Text>
        </div>
    </div>
);

// --- Tier Monitor Row (Split-Chamber Design) ---
const TierMonitorRow = ({ sim, index, tier, isSpraying, lightPos, lightMode, lightSides }: any) => {
    // Safety check
    if (!tier) return <div style={{ height: 34, background: '#222', borderRadius: 4 }}></div>;

    const isAuto = sim.autoMode;
    const tierLevel = index % 5;

    // --- Vivid Palette ---
    const colorA = '#ffd43b';
    const colorB = '#4dabf7';

    // --- Lighting Logic (Seesaw) ---
    let isLitA = false; // Left (Yellow)
    let isLitB = false; // Right (Blue)

    if (!lightMode || lightMode === "FIXED") {
        isLitA = true;
        if (lightSides === "DOUBLE") isLitB = true;
    } else {
        // MOVING Mode
        const distA = Math.abs(tierLevel - lightPos);
        if (Math.exp(-Math.pow(distA / 0.6, 2)) > 0.3) isLitA = true; // Left

        if (lightSides === "DOUBLE") {
            const posB = 4.0 - lightPos;
            const distB = Math.abs(tierLevel - posB);
            if (Math.exp(-Math.pow(distB / 0.6, 2)) > 0.3) isLitB = true; // Right
        }
    }

    // --- Styles ---
    const sideStyle = (isActive: boolean, color: string, isLeft: boolean) => {
        let borderRight = isLeft ? '1px solid #2C2E33' : 'none';
        let borderLeft = 'none';

        if (isActive) {
            if (isLeft) borderLeft = `3px solid ${color}`;
            else borderRight = `3px solid ${color}`;
        }

        return {
            flex: 1,
            height: '100%',
            // ULTRA BRIGHT LED MODE
            // Edge is 100% opaque Color (Source), fading to 30% (Center)
            background: isActive
                ? `linear-gradient(${isLeft ? '90deg' : '-90deg'}, ${color} 0%, ${color}4D 100%)`
                : '#141517',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative' as any,
            transition: 'background 0.1s, box-shadow 0.1s', // Faster transition for snappy LED feel
            // Intense Inner Glow + Slight Color Wash
            boxShadow: isActive ? `inset 0 0 30px ${color}80` : 'none',
            borderLeft: borderLeft,
            borderRight: borderRight
        };
    };

    return (
        <div style={{
            height: 38,
            display: 'flex',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid #2C2E33',
            position: 'relative',
            background: '#101113'
        }}>
            {/* Left Chamber (Vivid Yellow) */}
            <div style={sideStyle(isLitA, colorA, true)}>
            </div>

            {/* Right Chamber (Vivid Blue) */}
            <div style={sideStyle(isLitB, colorB, false)}>
            </div>

            {/* Spraying Overlay (Full Width Flash) */}
            {isSpraying && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, rgba(34, 184, 207, 0.2) 0%, rgba(34, 184, 207, 0.0) 50%, rgba(34, 184, 207, 0.2) 100%)',
                    zIndex: 1, pointerEvents: 'none'
                }} />
            )}

            {/* PEST OVERLAY (Pulse Red) */}
            {tier.pest && (
                <div style={{
                    position: 'absolute', inset: 0,
                    border: '2px dashed #fa5252',
                    zIndex: 5, pointerEvents: 'none',
                    animation: 'pulse 0.5s infinite',
                    boxShadow: 'inset 0 0 15px rgba(250, 82, 82, 0.4)'
                }} />
            )}

            {/* LASER BEAM EFFECT */}
            {sim.lighting.isFiring && (index % 5 === Math.round(sim.lighting.pos)) && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(rgba(81, 207, 102, 0.4), rgba(81, 207, 102, 0.2))',
                    borderLeft: '4px solid #51cf66',
                    borderRight: '4px solid #51cf66',
                    zIndex: 6, pointerEvents: 'none',
                    boxShadow: '0 0 20px #51cf66'
                }} />
            )}

            {/* Center Data Overlay (Floating) */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 8px'
            }}>
                <Group gap={6}>
                    <Badge size="xs" color="dark" variant="filled" circle style={{ border: '1px solid #444' }}>
                        {tierLevel + 1}
                    </Badge>
                    <Stack gap={0}>
                        <Text size={rem(11)} fw={700} c="white" style={{ lineHeight: 1, textShadow: '0 1px 2px black' }}>{tier.temp.toFixed(1)}°</Text>
                        <Group gap={2}>
                            <Text size={rem(9)} c="dimmed" style={{ lineHeight: 1 }}>{tier.hum.toFixed(0)}%</Text>
                            {tier.pest && <Activity size={8} color="red" />}
                        </Group>
                    </Stack>
                </Group>

                <ActionIcon
                    size="sm"
                    variant={tier.fan ? "filled" : "subtle"}
                    color={tier.pest ? "red" : (tier.fan ? "cyan" : "gray")}
                    disabled={isAuto}
                    onClick={() => sim.toggleTierFan(index)}
                    style={{ opacity: isAuto ? 0.5 : 1 }}
                >
                    {tier.pest ? <AlertTriangle size={12} /> : <Fan size={12} className={tier.fan ? "spin-fast" : ""} />}
                </ActionIcon>
            </div>
        </div>
    );
};

// --- Recycling & Water Panel ---
// --- Recycling & Water Panel (Compact) ---
const RecyclingPanel = ({ sim }: any) => {
    const rec = sim.recycling || {};
    const act = sim.actuators || {};

    // Logic
    const isSandClogged = (rec.filterPressureIn - rec.filterPressureOut) > 1.2;
    const isCarbonClogged = (rec.carbonPressureIn - rec.carbonPressureOut) > 0.8;
    const isSandWashing = !!act.autoValveSand;
    const isCarbonWashing = !!act.autoValveCarbon;

    // Mini Status Row
    const StatusRow = ({ label, isWashing, isClogged, val1, val2 }: any) => (
        <Group justify="space-between" mb={4}>
            <Group gap={4}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: isWashing ? '#fcc419' : isClogged ? '#fa5252' : '#40c057' }} />
                <Text size="xs" c="dimmed">{label}</Text>
            </Group>
            {isWashing ? <Text size="xs" c="yellow" fw={700}>WASHING</Text> :
                isClogged ? <Text size="xs" c="red" fw={700}>CLOGGED</Text> :
                    <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>{val1.toFixed(1)}/{val2.toFixed(1)}bar</Text>
            }
        </Group>
    );

    return (
        <Paper p="xs" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#373A40', height: '100%' }}>
            <Group justify="space-between" mb="xs">
                <Group gap={4}>
                    <ThemeIcon size="xs" color="blue" variant="transparent"><Droplet size={14} /></ThemeIcon>
                    <Text fw={600} size="sm" c="white">WATER CYCLE</Text>
                </Group>
                <Text size="xs" c="dimmed">{Math.floor(sim.env.time)}:{(Math.floor((sim.env.time % 1) * 60)).toString().padStart(2, '0')}</Text>
            </Group>

            <Paper p="xs" bg="#141517" radius="md" mb="xs">
                <Text size="xs" c="dimmed" fw={600} mb={4}>FILTRATION</Text>
                <StatusRow label="Sand Filter" isWashing={isSandWashing} isClogged={isSandClogged} val1={rec.filterPressureIn} val2={rec.filterPressureOut} />
                <StatusRow label="Carbon Filter" isWashing={isCarbonWashing} isClogged={isCarbonClogged} val1={rec.carbonPressureIn} val2={rec.carbonPressureOut} />
            </Paper>

            <SimpleGrid cols={2} spacing={4}>
                <Button fullWidth size="compact-xs"
                    color="grape" variant="light"
                    leftSection={<Zap size={10} />}
                    style={{ justifyContent: 'space-between' }}
                >
                    UV 99%
                </Button>
                <Button fullWidth size="compact-xs"
                    color={rec.magneticMode ? "lime" : "gray"}
                    variant={rec.magneticMode ? "light" : "outline"}
                    onClick={sim.toggleMagnetic}
                    leftSection={<Magnet size={10} />}
                >
                    {rec.magneticMode ? "MAG ON" : "MAG OFF"}
                </Button>
            </SimpleGrid>
        </Paper>
    );
};

// --- Aeroponic Panel (Compact) ---
const AeroponicPanel = ({ sim }: any) => {
    const activeRack = sim.aeroponics.activeRack;
    const statusText = sim.aeroponics.activeRack !== null ? `SPRAYING Z${activeRack + 1}` : `PRESSURIZING`;

    return (
        <Paper p="xs" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#373A40', height: '100%' }}>
            <Group justify="space-between" mb="xs">
                <Group gap={4}>
                    <ThemeIcon size="xs" color="cyan" variant="transparent"><Wind size={14} /></ThemeIcon>
                    <Text fw={600} size="sm" c="white">AEROPONICS</Text>
                </Group>
                <Badge size="xs" variant="outline" color={activeRack !== null ? "cyan" : "gray"}>{statusText}</Badge>
            </Group>

            {/* Visual Dots */}
            <Group gap={4} mb="sm" justify="center">
                {[0, 1, 2, 3, 4].map(idx => (
                    <div key={idx} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: activeRack === idx ? '#22b8cf' : '#333',
                        transition: 'all 0.2s'
                    }} />
                ))}
            </Group>

            <Group grow align="flex-start">
                <Stack gap={0}>
                    <Text size="xs" c="dimmed">Metering Pres.</Text>
                    <Text size="xl" fw={600} c="white" style={{ lineHeight: 1 }}>{sim.aeroponics.pressure.toFixed(1)} <span style={{ fontSize: 10, color: '#888' }}>bar</span></Text>
                </Stack>
                <Stack gap={4}>
                    <Group grow gap={4}>
                        <Button
                            size="compact-xs"
                            color={sim.actuators.supplyPumpMode === "A" ? (sim.actuators.supplyPump ? "green" : "teal") : "dark"}
                            variant={sim.actuators.supplyPumpMode === "A" ? "filled" : "default"}
                            onClick={() => sim.toggleActuator('supplyPumpMode')}
                        >
                            METERING A
                        </Button>
                        <Button
                            size="compact-xs"
                            color={sim.actuators.supplyPumpMode === "B" ? (sim.actuators.supplyPump ? "green" : "teal") : "dark"}
                            variant={sim.actuators.supplyPumpMode === "B" ? "filled" : "default"}
                            onClick={() => sim.toggleActuator('supplyPumpMode')}
                        >
                            METERING B
                        </Button>
                    </Group>
                    <Button
                        fullWidth size="compact-xs"
                        color={sim.actuators.mixingPump ? "grape" : "dark"}
                        variant={sim.actuators.mixingPump ? "filled" : "default"}
                        onClick={() => sim.toggleActuator('mixingPump')}
                        style={{ border: sim.actuators.mixingPump ? '1px solid #be4bdb' : '1px solid #333' }}
                    >
                        AGIT PUMP (MIXING) {sim.actuators.mixingPump ? "(ON)" : ""}
                    </Button>
                </Stack>
            </Group>
            <Group justify="space-between" mt="xs" align="center" gap="xs">
                <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>Rest Interval: <span style={{ color: 'white', fontWeight: 600 }}>{(sim.aeroponics.offDuration / 10).toFixed(0)}s</span></Text>
                <Slider style={{ flex: 1 }} size="xs" color="blue" min={10} max={120} step={5} value={sim.aeroponics.offDuration / 10} onChange={sim.setIntervalTime} label={null} />
            </Group>
        </Paper>
    );
};

// --- Live Trend Chart ---
const LiveTrendChart = ({ data, keys, colors, min, max, title, unit }: any) => {
    // [FIX] Ensure data is an array
    const rawData = Array.isArray(data) ? data : [];
    // [FIX] If only 1 data point, duplicate it to draw a flat line instead of nothing
    const safeData = rawData.length === 1 ? [rawData[0], rawData[0]] : rawData;
    const hasData = safeData.length > 1;

    const width = 100;
    const height = 40;

    // [FIX] NaN protection
    const getY = (val: any) => {
        const v = typeof val === 'number' && !isNaN(val) ? val : min;
        return height - (Math.max(0, Math.min(1, (v - min) / (max - min))) * height);
    };

    return (
        <Paper p="sm" bg="#1A1B1E" radius="md" withBorder style={{ borderColor: '#373A40' }}>
            <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" fw={700}>{title}</Text>
                <Group gap="xs">
                    {keys.map((k: any, i: number) => {
                        const lastItem = safeData[safeData.length - 1];
                        const val = lastItem ? lastItem[k] : undefined;
                        return (
                            <Text key={k} size="xs" c={colors[i]} fw={700}>
                                {typeof val === 'number' ? val.toFixed(1) : '-'}{unit}
                            </Text>
                        );
                    })}
                </Group>
            </Group>
            <div style={{ position: 'relative', height: '60px', width: '100%' }}>
                {!hasData && (
                    <Center style={{ position: 'absolute', inset: 0 }}>
                        <Text size="xs" c="dimmed">Waiting for data...</Text>
                    </Center>
                )}
                <svg viewBox={`0 0 ${width} ${height} `} style={{ width: '100%', height: '100%', overflow: 'visible', opacity: hasData ? 1 : 0.2 }}>
                    <line x1="0" y1="0" x2={width} y2="0" stroke="#333" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#333" strokeWidth="0.5" />
                    <line x1="0" y1={height} x2={width} y2={height} stroke="#333" strokeWidth="0.5" />

                    {hasData && keys.map((k: string, idx: number) => (
                        <polyline
                            key={k}
                            points={safeData.map((d: any, i: number) => {
                                const y = getY(d[k]);
                                const x = (i / (safeData.length - 1)) * width;
                                return `${x},${y} `;
                            }).join(" ")}
                            fill="none"
                            stroke={colors[idx]}
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
            </div>
        </Paper>
    );
};

const HarvestPanel = ({ sim }: any) => {
    const { t, language } = useTranslation();
    // Analytics
    const totalBiomass = sim.env.tiers.reduce((acc: number, t: TierData) => acc + (t.biomass || 0), 0) / 1000; // kg
    const harvestReadyCount = sim.env.tiers.filter((t: TierData) => (t.biomass || 0) > 200).length; // >200g is ready

    // Revenue Model (Root vs Stem/Leaf)
    const rootRatio = 0.35; // 35% Root
    const leafRatio = 0.65; // 65% Leaf/Stem

    const rootWeight = totalBiomass * rootRatio;
    const leafWeight = totalBiomass * leafRatio;

    const rootPrice = 250000; // 250k KRW/kg
    const leafPrice = 30000;  // 30k KRW/kg

    const rootValue = rootWeight * rootPrice;
    const leafValue = leafWeight * leafPrice;
    const totalValue = rootValue + leafValue;

    return (
        <Paper p="md" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#373A40' }} mt="md">
            <Group justify="space-between" mb="sm">
                <Group gap={4}>
                    <ThemeIcon variant="light" color="green"><LayoutDashboard size={14} /></ThemeIcon>
                    <Text fw={700} c="white">HARVEST ANALYZER</Text>
                </Group>
                <Badge color="green" variant="dot">MULTI-CROP ROI</Badge>
            </Group>

            <SimpleGrid cols={2} spacing="xs">
                <Paper p="xs" bg="#141517" radius="md">
                    <Text size="xs" c="dimmed">Total Biomass</Text>
                    <Text fw={700} size="lg" c="lime">{totalBiomass.toFixed(2)} kg</Text>
                    <Group gap={4} mt={2}>
                        <Badge size="xs" variant="outline" color="orange" style={{ fontSize: 9, height: 16 }}>Root {(rootWeight).toFixed(1)}k</Badge>
                        <Badge size="xs" variant="outline" color="green" style={{ fontSize: 9, height: 16 }}>Leaf {(leafWeight).toFixed(1)}k</Badge>
                    </Group>
                </Paper>
                <Paper p="xs" bg="#141517" radius="md">
                    <Text size="xs" c="dimmed">Total Value ({language === 'ko' ? 'KRW' : 'USD'})</Text>
                    <Text fw={700} size="lg" c="yellow">
                        {language === 'ko' ? `₩${(totalValue / 10000).toFixed(0)}만` : `$${(totalValue / 1300).toFixed(0)}`}
                    </Text>
                    <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>
                        {language === 'ko'
                            ? `(뿌리: ${(rootValue / 10000).toFixed(0)} + 잎: ${(leafValue / 10000).toFixed(0)})`
                            : `(Root: ${(rootValue / 1300).toFixed(0)} + Leaf: ${(leafValue / 1300).toFixed(0)})`
                        }
                    </Text>
                </Paper>
            </SimpleGrid>

            {/* Robot Simulation */}
            <Paper p="xs" bg="#141517" mt="xs" radius="md" withBorder style={{ borderColor: '#333' }}>
                <Group justify="space-between" mb={4}>
                    <Text size="xs" c="dimmed" fw={700}>ROBOT SIMULATION</Text>
                    <Badge size="xs" color="dark" variant="outline">GHOST MODE</Badge>
                </Group>
                <Group justify="space-between" align="flex-end">
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Ready to Harvest</Text>
                        <Text size="sm" fw={700} c="white">{harvestReadyCount} / 25 Zones</Text>
                    </Stack>
                    <Stack gap={0} align="flex-end">
                        <Text size="xs" c="dimmed">Est. Cycle Time</Text>
                        <Text size="sm" fw={700} c="cyan">{(harvestReadyCount * 2.5).toFixed(1)} min</Text>
                    </Stack>
                </Group>
                <Button fullWidth size="xs" variant="light" color="cyan" mt="xs" rightSection={<Activity size={12} />}>
                    RUN PATHFINDING SIM
                </Button>
            </Paper>
        </Paper>
    );
};

export default function SimulatorPage() {
    const sim = useNutrientSimulator();
    const [chartMode, setChartMode] = useState<string>("NUTRIENT");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Container fluid bg="#1A1B1E" h="100vh" p={0} style={{ overflow: 'auto', color: '#C1C2C5', paddingBottom: 50 }}>
            {/* Header */}
            <Paper p="md" bg="#25262B" radius={0} shadow="sm">
                <Group justify="space-between">
                    <Group>
                        <ThemeIcon size="lg" radius="md" color="green" variant="filled"><Zap size={20} /></ThemeIcon>
                        <div>
                            <Title order={3} c="white">K-WASABI Simulator <Badge color="green" variant="light">v14.2 LIVE</Badge></Title>
                            <Group gap={4}>
                                <Text size="xs" c="dimmed">25-Zone Precision Aeroponics</Text>
                                <Divider orientation="vertical" />
                                <Badge size="xs" color={sim.systemStatus.health === "OK" ? "green" : sim.systemStatus.health === "WARNING" ? "yellow" : "red"} variant="filled">{sim.systemStatus.message}</Badge>
                                <Badge size="xs" variant="outline" color={sim.systemStatus.remoteReady ? "blue" : "red"}>{sim.systemStatus.remoteReady ? "REMOTE READY" : "REMOTE LOCKED"}</Badge>
                            </Group>
                        </div>
                    </Group>
                    <Group>
                        <Button color={sim.autoMode ? "green" : "orange"} onClick={() => sim.setAuto(!sim.autoMode)} leftSection={sim.autoMode ? <Play size={16} /> : <Pause size={16} />}>
                            {sim.autoMode ? "AUTO MODE" : "MANUAL MODE"}
                        </Button>
                        <Button variant="default" onClick={sim.downloadHistory} leftSection={<Download size={16} />}>
                            EXPORT CSV
                        </Button>
                    </Group>
                </Group>
            </Paper>

            <Container size="xl" py="xl">
                <Stack gap="lg">
                    {/* [RESTORED] MAIN NUTRIENT SENSORS (EC, pH, Temp) */}
                    <Grid>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Group justify="center" mb="md"><Text fw={600} c="dimmed"><Activity size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} /> EC LEVEL</Text></Group>
                                <SemiCircleGauge value={sim.physics.displayEc} min={0} max={4} unit="mS/cm" />
                                <Center mt="md"><Badge color="blue" variant="outline">Target: {sim.targets.ec.toFixed(1)}</Badge></Center>
                            </Paper>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Group justify="center" mb="md"><Text fw={600} c="dimmed"><Droplet size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} /> pH LEVEL</Text></Group>
                                <SemiCircleGauge value={sim.physics.displayPh} min={0} max={14} unit="pH" />
                                <Center mt="md"><Badge color="green" variant="outline">Target: {sim.targets.ph.toFixed(1)}</Badge></Center>
                            </Paper>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Group justify="center" mb="md"><Text fw={600} c="dimmed">🌡️ NUTRIENT TEMP</Text></Group>
                                <SemiCircleGauge value={sim.physics.displayTemp} min={0} max={40} unit="°C" />
                                <Center mt="md">
                                    <Group gap="xs">
                                        <Button size="compact-xs" color={sim.actuators.chiller ? "blue" : "gray"} variant={sim.actuators.chiller ? "filled" : "default"} onClick={() => sim.toggleActuator('chiller')}>Chiller</Button>
                                        <Badge color="gray" variant="filled">Heater</Badge>
                                    </Group>
                                </Center>
                            </Paper>
                        </Grid.Col>
                    </Grid>

                    {/* TOP DASHBOARD: 2-ROW / 2-COLUMN LAYOUT */}
                    <SimpleGrid cols={2} spacing="xs" mb="xs">
                        {/* LINE 1 */}
                        <AeroponicPanel sim={sim} />
                        <RecyclingPanel sim={sim} />

                        {/* LINE 2 */}
                        {/* 2. INLINE MIXING (Compact) */}
                        <Paper p="xs" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#373A40' }}>
                            <Group justify="space-between" mb={6}>
                                <Group gap={4}>
                                    <Activity size={12} color="gray" />
                                    <Text size="xs" c="dimmed" fw={600}>INLINE MIX</Text>
                                </Group>
                                <Group gap={6}>
                                    <Badge size="xs" color={sim.physics.tankLevel > 50 ? "blue" : "red"} variant="outline" style={{ padding: '0 4px', height: 16 }}>
                                        {sim.physics.tankLevel.toFixed(0)}L
                                    </Badge>
                                    <Text size="xs" fw={700} c={sim.targets.ratioAB > 1 ? "grape" : "cyan"}>{sim.targets.ratioAB.toFixed(1)}:1</Text>
                                </Group>
                            </Group>
                            <Group gap={4} align="center">
                                <Group gap={2}>
                                    <Button size="compact-xs" style={{ width: 36, padding: 0 }} color={sim.actuators.valveA > 0 ? "grape" : "dark"} variant={sim.actuators.valveA > 0 ? "filled" : "default"} onClick={() => sim.toggleActuator('valveA')}>A</Button>
                                    <Button size="compact-xs" style={{ width: 36, padding: 0 }} color={sim.actuators.valveB > 0 ? "cyan" : "dark"} variant={sim.actuators.valveB > 0 ? "filled" : "default"} onClick={() => sim.toggleActuator('valveB')}>B</Button>
                                    <Button size="compact-xs" style={{ width: 36, padding: 0 }} color={sim.actuators.acidValve > 0 ? "red" : "dark"} variant={sim.actuators.acidValve > 0 ? "filled" : "default"} onClick={() => sim.toggleActuator('acidValve')}>pH-</Button>
                                </Group>
                                <Slider style={{ flex: 1 }} size="xs" color="gray" min={0.5} max={1.5} step={0.1} value={sim.targets.ratioAB} onChange={sim.setRatio} label={null} />
                            </Group>
                        </Paper>

                        {/* 3. ENVIRONMENT & LIGHT (Ultra Compact) */}
                        <Paper p="xs" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#333' }}>
                            <Group justify="space-between" mb={6}>
                                <Group gap={4}>
                                    <Zap size={12} color="orange" />
                                    <Text size="xs" fw={600} c="dimmed">ENV & LIGHT</Text>
                                </Group>
                                <Badge size="xs" color="orange" variant="light" style={{ height: 16, fontSize: 9 }}>{sim.lighting.mode}</Badge>
                            </Group>

                            <Group grow gap={4} mb={6}>
                                <Button size="compact-xs" color="orange" variant={sim.lighting.mode === "MOVING" ? "filled" : "light"} onClick={sim.toggleLightingMode} style={{ fontSize: 10 }}>
                                    {sim.lighting.mode === "MOVING" ? "MOVING" : "FIXED"}
                                </Button>
                                <Button size="compact-xs" color="indigo" variant="light" onClick={sim.toggleLightSides} style={{ fontSize: 10 }}>
                                    {sim.lighting.sides}
                                </Button>
                                <Button
                                    size="compact-xs"
                                    color={sim.lighting.laserOn ? (sim.lighting.isFiring ? "red" : (sim.lighting.pestAlarm ? "orange" : "green")) : "dark"}
                                    variant={sim.lighting.laserOn ? "filled" : "default"}
                                    onClick={sim.toggleLaser}
                                    style={{ fontSize: 10, border: sim.lighting.laserOn ? '1px solid #51cf66' : '1px solid #333' }}
                                >
                                    AI DEFENSE {sim.lighting.laserOn ? (sim.lighting.isFiring ? "FIRING !!" : (sim.lighting.pestAlarm ? "ALARM !!" : "ON")) : "OFF"}
                                </Button>
                            </Group>
                            <Slider color="orange" size="xs" min={0} max={600} step={50} defaultValue={200} onChange={sim.setSolar} label={null} />
                        </Paper>
                    </SimpleGrid>

                    {/* MAIN 25-TIER GRID */}
                    <div>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" fw={700} c="dimmed" style={{ letterSpacing: 1 }}>REAL-TIME FARM MONITORING (25 ZONES)</Text>
                            {sim.autoMode && <Badge size="sm" color="cyan" variant="filled" leftSection={<Activity size={12} />}>PRECISION MODE</Badge>}
                        </Group>

                        <SimpleGrid cols={5} spacing={8} verticalSpacing={8}>
                            {[0, 1, 2, 3, 4].map(rack => {
                                const isActive = sim.aeroponics.activeRack === rack;
                                // Calculate correct slice for this rack
                                const rackTiers = sim.env.tiers.slice(rack * 5, (rack + 1) * 5);
                                // We want to display Top (Tier 5) first, so we reverse the array for display.
                                // BUT: rackTiers might be empty if init failed. 
                                // TierMonitorRow handles nulls safely now.

                                return (
                                    <Stack key={rack} gap={6}>
                                        <Badge
                                            fullWidth
                                            color={isActive ? "cyan" : "dark"}
                                            variant={isActive ? "filled" : "light"}
                                            radius="sm"
                                            style={{ border: isActive ? '1px solid #22b8cf' : '1px solid #444', transition: 'all 0.3s' }}
                                            leftSection={isActive ? <Droplet size={10} className="pulsate" /> : <Layers size={10} />}
                                        >
                                            RACK 0{rack + 1}
                                        </Badge>
                                        <Stack gap={4}>
                                            {/* Check if we have data to map */}
                                            {rackTiers && rackTiers.length > 0 ? (
                                                [...rackTiers].reverse().map((tier, i) => (
                                                    <TierMonitorRow
                                                        key={`r${rack} -t${i} `}
                                                        sim={sim}
                                                        index={rack * 5 + (4 - i)}
                                                        tier={tier}
                                                        isSpraying={isActive}
                                                        lightPos={sim.lighting.pos}
                                                        lightMode={sim.lighting.mode}
                                                        lightSides={sim.lighting.sides}
                                                    />
                                                ))
                                            ) : (
                                                <Text c="dimmed" size="xs" ta="center">Initializing...</Text>
                                            )}
                                        </Stack>
                                    </Stack>
                                );
                            })}
                        </SimpleGrid>
                    </div>

                    {/* ADVANCED ANALYTICS (Harvest & Robot) - Moved to Bottom */}
                    <Divider my="lg" label="ADVANCED ANALYTICS & ROBOTICS" labelPosition="center" color="dark.4" />

                    <Grid>
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <HarvestPanel sim={sim} />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Stack gap="xs">
                                <Center>
                                    <SegmentedControl
                                        size="xs"
                                        radius="xl"
                                        value={chartMode}
                                        onChange={setChartMode}
                                        data={[
                                            { label: 'Nutrient', value: 'NUTRIENT' },
                                            { label: 'Env', value: 'ENV' },
                                            { label: 'Stress', value: 'STRESS' },
                                        ]}
                                        bg="#141517"
                                        styles={{
                                            root: { border: '1px solid #333' },
                                            label: { fontSize: 11, fontWeight: 500 }
                                        }}
                                    />
                                </Center>
                                {chartMode === 'NUTRIENT' && (
                                    <LiveTrendChart title="NUTRIENT TREND (EC/pH)" data={[...sim.history]} keys={['ec', 'ph']} colors={['#22b8cf', '#be4bdb']} min={0} max={14} unit="" />
                                )}
                                {chartMode === 'ENV' && (
                                    <LiveTrendChart title="ENVIRONMENT (TEMP)" data={[...sim.history]} keys={['temp']} colors={['orange']} min={10} max={40} unit="°C" />
                                )}
                                {chartMode === 'STRESS' && (
                                    <LiveTrendChart title="ROOT STRESS ANALYSIS" data={[...sim.history]} keys={['stress']} colors={['#fa5252']} min={0} max={100} unit="%" />
                                )}
                            </Stack>
                        </Grid.Col>
                    </Grid>


                    {/* Controls moved to Right Panel */}

                </Stack>
            </Container >
        </Container >
    );
}
