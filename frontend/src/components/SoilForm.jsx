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

    ['nitrogen', 'phosphorus', 'potassium', 'ph'].forEach((field) => {
      const value = values[field];

      if (value === '') {
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
        className="mt-3.5 w-full rounded-[10px] bg-gradient-to-b from-[#55A89B] to-[#2F8C7F] px-4 py-3 text-[0.92rem] font-semibold text-white shadow-[0_2px_6px_rgba(47,140,127,0.2)] transition duration-150 ease-out hover:brightness-[0.96] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Predicting…' : 'Predict crop'}
      </button>
    </form>
  );
}