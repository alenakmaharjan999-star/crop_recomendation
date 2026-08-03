import { useState } from 'react';
import FormField from './FormField';

const initialValues = {
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  location: '',
  ph: '',
};

export default function SoilForm({ onSubmit, loading, prefill }) {
  const [values, setValues] = useState({ ...initialValues, ...prefill });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }

  function validate() {
    const errs = {};

    // Numeric fields
    ['nitrogen', 'phosphorus', 'potassium', 'ph'].forEach((field) => {
      const value = values[field];

      if (value === '') {
        errs[field] = 'Required';
      } else if (Number.isNaN(Number(value))) {
        errs[field] = 'Must be a number';
      }
    });

    // Location validation
    if (!values.location.trim()) {
      errs.location = 'Required';
    }

    // pH range validation
    if (
      values.ph !== '' &&
      (Number(values.ph) < 0 || Number(values.ph) > 14)
    ) {
      errs.ph = 'pH must be between 0 and 14';
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
      ph: Number(values.ph),
      location: values.location.trim(),
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
          label="Location"
          name="location"
          value={values.location}
          onChange={handleChange}
          placeholder="Enter your location"
          error={errors.location}
          inputMode="text"
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ marginTop: 14 }}
      >
        {loading ? 'Predicting…' : 'Predict crop'}
      </button>
    </form>
  );
}