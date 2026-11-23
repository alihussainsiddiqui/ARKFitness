
import React, { useState } from 'react';

const ACTIVITY_LEVELS = [
  { value: '1.2', label: 'Sedentary', description: 'Little or no exercise' },
  { value: '1.375', label: 'Lightly Active', description: 'Exercise 1–3 days/week' },
  { value: '1.55', label: 'Moderately Active', description: 'Exercise 3–5 days/week' },
  { value: '1.725', label: 'Very Active', description: 'Exercise 6–7 days/week' },
  { value: '1.9', label: 'Extra Active', description: 'Very hard training or physical job' },
];

const EXPERIENCE_LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Less than 1 year',
    minSurplus: 300,
    maxSurplus: 500,
    minMuscle: 0.7,
    maxMuscle: 1.0,
    minFat: 0.2,
    maxFat: 0.6,
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: '1–3 years',
    minSurplus: 200,
    maxSurplus: 350,
    minMuscle: 0.4,
    maxMuscle: 0.7,
    minFat: 0.15,
    maxFat: 0.4,
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: '3+ years',
    minSurplus: 150,
    maxSurplus: 250,
    minMuscle: 0.1,
    maxMuscle: 0.4,
    minFat: 0.1,
    maxFat: 0.3,
  },
];

const formatNumber = (value) =>
  Math.round(value).toLocaleString('en-US');

const BulkingCalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    sex: 'male',
    activity: '1.55',
    experience: 'beginner',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const calculateBulkingCalories = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const weight = Number(formData.weight);
    const height = Number(formData.height);
    const age = Number(formData.age);

    if (!weight || weight <= 0 || weight > 500) {
      setError('Please enter a valid weight in kilograms.');
      return;
    }

    if (!height || height <= 0 || height > 250) {
      setError('Please enter a valid height in centimeters.');
      return;
    }

    if (!age || age < 15 || age > 100) {
      setError('Please enter a valid age between 15 and 100.');
      return;
    }

    // Mifflin-St Jeor BMR formula
    const bmr =
      10 * weight +
      6.25 * height -
      5 * age +
      (formData.sex === 'male' ? 5 : -161);

    // TDEE = BMR × Activity Multiplier
    const tdee = bmr * Number(formData.activity);

    const experience = EXPERIENCE_LEVELS.find(
      (item) => item.value === formData.experience
    );

    // Use the middle of the recommended surplus range
    const surplus = Math.round(
      (experience.minSurplus + experience.maxSurplus) / 2
    );

    const bulkingCalories = Math.round(tdee + surplus);

    // Suggested clean-bulk macros
    const protein = Math.round(weight * 2);
    const fat = Math.round(weight * 0.9);
    const carbs = Math.max(
      0,
      Math.round(
        (bulkingCalories - protein * 4 - fat * 9) / 4
      )
    );

    // Estimated time to gain 5 kg of muscle
    const fastestWeeks = Math.ceil(
      (5 / experience.maxMuscle) * 4.345
    );

    const slowestWeeks = Math.ceil(
      (5 / experience.minMuscle) * 4.345
    );

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      surplus,
      minSurplus: experience.minSurplus,
      maxSurplus: experience.maxSurplus,
      bulkingCalories,
      minBulkingCalories: Math.round(tdee + experience.minSurplus),
      maxBulkingCalories: Math.round(tdee + experience.maxSurplus),
      experience,
      protein,
      carbs,
      fat,
      fastestWeeks,
      slowestWeeks,
    });
  };

  const resetCalculator = () => {
    setFormData({
      weight: '',
      height: '',
      age: '',
      sex: 'male',
      activity: '1.55',
      experience: 'beginner',
    });
    setResult(null);
    setError('');
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20';

  const labelClass =
    'mb-2 block text-sm font-medium text-gray-300';

  return (
    <div className="min-h-screen bg-darkBg px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Page Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            ARK Fitness Tools
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Bulking Calories <span className="text-orange-500">Calculator</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Calculate your daily calorie target, maintenance calories
            and suggested macros to support your muscle-building journey.
          </p>
        </div>

        {/* Calculator Form */}
        <form
          onSubmit={calculateBulkingCalories}
          className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-5 shadow-xl sm:p-8"
        >
          <div className="mb-7">
            <h2 className="text-xl font-bold">Your Personal Details</h2>
            <p className="mt-1 text-sm text-gray-400">
              Enter your details to calculate your bulking requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Weight */}
            <div>
              <label className={labelClass}>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 75"
                min="1"
                step="0.1"
                className={inputClass}
              />
            </div>

            {/* Height */}
            <div>
              <label className={labelClass}>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 175"
                min="1"
                step="0.1"
                className={inputClass}
              />
            </div>

            {/* Age */}
            <div>
              <label className={labelClass}>Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 25"
                min="15"
                max="100"
                className={inputClass}
              />
            </div>

            {/* Sex */}
            <div>
              <label className={labelClass}>Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className={labelClass}>Activity Level</label>
              <select
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                className={inputClass}
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} — {level.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className={labelClass}>Training Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={inputClass}
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} ({level.description})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
            >
              Calculate Bulking Calories
            </button>

            <button
              type="button"
              onClick={resetCalculator}
              className="rounded-xl border border-white/10 px-6 py-4 font-semibold text-gray-300 transition hover:border-orange-500 hover:text-orange-500"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-6">

            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
                Your Bulking Plan
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Your Daily Calorie Targets
              </h2>
            </div>

            {/* Main Calories Cards */}
            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-blue-500/50 bg-blue-500/10 p-6">
                <p className="font-semibold text-blue-400">
                  ◉ TDEE (Maintenance)
                </p>
                <h3 className="mt-3 text-3xl font-extrabold text-blue-400 sm:text-4xl">
                  {formatNumber(result.tdee)} kcal
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Calories to maintain your current weight
                </p>
              </div>

              <div className="rounded-2xl border border-green-500/50 bg-green-500/10 p-6">
                <p className="font-semibold text-green-400">
                  ↗ Bulking Calories
                </p>
                <h3 className="mt-3 text-3xl font-extrabold text-green-400 sm:text-4xl">
                  {formatNumber(result.bulkingCalories)} kcal
                </h3>
                <p className="mt-2 text-sm text-green-400">
                  +{result.minSurplus}–{result.maxSurplus} kcal surplus
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Suggested target: {formatNumber(result.bulkingCalories)} kcal/day
                </p>
              </div>
            </div>

            {/* Surplus Explanation */}
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
              <h3 className="font-bold text-orange-400">
                ⓘ Why this surplus for a {result.experience.label.toLowerCase()}?
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-300">
                {result.experience.label === 'Beginner'
                  ? 'Beginners generally have greater muscle-building potential. A moderate surplus can support muscle growth while helping limit unnecessary fat gain.'
                  : result.experience.label === 'Intermediate'
                  ? 'Intermediate lifters usually benefit from a more controlled surplus as muscle-building progress becomes slower with experience.'
                  : 'Advanced lifters generally need a smaller, more controlled surplus because their rate of muscle growth is slower.'}
              </p>
            </div>

            {/* Muscle and Fat Gain */}
            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-[#202020] p-6">
                <p className="font-semibold text-gray-200">
                  💪 Monthly Muscle Gain
                </p>
                <h3 className="mt-3 text-3xl font-extrabold text-purple-400">
                  {result.experience.minMuscle}–{result.experience.maxMuscle} kg
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Estimated muscle gain per month
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#202020] p-6">
                <p className="font-semibold text-gray-200">
                  ↗ Monthly Fat Gain
                </p>
                <h3 className="mt-3 text-3xl font-extrabold text-orange-400">
                  {result.experience.minFat}–{result.experience.maxFat} kg
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Approximate estimate, not a guaranteed outcome
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-6">
              <h3 className="text-lg font-bold">
                ◷ Timeline: Time to gain 5 kg of muscle
              </h3>

              <div className="mt-6">
                <div className="h-4 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-orange-500 to-purple-500" />
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <span>0 weeks</span>
                  <span className="font-bold text-purple-300">
                    {result.fastestWeeks}–{result.slowestWeeks} weeks
                  </span>
                  <span>60 weeks</span>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-gray-300">
                Based on the estimated muscle-gain range, gaining 5 kg of
                muscle may take approximately{' '}
                <strong className="text-white">
                  {Math.round(result.fastestWeeks / 4.345)}–
                  {Math.round(result.slowestWeeks / 4.345)} months.
                </strong>
                {' '}Actual results vary between individuals.
              </p>
            </div>

            {/* Macros */}
            <div className="rounded-2xl border border-white/10 bg-[#202020] p-6">
              <h3 className="text-xl font-bold">
                🍎 Suggested Macros for Clean Bulk
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Daily macro estimates based on your bulking calorie target.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-white/10 bg-[#171717] p-5 text-center">
                  <p className="text-sm text-gray-400">Protein</p>
                  <h4 className="mt-2 text-3xl font-extrabold text-red-400">
                    {result.protein}g
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">
                    {result.protein * 4} kcal
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#171717] p-5 text-center">
                  <p className="text-sm text-gray-400">Carbohydrates</p>
                  <h4 className="mt-2 text-3xl font-extrabold text-yellow-400">
                    {result.carbs}g
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">
                    {result.carbs * 4} kcal
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#171717] p-5 text-center">
                  <p className="text-sm text-gray-400">Fat</p>
                  <h4 className="mt-2 text-3xl font-extrabold text-blue-400">
                    {result.fat}g
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">
                    {result.fat * 9} kcal
                  </p>
                </div>
              </div>
            </div>

            {/* BMR */}
            <div className="rounded-xl border border-white/10 bg-[#202020] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-200">
                    Basal Metabolic Rate (BMR)
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Estimated calories your body burns at rest
                  </p>
                </div>

                <p className="text-2xl font-bold text-orange-500">
                  {formatNumber(result.bmr)} kcal
                </p>
              </div>
            </div>

            <p className="text-center text-xs leading-6 text-gray-500">
              These calculations are estimates for general fitness planning,
              not medical or individual nutrition advice. Muscle and fat gain
              depend on training, recovery, genetics and consistency.
            </p>

          </div>
        )}
      </div>
    </div>
  );
};

export default BulkingCalculator;
