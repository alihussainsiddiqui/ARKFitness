
let bmiRows = [];

// Load CDC CSV data from public folder
const loadCDCData = async () => {
  if (bmiRows.length > 0) {
    return bmiRows;
  }

  const response = await fetch('/data/bmi-for-age.csv');

  if (!response.ok) {
    throw new Error('Unable to load CDC BMI reference data.');
  }

  const csvData = await response.text();

  bmiRows = csvData
    .replace(/^\uFEFF/, '')
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .slice(1)
    .map((line) => {
      const columns = line.split(',').map((value) =>
        Number(value.trim())
      );

      return {
        Sex: columns[0],
        Agemos: columns[1],
        L: columns[2],
        M: columns[3],
        S: columns[4]
      };
    })
    .filter((row) =>
      Number.isFinite(row.Sex) &&
      Number.isFinite(row.Agemos) &&
      Number.isFinite(row.L) &&
      Number.isFinite(row.M) &&
      Number.isFinite(row.S)
    );

  if (bmiRows.length === 0) {
    throw new Error('CDC CSV file contains no valid data.');
  }

  return bmiRows;
};

// Approximation of error function
const erf = (x) => {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1 / (1 + 0.3275911 * x);

  const y = 1 - (
    (((((1.061405429 * t - 1.453152027) * t)
    + 1.421413741) * t - 0.284496736) * t
    + 0.254829592) * t * Math.exp(-x * x)
  );

  return sign * y;
};

// Convert Z-score into percentile
const zToPercentile = (z) => {
  return (0.5 * (1 + erf(z / Math.sqrt(2)))) * 100;
};

// Main BMI calculator
export const calculateBMI = async ({
  weight,
  height,
  age,
  sex
}) => {

  // Validate input
  if (
    !Number.isFinite(weight) ||
    !Number.isFinite(height) ||
    !Number.isFinite(age) ||
    weight <= 0 ||
    height <= 0
  ) {
    throw new Error('Please enter valid height and weight.');
  }

  if (age < 15) {
    throw new Error('This calculator supports ages 15 and above.');
  }

  const bmi = weight / (height * height);

  // Adult BMI calculation (20 years and above)
  if (age >= 20) {
    let category;

    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obesity';

    return {
      bmi: Number(bmi.toFixed(1)),
      category,
      type: 'adult'
    };
  }

  // CDC BMI-for-age calculation (15–19 years)
  const rows = await loadCDCData();

  const sexCode = sex === 'male' ? 1 : 2;
  const targetMonths = age * 12;

  const sexRows = rows.filter(
    (row) => row.Sex === sexCode
  );

  if (sexRows.length === 0) {
    throw new Error('CDC data for selected gender was not found.');
  }

  // Find closest age reference row
  const reference = sexRows.reduce((closest, row) => {
    if (!closest) return row;

    return Math.abs(row.Agemos - targetMonths) <
      Math.abs(closest.Agemos - targetMonths)
      ? row
      : closest;
  }, null);

  if (!reference) {
    throw new Error('CDC reference data not found.');
  }

  const { L, M, S } = reference;

  // LMS Z-score formula
  const zScore = L === 0
    ? Math.log(bmi / M) / S
    : (Math.pow(bmi / M, L) - 1) / (L * S);

  const percentile = zToPercentile(zScore);

  let category;

  if (percentile < 5) {
    category = 'Underweight';
  } else if (percentile < 85) {
    category = 'Healthy Weight';
  } else if (percentile < 95) {
    category = 'Overweight';
  } else {
    category = 'Obesity';
  }

  return {
    bmi: Number(bmi.toFixed(1)),
    percentile: Number(percentile.toFixed(1)),
    category,
    type: 'teen'
  };
};
