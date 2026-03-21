// Standard emission factors in kg CO2 per unit
export const EMISSION_FACTORS = {
  travel: {
    car: { factor: 0.21, unit: "km", label: "Car", icon: "Car" },
    bus: { factor: 0.089, unit: "km", label: "Bus", icon: "Bus" },
    train: { factor: 0.041, unit: "km", label: "Train", icon: "Train" },
    bicycle: { factor: 0, unit: "km", label: "Bicycle", icon: "Bike" },
    walking: { factor: 0, unit: "km", label: "Walking", icon: "Footprints" },
    flight_short: { factor: 0.255, unit: "km", label: "Short Flight (<1500km)", icon: "Plane" },
    flight_long: { factor: 0.195, unit: "km", label: "Long Flight (>1500km)", icon: "Plane" },
    motorcycle: { factor: 0.113, unit: "km", label: "Motorcycle", icon: "Bike" },
  },
  food: {
    beef_meal: { factor: 6.61, unit: "serving", label: "Beef Meal", icon: "Beef" },
    chicken_meal: { factor: 1.82, unit: "serving", label: "Chicken Meal", icon: "Drumstick" },
    fish_meal: { factor: 1.34, unit: "serving", label: "Fish Meal", icon: "Fish" },
    vegetarian_meal: { factor: 0.51, unit: "serving", label: "Vegetarian Meal", icon: "Salad" },
    vegan_meal: { factor: 0.39, unit: "serving", label: "Vegan Meal", icon: "Leaf" },
    dairy: { factor: 1.39, unit: "serving", label: "Dairy Products", icon: "Milk" },
  },
  electricity: {
    lighting: { factor: 0.42, unit: "kWh", label: "Lighting", icon: "Lightbulb" },
    heating: { factor: 0.42, unit: "kWh", label: "Heating/Cooling", icon: "Thermometer" },
    appliances: { factor: 0.42, unit: "kWh", label: "Appliances", icon: "Plug" },
    charging: { factor: 0.42, unit: "kWh", label: "Device Charging", icon: "BatteryCharging" },
  },
};

export const CATEGORY_CONFIG = {
  travel: { label: "Travel", color: "#0D9488", bgColor: "bg-teal-50", textColor: "text-teal-700", borderColor: "border-teal-200" },
  food: { label: "Food", color: "#D97706", bgColor: "bg-amber-50", textColor: "text-amber-700", borderColor: "border-amber-200" },
  electricity: { label: "Electricity", color: "#2563EB", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
};

export function calculateCarbon(category, activityType, value) {
  const factor = EMISSION_FACTORS[category]?.[activityType]?.factor || 0;
  return Math.round(factor * value * 100) / 100;
}

export const ECO_TIPS = [
  { category: "travel", tip: "Switch one car trip per week to cycling — saves ~3kg CO₂", icon: "Bike" },
  { category: "travel", tip: "Take the train instead of flying for trips under 500km", icon: "Train" },
  { category: "food", tip: "One meatless day per week can save ~150kg CO₂ per year", icon: "Leaf" },
  { category: "food", tip: "Choosing chicken over beef cuts emissions by 70%", icon: "Drumstick" },
  { category: "electricity", tip: "Switching to LED bulbs saves up to 75% electricity", icon: "Lightbulb" },
  { category: "electricity", tip: "Unplug devices when not in use to avoid phantom loads", icon: "Plug" },
  { category: "general", tip: "Track consistently — awareness is the first step to change", icon: "BarChart3" },
  { category: "general", tip: "Share your progress — inspire others to go green", icon: "Share2" },
];