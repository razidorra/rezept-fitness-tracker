const today = new Date().toISOString().slice(0, 10);
const ACTIVITY = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
const GOAL_ADJUSTMENT = { lose: -300, maintain: 0, gain: 250 };
const profiles = new Map();
const dailyPlans = new Map();

function planKey(userId) { return `fitmeal:daily-plan:${userId}:${today}`; }

export function loadPlannerProfile(userId) {
  return userId ? profiles.get(userId) || null : null;
}

export function savePlannerProfile(userId, profile) {
  profiles.set(userId, { ...profile });
}

export function loadDailyPlan(userId) {
  return userId ? dailyPlans.get(planKey(userId)) || [] : [];
}

export function saveDailyPlan(userId, plan) {
  dailyPlans.set(planKey(userId), [...plan]);
  return plan;
}

export function estimateTargets(profile) {
  const weight = Number(profile.weight);
  const height = Number(profile.height);
  const age = Number(profile.age);
  const resting = 10 * weight + 6.25 * height - 5 * age + (profile.sex === "male" ? 5 : -161);
  const calories = Math.round(Math.max(1200, Math.min(5000, resting * ACTIVITY[profile.activity] + GOAL_ADJUSTMENT[profile.goal])));
  const protein = Math.round(weight * 1.6);
  const fat = Math.round(weight * 0.8);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories, protein, carbs, fat };
}

export function tryAddToDailyPlan(userId, item) {
  const profile = loadPlannerProfile(userId);
  if (!profile) return { status: "profile-required" };

  const plan = loadDailyPlan(userId);
  const plannedCalories = plan.reduce((sum, entry) => sum + Number(entry.kcal || 0), 0);
  const target = estimateTargets(profile).calories;
  const nextCalories = plannedCalories + Number(item.kcal || 0);
  if (nextCalories > target) {
    return { status: "over-target", over: Math.round(nextCalories - target), target };
  }

  const planId = plan.reduce((largest, entry) => Math.max(largest, Number(entry.planId) || 0), 0) + 1;
  saveDailyPlan(userId, [...plan, { ...item, planId }]);
  return { status: "added", remaining: Math.round(target - nextCalories), target };
}
