import tkinter as tk
from tkinter import ttk, messagebox
import time
import random
import math

# --- Simulation Logic (Same as before) ---
class NutrientSimulator:
    def __init__(self):
        self.start_time = time.time()
        self.dosing_start_time = 0
        self.dosing_duration = 0.0
        self.total_a_dosed = 0.0
        self.total_b_dosed = 0.0
        self.raw_water_level = 500.0
        self.tank_level = 0.0        
        self.tank_a_level = 20.0
        self.tank_b_level = 20.0
        self.tank_c_level = 20.0
        self.real_ph = 7.0       
        self.sensor_ph = 7.0     
        self.ph_wait_timer = 0   
        self.ec = 0.5
        self.temp = 20.0
        self.target_ec = 2.0
        self.tol_ec = 0.3
        self.target_ph = 5.8
        self.tol_ph = 0.5
        self.target_temp = 18.0
        self.tol_temp = 2.0
        self.solar_rad = 0   
        self.log_msg = "System Ready"
        self.actuators = {"Raw Pump": False, "Sand Filter": False, "UV Lamp": True, "Supply Pump": False, "Mixing Pump": False, "Inlet Valve": False, "Chiller": False, "Valve A": 0.0, "Valve B": 0.0, "Acid Valve": 0.0}
        self.auto_mode = True
        self.state = "IDLE"
        self.sub_state = ""
        self.safety_lock = False

    def update(self):
        if self.actuators["Raw Pump"]: self.raw_water_level = min(1000, self.raw_water_level + 2.0)
        if self.actuators["Inlet Valve"]:
            if self.raw_water_level > 0:
                self.tank_level += 0.5
                self.raw_water_level -= 0.5
                if self.tank_level > 0:
                    self.ec = (self.ec * (self.tank_level-0.5) + 0.5*0.5) / self.tank_level
                    self.real_ph = (self.real_ph * (self.tank_level-0.5) + 7.0*0.5) / self.tank_level
        if self.actuators["Supply Pump"]: self.tank_level = max(0, min(200, self.tank_level - 0.5))
        ambient_temp = 20 + (self.solar_rad / 100)
        if self.actuators["Chiller"]: self.temp -= 0.1
        else: self.temp += (ambient_temp - self.temp) * 0.005
        if self.actuators["Valve A"] > 0:
            rate = self.actuators["Valve A"]
            self.tank_a_level -= 0.01 * rate
            self.total_a_dosed += 0.01 * rate
            self.ec += 0.05 * rate
        if self.actuators["Valve B"] > 0:
            rate = self.actuators["Valve B"]
            self.tank_b_level -= 0.01 * rate
            self.total_b_dosed += 0.01 * rate
            self.ec += 0.05 * rate
        if self.actuators["Acid Valve"] > 0:
            rate = self.actuators["Acid Valve"]
            self.tank_c_level -= 0.01 * rate
            self.real_ph -= 0.1 * rate 
        self.sensor_ph += (self.real_ph - self.sensor_ph) * 0.05
        self.display_ec = self.ec + random.uniform(-0.01, 0.01)
        self.display_ph = self.sensor_ph + random.uniform(-0.02, 0.02)
        self.display_temp = self.temp + random.uniform(-0.1, 0.1)
        if self.auto_mode: self.run_logic()
            
    def run_logic(self):
        if self.raw_water_level < 200: self.actuators["Raw Pump"] = True
        elif self.raw_water_level > 900: self.actuators["Raw Pump"] = False
        if self.solar_rad > 700: 
            self.target_ec = 2.4
            self.log_msg = "Mode: Sunny (High EC)"
        elif self.solar_rad > 300: 
            self.target_ec = 2.0
            self.log_msg = "Mode: Normal"
        else: 
            self.target_ec = 1.6
            self.log_msg = "Mode: Low Light"
        if self.display_temp > self.target_temp + self.tol_temp: self.actuators["Chiller"] = True
        elif self.display_temp < self.target_temp - 0.5: self.actuators["Chiller"] = False
        ec_error = self.target_ec - self.display_ec
        ph_error = self.display_ph - self.target_ph 
        self.actuators["Valve A"] = 0.0
        self.actuators["Valve B"] = 0.0
        self.actuators["Acid Valve"] = 0.0
        self.safety_lock = False
        self.sub_state = ""
        if self.state == "DOSING":
            if self.dosing_start_time == 0: self.dosing_start_time = time.time()
            self.dosing_duration = time.time() - self.dosing_start_time
            self.actuators["Mixing Pump"] = True
            
            # --- EMERGENCY DILUTION LOGIC (Added V12.0) ---
            # Condition: EC too High (ec_error negative large) OR pH too Low (ph_error negative large)
            is_ec_high = ec_error < -(self.tol_ec) 
            is_ph_low = ph_error < -(self.tol_ph) # pH dropped too much
            
            if is_ec_high or is_ph_low:
                if self.tank_level < 195: # Can dilute
                    self.sub_state = "⚠️ DILUTING (Overshoot)"
                    self.actuators["Inlet Valve"] = True
                    self.safety_lock = True
                else:
                    self.sub_state = "🚨 ALARM: TANK FULL"
                    self.safety_lock = True # Stuck, needs manual drain
            
            # --- Normal Control Logic ---
            elif self.ph_wait_timer > 0:
                self.ph_wait_timer -= 1
                self.sub_state = f"⏳ pH Reacting... ({self.ph_wait_timer})"
                self.safety_lock = True 
            elif ph_error > (self.tol_ph * 0.2):
                self.sub_state = "Acid Dosing (Pulse)"
                self.actuators["Acid Valve"] = 1.0 
                self.ph_wait_timer = 30 
                self.safety_lock = True
            elif ec_error > (self.tol_ec * 0.2):
                tick = int(time.time() * 2) 
                if tick % 2 == 0:
                    self.sub_state = "A-Sol Injecting"
                    self.actuators["Valve A"] = 1.0 if ec_error > 0.5 else 0.2
                else:
                    self.sub_state = "B-Sol Injecting"
                    self.actuators["Valve B"] = 1.0 if ec_error > 0.5 else 0.2
                self.safety_lock = True
            else:
                self.sub_state = "Stabilizing"

            # Completion Check (Must be fully within tolerance)
            ec_ok = abs(ec_error) < 0.1
            ph_ok = abs(ph_error) < 0.1
            if ec_ok and ph_ok and self.ph_wait_timer == 0 and not (is_ec_high or is_ph_low):
                self.state = "SUPPLYING"
                self.dosing_start_time = 0 
        if self.state == "IDLE":
            self.dosing_duration = 0
            self.actuators["Mixing Pump"] = False
            self.actuators["Supply Pump"] = False
            if self.tank_level < 20: self.state = "FILLING"
        elif self.state == "FILLING":
            self.actuators["Inlet Valve"] = True
            if self.tank_level >= 160:
                self.actuators["Inlet Valve"] = False
                self.state = "DOSING"
        elif self.state == "SUPPLYING":
            self.actuators["Mixing Pump"] = True
            self.actuators["Supply Pump"] = True
            if self.tank_level < 20: self.state = "IDLE"

    def manual_toggle(self, name):
        if not self.auto_mode:
            if isinstance(self.actuators[name], bool):
                self.actuators[name] = not self.actuators[name]
            else:
                self.actuators[name] = 1.0 if self.actuators[name] == 0.0 else 0.0

# --- Sleek Semi-Circle EC Gauge ---
class SleekSemicircleEC(tk.Canvas):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, width=300, height=180, bg="#2c3e50", highlightthickness=0, **kwargs)
        self.value = 0.0
        self.target = 2.0
        self.tol = 0.3
        self.draw_face()

    def draw_face(self):
        self.delete("all")
        cx, cy, r = 150, 150, 130 # Bottom-Center Anchor
        
        # 1. Background (Dark Semi-Circle)
        # 180 degree arc from 180(Left) to 0(Right)
        # Tkinter arc: start=0 is 3o'clock. anti-clockwise.
        # So we want start=0, extent=180. (3->12->9)
        self.create_arc(cx-r, cy-r, cx+r, cy+r, start=0, extent=180, fill="#222f3e", outline="#34495e", width=4)
        
        # 2. Gloss/Highlight (Subtle arc at top)
        self.create_arc(cx-r+10, cy-r+10, cx+r-10, cy+r-10, start=45, extent=90, style="arc", outline="#34495e", width=10)

        # 3. Safe Zone (Green Band)
        # Map 0.0~4.0 to 180~0 degrees
        # Actually our scale: 0.0 is at 180 deg (Left), 4.0 is at 0 deg (Right)
        # Angle = 180 - (val / 4.0 * 180)
        min_v = max(0, self.target - self.tol)
        max_v = min(4.0, self.target + self.tol)
        
        start_ang_draw = 180 - (max_v / 4.0 * 180) # The "start" for tkinter is strictly CCW. 
        # Arc from max_v angle to min_v angle
        extent_draw = (max_v - min_v) / 4.0 * 180
        
        self.create_arc(cx-r+15, cy-r+15, cx+r-15, cy+r-15, start=start_ang_draw, extent=extent_draw, fill="#27ae60", outline="")
        # Mask center to make it a band
        self.create_arc(cx-r+25, cy-r+25, cx+r-25, cy+r-25, start=0, extent=180, fill="#222f3e", outline="")

        # 4. Ticks & Labels
        for i in range(9): # 0, 0.5 ... 4.0
            val = i * 0.5
            angle_deg = 180 - (val / 4.0 * 180)
            angle_rad = math.radians(angle_deg)
            
            # Tick
            x1 = cx + (r-10) * math.cos(angle_rad) # cos(180) = -1 (Left)
            y1 = cy - (r-10) * math.sin(angle_rad) # Tkinter Y is down, so minus sin
            x2 = cx + r * math.cos(angle_rad)
            y2 = cy - r * math.sin(angle_rad)
            self.create_line(x1, y1, x2, y2, fill="white", width=2)
            
            # Label
            tx = cx + (r-25) * math.cos(angle_rad)
            ty = cy - (r-25) * math.sin(angle_rad)
            self.create_text(tx, ty, text=str(val), fill="silver", font=("Arial", 9, "bold"))

        # 5. Text
        self.create_text(cx, cy-40, text="EC Value", fill="#7f8c8d", font=("Arial", 10))
        self.val_text = self.create_text(cx, cy-15, text="0.00", fill="#2ecc71", font=("Arial", 28, "bold"))
        self.create_text(cx, cy+15, text="mS/cm", fill="#95a5a6", font=("Arial", 10))

        # 6. Needle
        self.needle = self.create_line(cx, cy, cx-r+10, cy, fill="#e74c3c", width=5, arrow="last", arrowshape=(16,20,6))
        # Center Cap
        self.create_oval(cx-10, cy-10, cx+10, cy+10, fill="#ecf0f1", outline="#bdc3c7")

    def set_value(self, val, target, tol):
        self.value = val
        self.target = target
        self.tol = tol
        self.draw_face() # Redraw for dynamic safe zone
        
        cx, cy, r = 150, 150, 110 # Slightly shorter needle
        val = max(0, min(4.0, val))
        
        angle_deg = 180 - (val / 4.0 * 180)
        angle_rad = math.radians(angle_deg)
        
        nx = cx + r * math.cos(angle_rad)
        ny = cy - r * math.sin(angle_rad)
        
        self.coords(self.needle, cx, cy, nx, ny)
        self.itemconfig(self.val_text, text=f"{val:.2f}")


class RainbowPH(tk.Canvas):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, width=300, height=250, bg="#2c3e50", highlightthickness=0, **kwargs)
        self.value = 7.0
        self.target = 5.8
        self.tol = 0.5
        self.draw_face()

    def draw_face(self):
        self.delete("all")
        cx, cy, r = 150, 140, 100
        start_ang, extent = 200, -220
        segments = [(4.0, "#e74c3c"), (2.0, "#e67e22"), (2.0, "#2ecc71"), (2.0, "#3498db"), (4.0, "#9b59b6")]
        current_ang = start_ang
        total_range = 14.0
        for span, color in segments:
            seg_extent = extent * (span / total_range)
            self.create_arc(cx-r, cy-r, cx+r, cy+r, start=current_ang, extent=seg_extent, style="arc", outline=color, width=20)
            current_ang += seg_extent
        
        min_v = max(0, self.target - self.tol)
        max_v = min(14.0, self.target + self.tol)
        start_pct = min_v / 14.0
        end_pct = max_v / 14.0
        range_start = start_ang + (extent * start_pct)
        range_end = start_ang + (extent * end_pct)
        range_ext = range_end - range_start
        self.create_arc(cx-r-15, cy-r-15, cx+r+15, cy+r+15, start=range_start, extent=range_ext, style="arc", outline="white", width=4)
        
        self.create_text(cx, cy+40, text="pH Value", fill="#7f8c8d", font=("Arial", 10))
        self.create_text(cx, cy+55, text=f"Target: {self.target}", fill="white", font=("Arial", 8))
        self.val_text = self.create_text(cx, cy+80, text="7.00", fill="white", font=("Arial", 24, "bold"))
        self.needle = self.create_line(cx, cy, cx, cy-80, fill="white", width=4, arrow="last")
        self.create_oval(cx-8, cy-8, cx+8, cy+8, fill="#95a5a6")

    def set_value(self, val, target, tol):
        self.value = val
        self.target = target
        self.tol = tol
        self.draw_face()
        cx, cy, r = 150, 140, 80
        start_ang, extent = 200, -220
        val = max(0, min(14.0, val))
        pct = val / 14.0
        ang_deg = start_ang + (extent * pct)
        ang_rad = math.radians(ang_deg)
        nx = cx + r * math.cos(ang_rad)
        ny = cy - r * math.sin(ang_rad)
        self.coords(self.needle, cx, cy, nx, ny)
        self.itemconfig(self.val_text, text=f"{val:.2f}")

class Thermometer(tk.Canvas):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, width=100, height=250, bg="#2c3e50", highlightthickness=0, **kwargs)
        self.value = 20.0
        self.target = 18.0
        self.tol = 2.0
        self.draw_face()

    def draw_face(self):
        self.delete("all")
        cx = 50
        self.create_oval(cx-20, 200, cx+20, 240, fill="#c0392b", outline="")
        self.create_rectangle(cx-8, 20, cx+8, 205, fill="#34495e", outline="")
        
        min_v = max(0, self.target - self.tol)
        max_v = min(40, self.target + self.tol)
        y_min = 200 - (min_v / 40.0 * 180)
        y_max = 200 - (max_v / 40.0 * 180)
        self.create_rectangle(cx+25, y_max, cx+29, y_min, fill="#2ecc71", outline="")
        
        self.mercury = self.create_rectangle(cx-4, 200, cx+4, 200, fill="#e74c3c", outline="")
        for i in range(5):
            y = 200 - (i * 45)
            self.create_line(cx+10, y, cx+18, y, fill="white", width=2)
            self.create_text(cx+35, y, text=str(i*10), fill="silver", font=("Arial", 8))
        self.val_text = self.create_text(cx, 10, text="20.0C", fill="white", font=("Arial", 10, "bold"))

    def set_value(self, val, target, tol):
        self.value = val
        self.target = target
        self.tol = tol
        self.draw_face()
        cx = 50
        val = max(0, min(40.0, val))
        height_px = (val / 40.0) * 180
        y_top = 200 - height_px
        self.coords(self.mercury, cx-4, y_top, cx+4, 210)
        self.itemconfig(self.val_text, text=f"{val:.1f}C")

class NutrientHMI:
    def __init__(self, root):
        self.root = root
        self.sim = NutrientSimulator()
        self.root.title("KF-NUTRI 11.0 (Sleek Semicircle EC)")
        self.root.geometry("1400x900")
        self.root.configure(bg="#2c3e50")
        self.setup_ui()
        self.update_loop()

    def setup_ui(self):
        header = tk.Frame(self.root, bg="#34495e", height=80)
        header.pack(fill="x")
        tk.Label(header, text="K-WASABI Integrated Control", font=("Arial", 24, "bold"), fg="white", bg="#34495e").pack(side="left", padx=20, pady=15)
        self.mode_btn = tk.Button(header, text="AUTO MODE", font=("Arial", 12, "bold"), bg="#2ecc71", fg="white", width=15, command=self.toggle_mode)
        self.mode_btn.pack(side="right", padx=20, pady=20)
        
        tab_frame = tk.Frame(self.root, bg="#2c3e50")
        tab_frame.pack(fill="x", padx=10, pady=10)
        self.btn_dash = tk.Button(tab_frame, text="📊 DASHBOARD", font=("Arial", 12, "bold"), bg="#3498db", fg="white", width=20, command=lambda: self.show_tab("DASH"))
        self.btn_dash.pack(side="left", padx=5)
        self.btn_nutri = tk.Button(tab_frame, text="🧪 NUTRIENT", font=("Arial", 12, "bold"), bg="#95a5a6", fg="white", width=20, command=lambda: self.show_tab("NUTRI"))
        self.btn_nutri.pack(side="left", padx=5)
        self.btn_water = tk.Button(tab_frame, text="💧 WATER", font=("Arial", 12, "bold"), bg="#95a5a6", fg="white", width=20, command=lambda: self.show_tab("WATER"))
        self.btn_water.pack(side="left", padx=5)
        
        self.content_frame = tk.Frame(self.root, bg="#2c3e50")
        self.content_frame.pack(fill="both", expand=True, padx=10, pady=10)
        self.frame_dash = tk.Frame(self.content_frame, bg="#2c3e50")
        self.frame_nutri = tk.Frame(self.content_frame, bg="#2c3e50")
        self.frame_water = tk.Frame(self.content_frame, bg="#2c3e50")
        self.setup_dashboard()
        self.setup_nutrient()
        self.setup_water()
        self.show_tab("DASH")

    def show_tab(self, tab_name):
        self.frame_dash.pack_forget()
        self.frame_nutri.pack_forget()
        self.frame_water.pack_forget()
        self.btn_dash.config(bg="#95a5a6")
        self.btn_nutri.config(bg="#95a5a6")
        self.btn_water.config(bg="#95a5a6")
        if tab_name == "DASH": self.frame_dash.pack(fill="both", expand=True); self.btn_dash.config(bg="#3498db")
        elif tab_name == "NUTRI": self.frame_nutri.pack(fill="both", expand=True); self.btn_nutri.config(bg="#3498db")
        elif tab_name == "WATER": self.frame_water.pack(fill="both", expand=True); self.btn_water.config(bg="#3498db")

    def setup_dashboard(self):
        env_frame = tk.LabelFrame(self.frame_dash, text="Environment", font=("Arial", 14, "bold"), fg="silver", bg="#2c3e50")
        env_frame.pack(fill="x", padx=20, pady=20)
        self.scale_solar = tk.Scale(env_frame, from_=0, to=1200, orient="horizontal", command=self.update_env, bg="#2c3e50", fg="white", length=400, label="Solar Radiation")
        self.scale_solar.set(500)
        self.scale_solar.pack(side="left", padx=20)
        self.lbl_env_dash = tk.Label(env_frame, text="Mode: Normal", font=("Arial", 16), fg="#f1c40f", bg="#2c3e50")
        self.lbl_env_dash.pack(side="right", padx=40)
        
        gauge_frame = tk.Frame(self.frame_dash, bg="#2c3e50")
        gauge_frame.pack(fill="x", pady=20)
        self.gauge_ec = SleekSemicircleEC(gauge_frame)
        self.gauge_ec.pack(side="left", padx=20)
        self.gauge_ph = RainbowPH(gauge_frame)
        self.gauge_ph.pack(side="left", padx=20)
        self.gauge_temp = Thermometer(gauge_frame)
        self.gauge_temp.pack(side="left", padx=40)
        
        self.lbl_state_dash = tk.Label(self.frame_dash, text="IDLE", font=("Arial", 48, "bold"), fg="#ecf0f1", bg="#2c3e50")
        self.lbl_state_dash.pack(pady=40)
        self.lbl_substate_dash = tk.Label(self.frame_dash, text="", font=("Arial", 16), fg="#f1c40f", bg="#2c3e50")
        self.lbl_substate_dash.pack()

    def setup_nutrient(self):
        panes = tk.Frame(self.frame_nutri, bg="#2c3e50")
        panes.pack(fill="both", expand=True)
        left = tk.Frame(panes, bg="#2c3e50")
        left.pack(side="left", fill="both", expand=True)
        tanks = tk.Frame(left, bg="#2c3e50")
        tanks.pack(pady=20)
        self.tank_a_ui = self.create_small_tank(tanks, "Sol A", "#e74c3c")
        self.tank_b_ui = self.create_small_tank(tanks, "Sol B", "#9b59b6")
        self.tank_c_ui = self.create_small_tank(tanks, "Acid", "#f1c40f")
        self.tank_main_canvas = tk.Canvas(left, width=200, height=300, bg="#ecf0f1", highlightthickness=0)
        self.tank_main_canvas.pack(pady=20)
        self.tank_main_fill = self.tank_main_canvas.create_rectangle(0, 300, 200, 300, fill="#3498db", outline="")
        self.main_tank_lbl = tk.Label(left, text="0 L", font=("Arial", 16, "bold"), fg="white", bg="#2c3e50")
        self.main_tank_lbl.pack()
        
        stats = tk.LabelFrame(left, text="Stats", fg="silver", bg="#2c3e50")
        stats.pack(fill="x", padx=20, pady=10)
        self.lbl_timer = tk.Label(stats, text="Time: 0.0s", font=("Arial", 12), fg="white", bg="#2c3e50")
        self.lbl_timer.pack(pady=2)
        self.lbl_total_dose = tk.Label(stats, text="Total A: 0.0L", font=("Arial", 12), fg="#f1c40f", bg="#2c3e50")
        self.lbl_total_dose.pack(pady=2)
        
        right = tk.LabelFrame(panes, text="Injection Controls", font=("Arial", 14), fg="silver", bg="#2c3e50", padx=20, pady=20)
        right.pack(side="right", fill="y", padx=20)
        self.safety_lbl = tk.Label(right, text="SAFETY OK", font=("Arial", 12, "bold"), bg="#2ecc71", fg="white", width=20)
        self.safety_lbl.pack(pady=20)
        self.indicators = {}
        self.bars = {}
        for v in ["Valve A", "Valve B", "Acid Valve"]: self.create_analog_control(right, v)
        tk.Frame(right, height=20, bg="#2c3e50").pack()
        for d in ["Mixing Pump", "Supply Pump", "Chiller"]: self.create_binary_control(right, d)

    def setup_water(self):
        main = tk.Frame(self.frame_water, bg="#2c3e50")
        main.pack(expand=True, fill="both")
        
        row1 = tk.Frame(main, bg="#2c3e50")
        row1.pack(pady=20)
        f1 = tk.Frame(row1, bg="#2c3e50")
        f1.pack(side="left", padx=20)
        tk.Label(f1, text="Raw Water Tank", fg="white", bg="#2c3e50", font=("Arial", 12)).pack()
        self.raw_canvas = tk.Canvas(f1, width=120, height=200, bg="#95a5a6", highlightthickness=0)
        self.raw_canvas.pack(pady=10)
        self.raw_fill = self.raw_canvas.create_rectangle(0, 200, 120, 200, fill="#34495e", outline="")
        self.raw_lbl = tk.Label(f1, text="500 L", fg="white", bg="#2c3e50")
        self.raw_lbl.pack()
        tk.Label(row1, text="➡", font=("Arial", 30), fg="silver", bg="#2c3e50").pack(side="left")
        f2 = tk.Frame(row1, bg="#2c3e50")
        f2.pack(side="left", padx=20)
        self.create_binary_control(f2, "Raw Pump")
        tk.Label(f2, text="⬇ (Sand Filter)", font=("Arial", 14), fg="silver", bg="#2c3e50", pady=10).pack()
        self.create_binary_control(f2, "Sand Filter")
        self.create_binary_control(f2, "UV Lamp")
        tk.Label(row1, text="➡", font=("Arial", 30), fg="silver", bg="#2c3e50").pack(side="left")
        f3 = tk.Frame(row1, bg="#2c3e50")
        f3.pack(side="left", padx=20)
        self.create_binary_control(f3, "Inlet Valve")
        tk.Label(f3, text="To Mixing Tank", fg="silver", bg="#2c3e50", pady=10).pack()

    def create_small_tank(self, p, n, c):
        f = tk.Frame(p, bg="#2c3e50")
        f.pack(side="left", padx=10)
        can = tk.Canvas(f, width=50, height=100, bg="#bdc3c7", highlightthickness=0)
        can.pack()
        fill = can.create_rectangle(0, 100, 50, 100, fill=c, outline="")
        tk.Label(p, text=n, font=("Arial", 10), fg="white", bg="#2c3e50").pack()
        return {"canvas": can, "fill": fill}

    def create_binary_control(self, p, n):
        r = tk.Frame(p, bg="#2c3e50", pady=2)
        r.pack(fill="x")
        tk.Label(r, text=n, font=("Arial", 10), fg="white", bg="#2c3e50", width=12).pack(side="left")
        i = tk.Label(r, text="OFF", font=("Arial", 8, "bold"), bg="#95a5a6", width=6)
        i.pack(side="right")
        self.indicators[n] = i

    def create_analog_control(self, p, n):
        f = tk.Frame(p, bg="#2c3e50")
        f.pack(fill="x", pady=2)
        tk.Label(f, text=n, font=("Arial", 10), fg="white", bg="#2c3e50", anchor="w").pack(fill="x")
        pb = ttk.Progressbar(f, orient="horizontal", length=200, mode="determinate")
        pb.pack()
        l = tk.Label(f, text="0%", font=("Arial", 9), fg="#f1c40f", bg="#2c3e50")
        l.pack()
        self.indicators[n] = l
        self.bars[n] = pb

    def update_env(self, _=None): self.sim.solar_rad = self.scale_solar.get()
    def toggle_mode(self):
        self.sim.auto_mode = not self.sim.auto_mode
        self.sim.state = "MANUAL" if not self.sim.auto_mode else "IDLE"
        if self.sim.auto_mode: self.mode_btn.config(text="AUTO MODE", bg="#2ecc71")
        else: self.mode_btn.config(text="MANUAL MODE", bg="#e67e22")

    def update_loop(self):
        self.sim.update()
        self.gauge_ec.set_value(self.sim.display_ec, self.sim.target_ec, self.sim.tol_ec)
        self.gauge_ph.set_value(self.sim.display_ph, self.sim.target_ph, self.sim.tol_ph)
        self.gauge_temp.set_value(self.sim.display_temp, self.sim.target_temp, self.sim.tol_temp)
        self.lbl_env_dash.config(text=self.sim.log_msg)
        self.lbl_state_dash.config(text=self.sim.state)
        self.lbl_substate_dash.config(text=self.sim.sub_state)
        h = (self.sim.tank_level / 200) * 300
        self.tank_main_canvas.coords(self.tank_main_fill, 0, 300 - h, 200, 300)
        self.main_tank_lbl.config(text=f"{int(self.sim.tank_level)}L")
        h_a = (self.sim.tank_a_level / 20) * 100
        self.tank_a_ui["canvas"].coords(self.tank_a_ui["fill"], 0, 100-h_a, 50, 100)
        h_b = (self.sim.tank_b_level / 20) * 100
        self.tank_b_ui["canvas"].coords(self.tank_b_ui["fill"], 0, 100-h_b, 50, 100)
        h_c = (self.sim.tank_c_level / 20) * 100
        self.tank_c_ui["canvas"].coords(self.tank_c_ui["fill"], 0, 100-h_c, 50, 100)
        self.lbl_timer.config(text=f"Time: {self.sim.dosing_duration:.1f}s")
        self.lbl_total_dose.config(text=f"A: {self.sim.total_a_dosed:.2f}L | B: {self.sim.total_b_dosed:.2f}L")
        if self.sim.safety_lock: self.safety_lbl.config(text="SAFETY LOCK ON", bg="#e74c3c")
        else: self.safety_lbl.config(text="SAFETY OK", bg="#2ecc71")
        raw_h = (self.sim.raw_water_level / 1000) * 200
        self.raw_canvas.coords(self.raw_fill, 0, 200 - raw_h, 120, 200)
        self.raw_lbl.config(text=f"{int(self.sim.raw_water_level)} L")
        for dev, val in self.sim.actuators.items():
            if dev in self.bars:
                pct = int(val * 100)
                self.bars[dev]["value"] = pct
                self.indicators[dev].config(text=f"{pct}%")
            elif dev in self.indicators:
                is_on = val
                self.indicators[dev].config(text="ON" if is_on else "OFF", bg="#e74c3c" if is_on else "#95a5a6")
        self.root.after(100, self.update_loop)

if __name__ == "__main__":
    root = tk.Tk()
    app = NutrientHMI(root)
    root.mainloop()
