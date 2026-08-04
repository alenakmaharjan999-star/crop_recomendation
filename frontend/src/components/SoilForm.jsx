import { useState } from 'react';
import FormField from './FormField';
import './Forms.css';

const initialValues = {
  location: '',
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  ph: '',
};

const requiredFields = new Set(['location', 'nitrogen', 'phosphorus', 'potassium', 'ph']);

export default function SoilForm({ onSubmit, loading }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [coordinates, setCoordinates] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name === 'location') {
      setCoordinates(null);
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};

    Object.entries(values).forEach(([key, val]) => {
      const isEmpty = val === '' || val === null;

      if (key === 'location' && String(val).trim() === '') {
        errs[key] = 'Required';
      } else if (requiredFields.has(key) && isEmpty) {
        errs[key] = 'Required';
      } else if (key !== 'location' && !isEmpty && Number.isNaN(Number(val))) {
        errs[key] = 'Must be a number';
      }
    });

    if (values.ph !== '' && (Number(values.ph) < 0 || Number(values.ph) > 14)) {
      errs.ph = 'pH must be between 0 and 14';
    }

    const manualCoordinates = parseCoordinates(values.location);
    if (!coordinates && !manualCoordinates) {
      errs.location = 'Detect your location or enter latitude, longitude';
    }

    return errs;
  }

  function handleDetectLocation() {
    setErrors((prev) => ({ ...prev, location: '' }));

    if (!navigator.geolocation) {
      setErrors((prev) => ({
        ...prev,
        location: 'Geolocation is not supported by this browser',
      }));
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCoordinates(nextCoordinates);
        setValues((prev) => ({
          ...prev,
          location: `${nextCoordinates.latitude.toFixed(6)}, ${nextCoordinates.longitude.toFixed(6)}`,
        }));
        setDetectingLocation(false);
      },
      () => {
        setDetectingLocation(false);
        setErrors((prev) => ({
          ...prev,
          location: 'Could not detect location. Enter latitude, longitude manually.',
        }));
      }
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const manualCoordinates = parseCoordinates(values.location);
    const submitCoordinates = coordinates || manualCoordinates;

    onSubmit({
      nitrogen: Number(values.nitrogen),
      phosphorus: Number(values.phosphorus),
      potassium: Number(values.potassium),
      ph: Number(values.ph),
      latitude: submitCoordinates.latitude,
      longitude: submitCoordinates.longitude,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="soil-form__grid">
        <FormField
          label="Location"
          icon={<LocationIcon />}
          name="location"
          value={values.location}
          onChange={handleChange}
          placeholder="e.g. 27.7172, 85.3240"
          error={errors.location}
        />
        <FormField
          label="Nitrogen (N)"
          icon="N"
          type="number"
          name="nitrogen"
          value={values.nitrogen}
          onChange={handleChange}
          placeholder="e.g. 90"
          error={errors.nitrogen}
          inputMode="decimal"
        />
        <FormField
          label="Phosphorus (P)"
          icon="P"
          type="number"
          name="phosphorus"
          value={values.phosphorus}
          onChange={handleChange}
          placeholder="e.g. 42"
          error={errors.phosphorus}
          inputMode="decimal"
        />
        <FormField
          label="Potassium (K)"
          icon="K"
          type="number"
          name="potassium"
          value={values.potassium}
          onChange={handleChange}
          placeholder="e.g. 43"
          error={errors.potassium}
          inputMode="decimal"
        />
        <FormField
          label="Soil pH"
          icon="pH"
          type="number"
          name="ph"
          value={values.ph}
          onChange={handleChange}
          placeholder="0 - 14"
          error={errors.ph}
          inputMode="decimal"
          min="0"
          max="14"
          step="0.1"
        />
      </div>

      <button
        type="button"
        className="btn-primary btn-primary--ghost"
        disabled={loading || detectingLocation}
        onClick={handleDetectLocation}
        style={{ marginTop: 14 }}
      >
        {detectingLocation ? 'Detecting...' : 'Detect my location'}
      </button>

      {coordinates && (
        <p className="soil-form__detected">
          Detected location: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 14 }}>
        {loading ? 'Predicting...' : 'Predict crop'}
      </button>
    </form>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function parseCoordinates(value) {
  const parts = String(value)
    .split(',')
    .map((part) => Number(part.trim()));

  if (parts.length !== 2 || parts.some(Number.isNaN)) return null;

  const [latitude, longitude] = parts;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;

  return { latitude, longitude };
}
