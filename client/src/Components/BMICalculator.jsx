
import React, { useState } from 'react';
import { calculateBMI as calculateBMIValue } from '../utils/bmiCalculator';

const BMICalculator = () => {
  const [unit, setUnit] = useState('metric');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUnitChange = (value) => {
    setUnit(value);
    setHeight('');
    setFeet('');
    setInches('');
    setWeight('');
    setResult(null);
    setError('');
  };

  const calculateBMI = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const ageValue = Number(age);
    const weightValue = Number(weight);

    if (!age || ageValue < 15 || ageValue > 100) {
      setError('Please enter a valid age between 15 and 100.');
      return;
    }

    if (!weight || weightValue <= 0) {
      setError('Please enter a valid weight.');
      return;
    }

    let heightInMeters;
    let weightInKg;

    if (unit === 'metric') {
      if (!height || Number(height) <= 0) {
        setError('Please enter a valid height.');
        return;
      }

      heightInMeters = Number(height) / 100;
      weightInKg = weightValue;
    } else {
      const feetValue = Number(feet) || 0;
      const inchesValue = Number(inches) || 0;

      if (
        (!feet && !inches) ||
        feetValue < 0 ||
        inchesValue < 0 ||
        inchesValue >= 12
      ) {
        setError('Please enter a valid height in feet and inches.');
        return;
      }

      const totalInches = feetValue * 12 + inchesValue;

      if (totalInches <= 0) {
        setError('Please enter a valid height.');
        return;
      }

      heightInMeters = totalInches * 0.0254;
      weightInKg = weightValue * 0.45359237;
    }

    try {
    
      const calculatedResult = await calculateBMIValue({
        age: ageValue,
        sex: gender,
        height: heightInMeters,
        weight: weightInKg
      });

      let description = '';
      let color = '';

      if (calculatedResult.category === 'Underweight') {
        description = 'Your BMI is below the recommended weight range.';
        color = 'text-blue-400';
      } else if (
        calculatedResult.category === 'Normal' ||
        calculatedResult.category === 'Healthy Weight'
      ) {
        description = 'Your BMI is within the healthy weight range.';
        color = 'text-green-400';
      } else if (calculatedResult.category === 'Overweight') {
        description = 'Your BMI is above the healthy weight range.';
        color = 'text-yellow-400';
      } else {
        description = 'Your BMI falls in the obesity range.';
        color = 'text-red-400';
      }

      setResult({
        ...calculatedResult,
        description,
        color,
        isAdult: calculatedResult.type === 'adult'
      });
    } catch (err) {
      setError(err.message || 'Unable to calculate BMI. Please try again.');
    }
  };

  const inputClass =
    'w-full bg-[#111318] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all';

  const adultCategories = [
    ['Underweight', 'Below 18.5', 'bg-blue-400'],
    ['Normal Weight', '18.5 – 24.9', 'bg-green-400'],
    ['Overweight', '25 – 29.9', 'bg-yellow-400'],
    ['Obesity', '30 or above', 'bg-red-400']
  ];

  const teenCategories = [
    ['Underweight', 'Below 5th percentile', 'bg-blue-400'],
    ['Healthy Weight', '5th to below 85th', 'bg-green-400'],
    ['Overweight', '85th to below 95th', 'bg-yellow-400'],
    ['Obesity', '95th or above', 'bg-red-400']
  ];

  return (
    <section className="py-24 bg-darkBg relative overflow-hidden">
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="text-primary text-xs font-black tracking-[0.3em] uppercase">
            Know Your Body
          </span>

          <h2 className="text-4xl md:text-5xl font-heading font-black text-headings mt-4">
            BMI <span className="text-primary">CALCULATOR.</span>
          </h2>

          <p className="text-bodyText mt-4 max-w-xl mx-auto leading-relaxed">
            Understand your body mass index and get a quick overview
            of your weight status.
          </p>
        </div>

        {/* Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* LEFT: INPUT FORM */}
          <div className="bg-darkCard border border-gray-800 rounded-3xl p-6 md:p-9 shadow-2xl">

            <div className="mb-8">
              <h3 className="text-2xl font-heading font-bold text-headings">
                Calculate Your BMI
              </h3>
              <p className="text-bodyText text-sm mt-2">
                Enter your details below to calculate your BMI.
              </p>
            </div>

            <form onSubmit={calculateBMI}>

              {/* Units */}
              <div className="mb-7">
                <label className="block text-sm font-bold text-headings mb-3">
                  Measurement Units
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleUnitChange('metric')}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${unit === 'metric'
                      ? 'bg-primary text-white shadow-lg shadow-orange-500/20'
                      : 'bg-[#111318] text-bodyText border border-gray-700 hover:border-gray-500'
                      }`}
                  >
                    Metric (kg / cm)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUnitChange('us')}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${unit === 'us'
                      ? 'bg-primary text-white shadow-lg shadow-orange-500/20'
                      : 'bg-[#111318] text-bodyText border border-gray-700 hover:border-gray-500'
                      }`}
                  >
                    US (lbs / ft)
                  </button>
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-bold text-headings mb-2">
                    Age (years)
                  </label>

                  <input
                    type="number"
                    min="15"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-headings mb-2">
                    Gender
                  </label>

                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={inputClass}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Height */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-headings mb-2">
                  Height
                </label>

                {unit === 'metric' ? (
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Enter your height"
                      className={`${inputClass} pr-16`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        placeholder="Feet"
                        className={`${inputClass} pr-12`}
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        ft
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        placeholder="Inches"
                        className={`${inputClass} pr-12`}
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        in
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-headings mb-2">
                  Current Weight
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter your weight"
                    className={`${inputClass} pr-16`}
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    {unit === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-5">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-orange-500 text-white font-black tracking-wider py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/10"
              >
                CALCULATE BMI
              </button>

            </form>
          </div>

          {/* RIGHT: RESULT */}
          <div className="bg-darkCard border border-gray-800 rounded-3xl p-6 md:p-9 shadow-2xl flex flex-col">

            <div className="mb-8">
              <span className="text-primary text-xs font-black tracking-[0.2em] uppercase">
                Your Health Overview
              </span>

              <h3 className="text-2xl font-heading font-bold text-headings mt-2">
                Your BMI Result
              </h3>
            </div>

            {result ? (
              <div className="flex-1 flex flex-col">

                <div className="bg-[#111318] rounded-2xl p-7 text-center border border-gray-800">
                  <p className="text-bodyText text-sm font-semibold uppercase tracking-widest">
                    Your BMI Score
                  </p>

                  <h4 className="text-7xl font-black text-primary mt-4">
                    {result.bmi}
                  </h4>

                  <p className={`text-xl font-bold mt-4 ${result.color}`}>
                    {result.category}
                  </p>

                  {result.isAdult ? (
                    <p className="text-bodyText text-sm mt-3 leading-relaxed">
                      {result.description}
                    </p>
                  ) : (
                    <>
                      <div className="mt-5 pt-5 border-t border-gray-800">
                        <p className="text-bodyText text-xs font-semibold uppercase tracking-widest">
                          BMI-for-age percentile
                        </p>

                        <p className="text-4xl font-black text-headings mt-2">
                          {result.percentile}%
                        </p>
                      </div>

                      <p className="text-bodyText text-sm mt-4 leading-relaxed">
                        {result.description}
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-7">
                  <h4 className="text-headings font-bold mb-4">
                    {result.isAdult
                      ? 'Adult BMI Categories'
                      : 'BMI-for-age Categories'}
                  </h4>

                  <div className="space-y-3">
                    {(result.isAdult
                      ? adultCategories
                      : teenCategories
                    ).map(([label, range, color]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3 bg-[#111318] rounded-xl px-4 py-3 border border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                          <span className="text-headings text-sm font-medium">
                            {label}
                          </span>
                        </div>

                        <span className="text-bodyText text-xs sm:text-sm text-right">
                          {range}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center bg-[#111318] rounded-2xl border border-gray-800 border-dashed p-8 min-h-[350px]">

                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 7h6m-6 4h6m-6 4h3m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v10a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <h4 className="text-xl font-bold text-headings">
                  Your Results Will Appear Here
                </h4>

                <p className="text-bodyText text-sm mt-3 max-w-xs leading-relaxed">
                  Fill in your age, gender, height and weight, then calculate
                  your BMI to see your result.
                </p>

                <div className="mt-7 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Waiting for your details
                </div>

              </div>
            )}

            <p className="text-gray-500 text-xs mt-6 leading-relaxed">
              BMI is a screening measure, not a diagnosis. For ages 15–19,
              BMI is interpreted using age- and sex-specific percentiles.
              Adult BMI categories are used from age 20.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;
