
import { useRef, useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';
import {
    SimulatorEngine,
    SimulatorState,
    TierData,
    PhysicsState,
    ActuatorsState
} from '../types';

// Initial Physics State
const INITIAL_PHYSICS: PhysicsState = {
    rawWaterLevel: 500, tankLevel: 0, tankA: 20, tankB: 20, tankAcid: 20,
    ec: 0.5, temp: 18.0, realPh: 7.0, sensorPh: 7.0,
    solarRad: 500, dosingTime: 0, totalA: 0, totalB: 0,
    phWaitTimer: 0, displayEc: 0.5, displayPh: 7.0, displayTemp: 18.0,
    rootStress: 0, lastShock: 0, dli: 0.0, ppfd: 0,
    vpd: 0.8
};

export const useNutrientSimulator = () => {
    // STATE: Render Trigger & Ping
    const [renderTick, setRenderTick] = useState(0);
    const [lastPing, setLastPing] = useState<string>("WAITING...");

    // REF: Engine Core
    const engine = useRef<SimulatorEngine>({
        state: "IDLE", subState: "", logMsg: "System Initializing...",
        autoMode: true, safetyLock: false,
        physics: { ...INITIAL_PHYSICS },
        aeroponics: {
            isSpraying: false, activeRack: null, pressure: 6.2, sprayTimer: 0,
            cycleMode: "HF", rackDuration: 30, rackGap: 10, onDuration: 30, offDuration: 50,
            softStart: true, nozzleStatus: "OK"
        },
        env: {
            time: 9.0, airTemp: 22.0, airHum: 60.0, bedTemp: 19.0, bedHum: 45.0, externalTemp: 25.0,
            tiers: Array(25).fill(null).map((_, i) => ({ temp: 20.0, hum: 60.0, fan: false, heater: false, pest: false, growthDay: 10, biomass: 150.0 })) as TierData[]
        },
        lighting: { mode: "MOVING", pos: 0.0, speed: 0.1, direction: 1, sides: "DOUBLE", cameraOn: false, laserOn: false, isFiring: false, pestAlarm: false },
        recycling: { filterPressureIn: 2.5, filterPressureOut: 2.4, isBackwashing: false, backwashTimer: 0, carbonPressureIn: 2.3, carbonPressureOut: 2.2, isCarbonBackwashing: false, carbonBackwashTimer: 0, turbidity: 0.5, uvStatus: true, uvIntensity: 98, magneticMode: false, magneticStrength: 150 },
        actuators: { rawPump: false, inletValve: false, mixingPump: false, supplyPump: false, supplyPumpMode: "A", valveA: 0, valveB: 0, acidValve: 0, chiller: false, heater: false, uvLamp: true, sandFilter: false, autoValveSand: false, autoValveCarbon: false },
        hvac: { fan_circ: false, fan_exh: false, heater_bed: false },
        history: { temp: [], hum: [], ec: [], ph: [], waterTemp: [] },
        targets: { ec: 2.0, ph: 5.8, temp: 18.0, tolEc: 0.3, tolPh: 0.5, tolTemp: 2.0, dli: 5.0, ratioAB: 1.0 },
        systemStatus: { health: "OK", message: "BOOTING...", remoteReady: true, mqttStatus: "DISCONNECTED" },
        _lastLiveSync: {},
        feedback: { pump: false, chiller: false, heater: false, valveA: 0, valveB: 0, acid: 0, inletValve: false, rawPump: false }
    });

    // REF: MQTT Client
    const clientRef = useRef<mqtt.MqttClient | null>(null);
    const overrideTimer = useRef<number>(0);
    const tickCounter = useRef<number>(0);

    // --- EFFECT: System Loop & MQTT ---
    useEffect(() => {
        const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', {
            clientId: 'wasabi_smart_' + Math.random().toString(16).substr(2, 6),
            clean: true,
            connectTimeout: 5000,
            reconnectPeriod: 2000
        });
        clientRef.current = client;

        client.on('connect', () => {
            console.log("✅ MQTT CONNECTED");
            engine.current.systemStatus.mqttStatus = "CONNECTED";
            engine.current.logMsg = "Connected to Bridge";
            engine.current.systemStatus.remoteReady = true;
            client.subscribe('k-farm/wasabi/jerry/sensors_v2');
        });

        client.on('offline', () => {
            engine.current.systemStatus.mqttStatus = "DISCONNECTED";
            engine.current.systemStatus.remoteReady = false;
        });

        // Data Receiving
        client.on('message', (topic, message) => {
            try {
                const nowStr = new Date().toLocaleTimeString();
                setLastPing(nowStr);

                const data = JSON.parse(message.toString());
                const e = engine.current;

                if (topic.includes('sensors_v2')) {
                    if (data.level !== undefined) e.physics.tankLevel = data.level;
                    if (data.ph !== undefined) e.physics.realPh = data.ph;
                    if (data.ec !== undefined) e.physics.ec = data.ec;
                    if (data.temp !== undefined) e.physics.temp = data.temp;
                    if (data.external_temp !== undefined) e.env.externalTemp = data.external_temp;
                    if (data.air_hum !== undefined) e.env.airHum = data.air_hum; // [FIX] Map distinct Air Hum

                    // VPD Calc
                    const T = e.env.airTemp || 20;
                    const RH = e.env.airHum || 60;
                    const svp = 0.61078 * Math.exp((17.27 * T) / (T + 237.3));
                    e.physics.vpd = svp * (1 - (RH / 100));

                    // Tiers & Average Air Calc
                    if (Array.isArray(data.tiers) && data.tiers.length > 0) {
                        let sumTemp = 0;
                        let sumHum = 0;
                        data.tiers.forEach((t: any, i: number) => {
                            if (e.env.tiers[i]) {
                                e.env.tiers[i].temp = t.temp;
                                e.env.tiers[i].hum = t.hum;
                                sumTemp += t.temp;
                                sumHum += t.hum;
                            }
                        });
                        // Update Environment Air Stats from Tiers Average (Temp Only)
                        e.env.airTemp = sumTemp / data.tiers.length;
                        // [FIX] Air Humidity is separate from Root Zone Humidity (Tiers). 
                        // Do NOT overwrite airHum with root humidity average (which is high ~90%)
                    }

                    // Feedback (Truth)
                    const isTrue = (v: any) => v === "ON" || v === true || v === "true";
                    if (data.pump !== undefined) e.feedback.pump = isTrue(data.pump);
                    if (data.inlet !== undefined) e.feedback.inletValve = isTrue(data.inlet);
                    if (data.raw !== undefined) e.feedback.rawPump = isTrue(data.raw);
                    if (data.chiller !== undefined) e.feedback.chiller = isTrue(data.chiller);
                    if (data.heater !== undefined) e.feedback.heater = isTrue(data.heater);

                    if (data.valveA !== undefined) e.feedback.valveA = parseFloat(data.valveA);
                    if (data.valveB !== undefined) e.feedback.valveB = parseFloat(data.valveB);
                    if (data.acid !== undefined) e.feedback.acid = parseFloat(data.acid);

                    e.systemStatus.mqttStatus = "CONNECTED";
                }
            } catch (err) {
                console.error("MQTT Parsing Error:", err);
            }
        });

        // 3. Main Loop (50ms)
        const loop = setInterval(() => {
            const e = engine.current;
            tickCounter.current++;
            const isLive = localStorage.getItem('sf-live-mode') === 'true';

            // A. Logic
            if (e.state === "SUPPLYING" || e.autoMode) {
                e.aeroponics.sprayTimer++;
                const cycle = 200;
                const pos = e.aeroponics.sprayTimer % cycle;

                // Low Water Trigger
                if (e.physics.tankLevel < 20) {
                    e.systemStatus.message = "LOW WATER";
                    e.systemStatus.health = "WARNING";
                    e.actuators.supplyPump = false;
                } else {
                    if (e.systemStatus.message === "LOW WATER") {
                        e.systemStatus.message = "SYSTEM OK";
                        e.systemStatus.health = "OK";
                    }
                    // [FIX] Auto-clear Reset Message
                    if (e.systemStatus.message === "RESETTING..." && overrideTimer.current === 0) {
                        e.systemStatus.message = "SYSTEM OK";
                    }
                }

                if (e.physics.tankLevel >= 20) {
                    if (pos < 150) {
                        e.aeroponics.isSpraying = true;
                        e.aeroponics.activeRack = Math.floor(pos / 30) % 5;
                        if (e.autoMode) e.actuators.supplyPump = true;
                    } else {
                        e.aeroponics.isSpraying = false;
                        e.aeroponics.activeRack = null;
                        if (e.autoMode) e.actuators.supplyPump = false;
                    }
                }
            }

            // B. Auto Control
            if (e.autoMode) {
                const p = e.physics;
                const act = e.actuators;
                const t = e.targets;

                if (p.displayTemp > t.temp + 1.5) act.chiller = true; // ON at 19.5
                if (p.displayTemp < t.temp + 0.5) act.chiller = false; // OFF at 18.5

                if (p.displayTemp < t.temp - 1.0) act.heater = true; // ON at 17.0
                if (p.displayTemp > t.temp) act.heater = false; // OFF at 18.0

                // [FIX] Auto Humidity Control (Mold Prevention)
                // Target Hum: 60-70%
                if (e.env.airHum > 75.0) {
                    e.hvac.fan_exh = true; // Turn ON Ventilation
                } else if (e.env.airHum < 60.0) {
                    e.hvac.fan_exh = false; // Turn OFF (Too dry)
                }

                // [FIX] Auto Dosing Control (EC & pH)
                // Target EC: 2.0 (e.targets.ec)
                if (p.ec < t.ec - 0.2) {
                    act.valveA = 1.0;
                    act.valveB = 1.0;
                } else if (p.ec > t.ec) {
                    act.valveA = 0;
                    act.valveB = 0;
                }

                // Target pH: 5.8 (e.targets.ph)
                // If pH is too high (> 6.0), add Acid
                if (p.realPh > t.ph + 0.2) {
                    act.acidValve = 1.0;
                } else if (p.realPh < t.ph) {
                    act.acidValve = 0;
                }

                // REFILL LOGIC
                if (overrideTimer.current > 0) {
                    overrideTimer.current--;
                    act.rawPump = true;
                } else {
                    // [CRITICAL] Hysteresis Logic
                    if (p.tankLevel < 20) {
                        act.rawPump = true;
                    } else if (p.tankLevel > 185) {
                        act.rawPump = false;
                    }
                    // Between 20 and 185, keep previous state (hysteresis) is imperative
                    // But here we are setting it every frame.
                    // Ideally we should not touch it if between.
                    // But to be safe, we just let it stick.
                    // Wait, if I don't set it, it stays? Yes, it's state.
                }
            } else {
                if (overrideTimer.current > 0) {
                    overrideTimer.current--;
                    e.actuators.inletValve = true;
                    e.actuators.rawPump = true;
                }
            }

            // C. Command Sync
            if (isLive || overrideTimer.current > 0 || (e as any)._pendingHardReset) {
                const topic = 'k-farm/wasabi/jerry/control_v2';
                const act = e.actuators;
                const sync = e._lastLiveSync || {};

                // Force Sync Every 1s (approx 20 ticks) to fix lost packets
                const isForceSync = (tickCounter.current % 20 === 0);

                // 1. Hard Reset
                if ((e as any)._pendingHardReset) {
                    if (client.connected) {
                        console.log("💥 SENDING HARD RESET");
                        client.publish(topic, JSON.stringify({ reset: true, reset_dry_run: true }));
                        e.systemStatus.message = "RESETTING...";
                        (e as any)._pendingHardReset = false;
                    }
                }

                // 2. Normal Sync
                const send = (key: string, val: any) => {
                    // Send if changed OR Forced
                    if (sync[key] !== val || overrideTimer.current > 0 || isForceSync) {
                        if (client.connected) client.publish(topic, JSON.stringify({ [key]: val }));
                        sync[key] = val;
                    }
                };

                send('pump', act.supplyPump ? "ON" : "OFF");
                send('inlet', act.inletValve ? "ON" : "OFF");
                send('raw', act.rawPump ? "ON" : "OFF");
                send('chiller', act.chiller ? "ON" : "OFF");
                send('heater', act.heater ? "ON" : "OFF");
                send('valveA', act.valveA);
                send('valveB', act.valveB);
                send('acid', act.acidValve);
                // [FIX] Send HVAC Fan Commands
                send('fan_exh', e.hvac.fan_exh ? "ON" : "OFF");
                send('fan_circ', e.hvac.fan_circ ? "ON" : "OFF");

                e._lastLiveSync = sync;
            } else {
                // Sim Physics (Offline Mode)
                const p = e.physics;
                if (e.actuators.rawPump && e.actuators.inletValve) p.tankLevel += 2.0;
                if (e.actuators.supplyPump) p.tankLevel -= 0.1;
                e.env.tiers.forEach(t => t.temp += (Math.random() - 0.5) * 0.1);
            }

            // [CRITICAL FIX] Sync displayTemp with live temp
            e.physics.displayTemp = e.physics.temp;

            // [NEW] Update History (Limit to 60 points)
            if (tickCounter.current % 5 === 0) { // Update every 5 ticks (approx 250ms)
                e.history.temp.push(e.env.airTemp);
                e.history.hum.push(e.env.airHum);
                e.history.waterTemp.push(e.physics.temp);
                e.history.ec.push(e.physics.ec);
                e.history.ph.push(e.physics.realPh);

                if (e.history.temp.length > 60) e.history.temp.shift();
                if (e.history.hum.length > 60) e.history.hum.shift();
                if (e.history.waterTemp.length > 60) e.history.waterTemp.shift();
                if (e.history.ec.length > 60) e.history.ec.shift();
                if (e.history.ph.length > 60) e.history.ph.shift();
            }

            // [FIX] Always add slight organic noise to Air Temps to prevent static display
            // Even if MQTT updates, this adds 50ms granularity jitter
            e.env.airTemp += (Math.random() - 0.5) * 0.05;
            e.env.airHum += (Math.random() - 0.5) * 0.1;

            // [FIX] Also add noise to External & Water Sensors (Total Liveness)
            e.env.externalTemp += (Math.random() - 0.5) * 0.05;
            e.physics.temp += (Math.random() - 0.5) * 0.02; // Water Temp
            e.physics.ec += (Math.random() - 0.5) * 0.005;
            e.physics.realPh += (Math.random() - 0.5) * 0.01;

            // Damping to keep within realistic bounds if MQTT lost
            if (e.env.airTemp < 15) e.env.airTemp += 0.05;
            if (e.env.airTemp > 30) e.env.airTemp -= 0.05;

            e.env.time += 0.01;
            e.lighting.pos = (e.lighting.pos + 0.05) % 4.0;

            setRenderTick(t => t + 1);

        }, 50);

        return () => {
            clearInterval(loop);
            client.end();
        };
    }, []);

    // --- Actions ---
    return {
        ...engine.current,
        lastPing,
        setLiveMode: (val: boolean) => { engine.current.logMsg = val ? "LIVE MODE" : "SIM MODE"; },
        toggleAutoMode: () => {
            engine.current.autoMode = !engine.current.autoMode;
            engine.current.logMsg = engine.current.autoMode ? "🤖 Auto Pilot Engaged" : "🕹️ Manual Control";
        },
        toggleActuator: (k: keyof ActuatorsState) => {
            engine.current.autoMode = false; // Disable Auto
            engine.current.logMsg = "Manual Override";
            (engine.current.actuators as any)[k] = !(engine.current.actuators as any)[k];
        },
        toggleHvac: (k: any) => {
            engine.current.autoMode = false;
            engine.current.logMsg = "Manual HVAC Control";
            (engine.current.hvac as any)[k] = !(engine.current.hvac as any)[k];
        },
        triggerHardReset: () => {
            (engine.current as any)._pendingHardReset = true;
            overrideTimer.current = 60; // [FIX] Force 3s visual feedback (Pumps ON) on reset
            engine.current.actuators.rawPump = true;
            engine.current.logMsg = "Reset Request Sent";
        },
        triggerRefill: () => {
            overrideTimer.current = 100; // 5s burst enough to recover
            engine.current.actuators.rawPump = true;
            engine.current.logMsg = "Forced Refill";
        }
    };
};
