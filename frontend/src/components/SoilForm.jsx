import { useState } from 'react';
import FormField from './FormField';

const initialValues = {
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  temperature: '',
  humidity: '',
  ph: '',
  rainfall: '',
};

export default function SoilForm({ onSubmit, loading, prefill }) {
  const [values, setValues] = useState({ ...initialValues, ...prefill });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    Object.entries(values).forEach(([key, val]) => {
      if (val === '' || val === null) {
        errs[key] = 'Required';
      } else if (Number.isNaN(Number(val))) {
        errs[key] = 'Must be a number';
      }
    });
    if (values.ph !== '' && (Number(values.ph) < 0 || Number(values.ph) > 14)) {
      errs.ph = 'pH must be between 0 and 14';
    }
    if (values.humidity !== '' && (Number(values.humidity) < 0 || Number(values.humidity) > 100)) {
      errs.humidity = 'Humidity must be 0-100%';
    }
    return errs;
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
      temperature: Number(values.temperature),
      humidity: Number(values.humidity),
      ph: Number(values.ph),
      rainfall: Number(values.rainfall),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="soil-form__grid">
        <FormField
          label="Nitrogen (N)"
          name="nitrogen"
          value={values.nitrogen}
          onChange={handleChange}
          placeholder="e.g. 90"
          error={errors.nitrogen}
          inputMode="decimal"
        />
        <FormField
          label="Phosphorus (P)"
          name="phosphorus"
          value={values.phosphorus}
          onChange={handleChange}
          placeholder="e.g. 42"
          error={errors.phosphorus}
          inputMode="decimal"
        />
        <FormField
          label="Potassium (K)"
          name="potassium"
          value={values.potassium}
          onChange={handleChange}
          placeholder="e.g. 43"
          error={errors.potassium}
          inputMode="decimal"
        />
        <FormField
          label="Soil pH"
          name="ph"
          value={values.ph}
          onChange={handleChange}
          placeholder="0 – 14"
          error={errors.ph}
          inputMode="decimal"
        />
        <FormField
          label="Temperature (°C)"
          name="temperature"
          value={values.temperature}
          onChange={handleChange}
          placeholder="Auto-filled from weather"
          error={errors.temperature}
          inputMode="decimal"
        />
        <FormField
          label="Humidity (%)"
          name="humidity"
          value={values.humidity}
          onChange={handleChange}
          placeholder="Auto-filled from weather"
          error={errors.humidity}
          inputMode="decimal"
        />
        <FormField
          label="Rainfall (mm)"
          name="rainfall"
          value={values.rainfall}
          onChange={handleChange}
          placeholder="e.g. 202"
          error={errors.rainfall}
          inputMode="decimal"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 14 }}>
        {loading ? 'Predicting…' : 'Predict crop'}
      </button>
    </form>
  );
}