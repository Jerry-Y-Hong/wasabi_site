
export type SimulatorState = "IDLE" | "FILLING" | "DOSING" | "SUPPLYING";

export interface TierData {
    temp: number;
    hum: number;
    fan: boolean;
    heater: boolean;
    pest?: boolean;
    growthDay: number;
    biomass: number;
}

export interface PhysicsState {
    rawWaterLevel: number;
    tankLevel: number;
    tankA: number;
    tankB: number;
    tankAcid: number;
    ec: number;
    temp: number;
    realPh: number;
    sensorPh: number;
    solarRad: number;
    dosingTime: number;
    totalA: number;
    totalB: number;
    phWaitTimer: number;
    displayEc: number;
    displayPh: number;
    displayTemp: number;
    rootStress: number;
    lastShock: number;
    dli: number;
    ppfd: number;
    vpd?: number;
}

export interface AeroponicsState {
    isSpraying: boolean;
    activeRack: number | null;
    pressure: number;
    sprayTimer: number;
    cycleMode: string;
    rackDuration: number;
    rackGap: number;
    onDuration: number;
    offDuration: number;
    softStart: boolean;
    nozzleStatus: string;
}

export interface EnvironmentState {
    time: number;
    airTemp: number;
    airHum: number;
    bedTemp: number;
    bedHum: number;
    externalTemp: number;
    tiers: TierData[];
}

export interface LightingState {
    mode: "FIXED" | "MOVING";
    pos: number;
    speed: number;
    direction: number;
    sides: "SINGLE" | "DOUBLE";
    cameraOn: boolean;
    laserOn: boolean;
    isFiring: boolean;
    pestAlarm: boolean;
}

export interface RecyclingState {
    filterPressureIn: number;
    filterPressureOut: number;
    isBackwashing: boolean;
    backwashTimer: number;
    carbonPressureIn: number;
    carbonPressureOut: number;
    isCarbonBackwashing: boolean;
    carbonBackwashTimer: number;
    turbidity: number;
    uvStatus: boolean;
    uvIntensity: number;
    magneticMode: boolean;
    magneticStrength: number;
}

export interface ActuatorsState {
    rawPump: boolean;
    inletValve: boolean;
    mixingPump: boolean;
    supplyPump: boolean;
    supplyPumpMode: "A" | "B";
    valveA: number;
    valveB: number;
    acidValve: number;
    chiller: boolean;
    heater: boolean;
    uvLamp: boolean;
    sandFilter: boolean;
    autoValveSand: boolean;
    autoValveCarbon: boolean;
}

export interface HvacState {
    fan_circ: boolean;
    fan_exh: boolean;
    heater_bed: boolean;
}

export interface SimulatorEngine {
    state: SimulatorState;
    subState: string;
    logMsg: string;
    autoMode: boolean;
    safetyLock: boolean;
    physics: PhysicsState;
    aeroponics: AeroponicsState;
    env: EnvironmentState;
    lighting: LightingState;
    recycling: RecyclingState;
    actuators: ActuatorsState;
    hvac: HvacState;
    history: {
        temp: number[];
        hum: number[];
        ec: number[];
        ph: number[];
        waterTemp: number[];
    };
    targets: { ec: number; ph: number; temp: number; tolEc: number; tolPh: number; tolTemp: number; dli: number; ratioAB: number };
    systemStatus: {
        health: "OK" | "WARNING" | "CRITICAL";
        message: string;
        remoteReady: boolean;
        mqttStatus?: "CONNECTED" | "DISCONNECTED" | "ERROR";
    };
    _lastLiveSync: Record<string, any>;
    feedback: Record<string, any>;
}
