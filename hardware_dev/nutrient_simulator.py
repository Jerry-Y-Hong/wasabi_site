import time
import random
import sys
import os

# --- Configuration ---
TARGET_EC = 2.0  # mS/cm
TARGET_PH = 5.8  # pH
TARGET_TEMP = 18.0 # Celsius
TANK_CAPACITY = 200 # Liters
FILL_LEVEL_TARGET = 80.0 # % (Fill until 80%)

class SystemState:
    IDLE = "IDLE"
    FILLING = "FILLING"
    DOSING = "DOSING"  # Correcting EC/pH
    STABILIZING = "STABILIZING"
    SUPPLYING = "SUPPLYING"
    FLUSHING = "FLUSHING"

class NutrientSimulator:
    def __init__(self):
        # Physics State ( Simulated Physical World )
        self.tank_level = 0.0 # Liters
        self.current_ec = 0.5 # Initial Source Water EC
        self.current_ph = 7.0 # Initial Source Water pH
        self.current_temp = 20.0 # Initial Ambient Temp
        
        # Actuators (Hardware)
        self.pump_supply = False
        self.pump_mixing = False
        self.valve_fresh_water = False
        self.valve_drain_water = False
        self.valve_a = False
        self.valve_b = False
        self.valve_c = False # Acid
        self.chiller = False
        self.valve_zone_1 = False

        # Logic State (Controller Memory)
        self.state = SystemState.IDLE
        self.timer = 0
        self.supply_volume_accumulated = 0

    def update_physics(self, dt=1.0):
        """Simulates how the physical world changes based on actuators"""
        
        # 1. Level Changes
        if self.valve_fresh_water:
            self.tank_level += 2.0 * dt # Fills 2L/sec
            # Dilution effect (simplified)
            if self.tank_level > 0:
                self.current_ec = (self.current_ec * (self.tank_level - 2) + 0.5 * 2) / self.tank_level
                self.current_ph = (self.current_ph * (self.tank_level - 2) + 7.0 * 2) / self.tank_level

        if self.pump_supply and self.valve_zone_1:
            self.tank_level -= 1.5 * dt # Supplies 1.5L/sec
            self.supply_volume_accumulated += 1.5 * dt

        self.tank_level = max(0, min(self.tank_level, TANK_CAPACITY))

        # 2. Temperature Changes
        ambient_temp = 25.0
        # Natural warming towards ambient
        self.current_temp += (ambient_temp - self.current_temp) * 0.005 * dt
        
        # Pump heat
        if self.pump_mixing: self.current_temp += 0.02 * dt
        if self.pump_supply: self.current_temp += 0.03 * dt
        
        # Chiller cooling
        if self.chiller:
            self.current_temp -= 0.1 * dt # Cools down fast

        # 3. Chemical Dosing (EC/pH)
        volume_factor = max(10, self.tank_level) # Avoid division by zero
        
        if self.valve_a:
            self.current_ec += (0.5 / volume_factor) * 10 * dt # Conc A boosts EC
        if self.valve_b:
            self.current_ec += (0.5 / volume_factor) * 10 * dt # Conc B boosts EC
        
        if self.valve_c:
            self.current_ph -= (0.3 / volume_factor) * 10 * dt # Acid drops pH
            
        # Random Sensor Noise
        self.sensor_ec = self.current_ec + random.uniform(-0.02, 0.02)
        self.sensor_ph = self.current_ph + random.uniform(-0.05, 0.05)
        self.sensor_temp = self.current_temp + random.uniform(-0.1, 0.1)
        self.sensor_level = self.tank_level

    def run_control_logic(self):
        """The 'Brain' of the machine"""
        
        # TANK TEMPERATURE CONTROL (Always Active)
        if self.sensor_temp > TARGET_TEMP + 1.0 and self.sensor_level > 10:
            self.chiller = True
        elif self.sensor_temp < TARGET_TEMP - 0.5:
            self.chiller = False

        # STATE MACHINE
        if self.state == SystemState.IDLE:
            # Trigger: Auto start if tank is empty
            if self.sensor_level < 10:
                print(">> [LOGIC] Tank Empty. Starting Batch Process.")
                self.state = SystemState.FILLING
        
        elif self.state == SystemState.FILLING:
            self.valve_fresh_water = True
            self.pump_mixing = False
            
            fill_target_liters = TANK_CAPACITY * (FILL_LEVEL_TARGET / 100.0)
            if self.sensor_level >= fill_target_liters:
                self.valve_fresh_water = False
                self.pump_mixing = True # Start mixing
                self.state = SystemState.DOSING
                print(">> [LOGIC] Fill Complete. Start Dosing.")

        elif self.state == SystemState.DOSING:
            self.pump_mixing = True
            
            # EC Control
            if self.sensor_ec < TARGET_EC - 0.1:
                self.valve_a = True
                self.valve_b = True
            else:
                self.valve_a = False
                self.valve_b = False
                
            # pH Control
            if self.sensor_ph > TARGET_PH + 0.2:
                self.valve_c = True
            else:
                self.valve_c = False
            
            # Check Completion
            if (abs(self.sensor_ec - TARGET_EC) < 0.15) and (abs(self.sensor_ph - TARGET_PH) < 0.3):
                self.state = SystemState.STABILIZING
                self.timer = 5 # Wait 5 loops
                print(">> [LOGIC] Dosing Target Reached. Stabilizing...")

        elif self.state == SystemState.STABILIZING:
            self.valve_a = False
            self.valve_b = False
            self.valve_c = False
            self.timer -= 1
            if self.timer <= 0:
                self.state = SystemState.SUPPLYING
                print(">> [LOGIC] Stabilization Complete. Starting Irrigation.")

        elif self.state == SystemState.SUPPLYING:
            self.pump_supply = True
            self.valve_zone_1 = True
            
            # Supply 50 Liters
            if self.supply_volume_accumulated >= 50:
                self.pump_supply = False
                self.valve_zone_1 = False
                self.supply_volume_accumulated = 0
                self.state = SystemState.IDLE
                print(">> [LOGIC] Irrigation Complete. System Idle.")

    def print_status(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"=== K-WASABI Nutrient System Simulator V1.0 ===")
        print(f"STATE: [{self.state}] | Time Step: {self.timer}")
        print("-" * 40)
        print(f"SENSORS  | EC: {self.sensor_ec:.2f} (T:{TARGET_EC}) | pH: {self.sensor_ph:.2f} (T:{TARGET_PH})")
        print(f"         | Temp: {self.sensor_temp:.1f}C (T:{TARGET_TEMP}) | Level: {self.sensor_level:.1f}L")
        print("-" * 40)
        print(f"ACTUATORS| [P] Supply: {'ON' if self.pump_supply else 'OFF'} | Mixing: {'ON' if self.pump_mixing else 'OFF'}")
        print(f"         | [V] Water: {'ON' if self.valve_fresh_water else 'OFF'} | A/B: {'ON' if self.valve_a else 'OFF'} | Acid: {'ON' if self.valve_c else 'OFF'}")
        print(f"         | [C] Chiller: {'ON' if self.chiller else 'OFF'} | Zone1: {'ON' if self.valve_zone_1 else 'OFF'}")
        print("-" * 40)

def main():
    sim = NutrientSimulator()
    print("Starting Simulation...")
    time.sleep(1)
    
    try:
        while True:
            sim.update_physics()
            sim.run_control_logic()
            sim.print_status()
            time.sleep(0.5) # Speed up simulation (0.5s = 1 tick)
    except KeyboardInterrupt:
        print("\nSimulation Stopped.")

if __name__ == "__main__":
    main()
