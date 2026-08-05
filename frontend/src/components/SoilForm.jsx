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

export default function SoilForm({ onSubmit, loading }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [detectingLocation, setDetectingLocation] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};

    ['nitrogen', 'phosphorus', 'potassium', 'ph'].forEach((field) => {
      const value = values[field];
      const isEmpty = String(value).trim() === '';

      if (isEmpty) {
        errs[field] = 'Required';
      } else if (Number.isNaN(Number(value))) {
        errs[field] = 'Must be a number';
      }
    });

    if (!values.location.trim()) {
      errs.location = 'Required';
    }

    if (values.ph !== '' && (Number(values.ph) < 0 || Number(values.ph) > 14)) {
      errs.ph = 'pH must be between 0 and 14';
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
        setValues((prev) => ({
          ...prev,
          location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        }));
        setDetectingLocation(false);
      },
      () => {
        setDetectingLocation(false);
        setErrors((prev) => ({
          ...prev,
          location: 'Could not detect location.',
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

    onSubmit({
      nitrogen: Number(values.nitrogen),
      phosphorus: Number(values.phosphorus),
      potassium: Number(values.potassium),
      ph: Number(values.ph),
      location: values.location.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-x-4 gap-y-0 md:grid-cols-2">
        <div>
          <FormField
            label="Location"
            icon={<LocationIcon />}
            name="location"
            value={values.location}
            onChange={handleChange}
            placeholder="e.g. Kathmandu, Pokhara"
            error={errors.location}
          />
          <p className="mt-[-10px] mb-[18px] text-[0.78rem] text-slate-500">
            Enter a real place name or city instead of latitude and longitude.
          </p>
        </div>
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
        onClick={handleDetectLocation}
        className="mt-3.5 w-full rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-4 py-3 text-[0.92rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
        {detectingLocation ? 'Detecting...' : 'Detect my location'}
      </button>

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
