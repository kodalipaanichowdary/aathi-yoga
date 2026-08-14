/**
 * Reference nutrition plans. `kcal` and `macros` (grams per day) drive the macro
 * bar and calorie ring on each card; `mealPlan` drives the per-meal breakdown.
 * `calories` and `nutrition` stay as the human-readable summaries used in the
 * homepage promo row.
 */
export const DIET_PLANS = [
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    calories: '1400-1600 kcal/day',
    kcal: 1500,
    macros: { protein: 115, carbs: 140, fat: 42 },
    meals: 'Breakfast, mid-morning snack, lunch, evening snack, dinner',
    nutrition: 'High protein, moderate carbs, low added sugar',
    mealPlan: [
      { slot: 'Breakfast', name: 'Moong dal chilla + curd', kcal: 340 },
      { slot: 'Lunch', name: 'Grilled paneer, salad, 1 roti', kcal: 480 },
      { slot: 'Dinner', name: 'Vegetable soup + sauteed greens', kcal: 380 },
    ],
  },
  {
    id: 'weight-gain',
    name: 'Weight Gain',
    calories: '2600-2900 kcal/day',
    kcal: 2750,
    macros: { protein: 150, carbs: 340, fat: 95 },
    meals: 'Breakfast, mid-morning snack, lunch, pre-workout, dinner, night snack',
    nutrition: 'Calorie-dense whole foods, higher healthy fats and complex carbs',
    mealPlan: [
      { slot: 'Breakfast', name: 'Oats, banana, peanut butter, milk', kcal: 620 },
      { slot: 'Lunch', name: 'Rice, dal, paneer curry, ghee', kcal: 820 },
      { slot: 'Dinner', name: 'Khichdi with curd and salad', kcal: 700 },
    ],
  },
  {
    id: 'general-wellness',
    name: 'General Wellness',
    calories: '1800-2000 kcal/day',
    kcal: 1900,
    macros: { protein: 95, carbs: 230, fat: 60 },
    meals: 'Breakfast, lunch, evening snack, dinner',
    nutrition: 'Balanced macros with an emphasis on whole, unprocessed foods',
    mealPlan: [
      { slot: 'Breakfast', name: 'Idli with sambar', kcal: 400 },
      { slot: 'Lunch', name: 'Brown rice, sabzi, dal, curd', kcal: 620 },
      { slot: 'Dinner', name: '2 rotis with mixed vegetables', kcal: 480 },
    ],
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    calories: '1700-1900 kcal/day',
    kcal: 1800,
    macros: { protein: 88, carbs: 225, fat: 55 },
    meals: 'Breakfast, mid-morning snack, lunch, evening snack, dinner',
    nutrition: 'Plant-based protein sources, iron and B12-conscious planning',
    mealPlan: [
      { slot: 'Breakfast', name: 'Poha with peanuts + sprouts', kcal: 390 },
      { slot: 'Lunch', name: 'Rajma, rice, beetroot salad', kcal: 600 },
      { slot: 'Dinner', name: 'Palak paneer with roti', kcal: 470 },
    ],
  },
  {
    id: 'high-protein',
    name: 'High Protein',
    calories: '2000-2200 kcal/day',
    kcal: 2100,
    macros: { protein: 165, carbs: 195, fat: 65 },
    meals: 'Breakfast, post-workout, lunch, snack, dinner',
    nutrition: '1.6-2g protein per kg body weight, moderate carbs',
    mealPlan: [
      { slot: 'Breakfast', name: 'Besan omelette + curd bowl', kcal: 450 },
      { slot: 'Lunch', name: 'Soya chunk curry, quinoa, salad', kcal: 660 },
      { slot: 'Dinner', name: 'Tofu stir-fry with millet roti', kcal: 540 },
    ],
  },
  {
    id: 'senior-citizen',
    name: 'Senior Citizen',
    calories: '1600-1800 kcal/day',
    kcal: 1700,
    macros: { protein: 80, carbs: 215, fat: 50 },
    meals: 'Breakfast, lunch, evening tea, light dinner',
    nutrition: 'Easily digestible meals, calcium and fibre-focused',
    mealPlan: [
      { slot: 'Breakfast', name: 'Ragi porridge with dates', kcal: 360 },
      { slot: 'Lunch', name: 'Soft khichdi, curd, boiled veg', kcal: 560 },
      { slot: 'Dinner', name: 'Vegetable dalia, warm milk', kcal: 420 },
    ],
  },
]

export function getDietPlanById(id) {
  return DIET_PLANS.find((plan) => plan.id === id) ?? null
}
