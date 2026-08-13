// Accepted input ranges for the prediction form.
// Bounds follow the training dataset (Machinelearning/Dataset/Crop_recommendation.csv)
// rounded to standard agricultural limits.
export const SOIL_RANGES = {
  nitrogen: { label: 'Nitrogen (N)', min: 0, max: 140, unit: 'kg/ha', step: 1 },
  phosphorus: { label: 'Phosphorus (P)', min: 0, max: 140, unit: 'kg/ha', step: 1 },
  potassium: { label: 'Potassium (K)', min: 0, max: 205, unit: 'kg/ha', step: 1 },
  ph: { label: 'Soil pH', min: 0, max: 14, unit: '', step: 0.1 },
};

export function validateSoilValue(field, rawValue) {
  const range = SOIL_RANGES[field];
  if (!range) return '';

  const value = String(rawValue).trim();
  if (value === '') return 'Required';

  const number = Number(value);
  if (!Number.isFinite(number)) return 'Must be a valid number';
  if (number < range.min || number > range.max) {
    return `${range.label} must be between ${range.min} and ${range.max}${
      range.unit ? ` ${range.unit}` : ''
    }`;
  }

  return '';
}
