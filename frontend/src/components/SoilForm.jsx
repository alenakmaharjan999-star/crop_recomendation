// import { useState } from 'react';
// import FormField from './FormField';
// import { SOIL_RANGES, validateSoilValue } from '../constants/soilRanges';
// import { VALID_LOCATIONS, normalizeLocation, validateLocation } from '../constants/locations';
// import './Forms.css';

// const initialValues = {
//   location: '',
//   nitrogen: '',
//   phosphorus: '',
//   potassium: '',
//   ph: '',
// };

// export default function SoilForm({ onSubmit, loading, predictedCrop }) {
//   const [values, setValues] = useState(initialValues);
//   const [errors, setErrors] = useState({});

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   }

//   function validate() {
//     const errs = {};

//     Object.keys(SOIL_RANGES).forEach((field) => {
//       const message = validateSoilValue(field, values[field]);
//       if (message) errs[field] = message;
//     });

//     const locationError = validateLocation(values.location);
//     if (locationError) errs.location = locationError;

//     return errs;
//   }

//   function handleSubmit(e) {
//     e.preventDefault();

//     const errs = validate();

//     if (Object.keys(errs).length > 0) {
//       setErrors(errs);
//       return;
//     }

//     onSubmit({
//       nitrogen: Number(values.nitrogen),
//       phosphorus: Number(values.phosphorus),
//       potassium: Number(values.potassium),
//       ph: Number(values.ph),
//       location: normalizeLocation(values.location),
//     });
//   }

//   return (
//     <form onSubmit={handleSubmit} noValidate>
//       <div className="grid gap-x-4 gap-y-0 md:grid-cols-2">
//         <div>
//           <FormField
//             label="Location"
//             icon={<LocationIcon />}
//             name="location"
//             value={values.location}
//             onChange={handleChange}
//             placeholder="e.g. Kathmandu, Pokhara"
//             error={errors.location}
//             options={VALID_LOCATIONS}
//             autoComplete="off"
//           />
//           <p className="mt-[-10px] mb-[18px] text-[0.78rem] text-slate-500">
//             Choose a district or city from the suggestion list.
//           </p>
//         </div>
//         <FormField
//           label="Nitrogen (N)"
//           icon="N"
//           type="number"
//           name="nitrogen"
//           value={values.nitrogen}
//           onChange={handleChange}
//           placeholder={`${SOIL_RANGES.nitrogen.min} - ${SOIL_RANGES.nitrogen.max}`}
//           error={errors.nitrogen}
//           inputMode="decimal"
//           min={SOIL_RANGES.nitrogen.min}
//           max={SOIL_RANGES.nitrogen.max}
//           step={SOIL_RANGES.nitrogen.step}
//         />

//         <FormField
//           label="Phosphorus (P)"
//           icon="P"
//           type="number"
//           name="phosphorus"
//           value={values.phosphorus}
//           onChange={handleChange}
//           placeholder={`${SOIL_RANGES.phosphorus.min} - ${SOIL_RANGES.phosphorus.max}`}
//           error={errors.phosphorus}
//           inputMode="decimal"
//           min={SOIL_RANGES.phosphorus.min}
//           max={SOIL_RANGES.phosphorus.max}
//           step={SOIL_RANGES.phosphorus.step}
//         />

//         <FormField
//           label="Potassium (K)"
//           icon="K"
//           type="number"
//           name="potassium"
//           value={values.potassium}
//           onChange={handleChange}
//           placeholder={`${SOIL_RANGES.potassium.min} - ${SOIL_RANGES.potassium.max}`}
//           error={errors.potassium}
//           inputMode="decimal"
//           min={SOIL_RANGES.potassium.min}
//           max={SOIL_RANGES.potassium.max}
//           step={SOIL_RANGES.potassium.step}
//         />

//         <FormField
//           label="Soil pH"
//           icon="pH"
//           type="number"
//           name="ph"
//           value={values.ph}
//           onChange={handleChange}
//           placeholder={`${SOIL_RANGES.ph.min} - ${SOIL_RANGES.ph.max}`}
//           error={errors.ph}
//           inputMode="decimal"
//           min={SOIL_RANGES.ph.min}
//           max={SOIL_RANGES.ph.max}
//           step={SOIL_RANGES.ph.step}
//         />
//       </div>

//       <button
//         type="submit"
//         className="btn-primary"
//         disabled={loading}
//         style={{
//           marginTop: 14,
//           width: '100%',
//           padding: '0.9rem 1.2rem',
//           fontWeight: 700,
//           boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
//         }}
//       >
//         {loading ? 'Predicting...' : 'Predict crop'}
//       </button>

//       <div className="mt-3">
//         <FormField
//           label="Predicted crop"
//           name="predictedCrop"
//           value={predictedCrop ?? ''}
//           onChange={() => {}}
//           placeholder="Your prediction will appear here"
//           disabled
//           readOnly
//         />
//       </div>
//     </form>
//   );
// }

// function LocationIcon() {
//   return (
//     <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
//       <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
//       <circle cx="12" cy="9" r="2.5" />
//     </svg>
//   );
// }

// src/components/SoilForm.jsx
import { useState } from 'react';
import FormField from './FormField';
import { SOIL_RANGES, validateSoilValue } from '../constants/soilRanges';
import './Forms.css';

const initialValues = {
  location: '',
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  ph: '',
};

export default function SoilForm({ onSubmit, loading, predictedCrop }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};

    // ✅ LOCATION - Only check if not empty (TRUST user input)
    if (!values.location || !values.location.trim()) {
      errs.location = 'Location is required';
    }
    // ⚠️ NO validation against location list - trust user!

    // ✅ NITROGEN, PHOSPHORUS, POTASSIUM, pH - Validate ranges
    Object.keys(SOIL_RANGES).forEach((field) => {
      const message = validateSoilValue(field, values[field]);
      if (message) errs[field] = message;
    });

    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // ✅ Send location as user typed it (TRUST the user)
    onSubmit({
      nitrogen: Number(values.nitrogen),
      phosphorus: Number(values.phosphorus),
      potassium: Number(values.potassium),
      ph: Number(values.ph),
      location: values.location.trim(), // 👈 TRUST user input, send as-is
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-x-4 gap-y-0 md:grid-cols-2">
        {/* LOCATION - Text input (No dropdown) */}
        <div>
          <FormField
            label="Location"
            icon={<LocationIcon />}
            name="location"
            value={values.location}
            onChange={handleChange}
            placeholder="Enter your district or city (e.g., Dhangadi, Kathmandu)"
            error={errors.location}
            autoComplete="off"
          />
          <p className="mt-[-10px] mb-[18px] text-[0.78rem] text-slate-500">
            Enter any district or city in Nepal (backend will validate)
          </p>
        </div>

        {/* NITROGEN */}
        <FormField
          label="Nitrogen (N)"
          icon="N"
          type="number"
          name="nitrogen"
          value={values.nitrogen}
          onChange={handleChange}
          placeholder={`${SOIL_RANGES.nitrogen.min} - ${SOIL_RANGES.nitrogen.max}`}
          error={errors.nitrogen}
          inputMode="decimal"
          min={SOIL_RANGES.nitrogen.min}
          max={SOIL_RANGES.nitrogen.max}
          step={SOIL_RANGES.nitrogen.step}
        />

        {/* PHOSPHORUS */}
        <FormField
          label="Phosphorus (P)"
          icon="P"
          type="number"
          name="phosphorus"
          value={values.phosphorus}
          onChange={handleChange}
          placeholder={`${SOIL_RANGES.phosphorus.min} - ${SOIL_RANGES.phosphorus.max}`}
          error={errors.phosphorus}
          inputMode="decimal"
          min={SOIL_RANGES.phosphorus.min}
          max={SOIL_RANGES.phosphorus.max}
          step={SOIL_RANGES.phosphorus.step}
        />

        {/* POTASSIUM */}
        <FormField
          label="Potassium (K)"
          icon="K"
          type="number"
          name="potassium"
          value={values.potassium}
          onChange={handleChange}
          placeholder={`${SOIL_RANGES.potassium.min} - ${SOIL_RANGES.potassium.max}`}
          error={errors.potassium}
          inputMode="decimal"
          min={SOIL_RANGES.potassium.min}
          max={SOIL_RANGES.potassium.max}
          step={SOIL_RANGES.potassium.step}
        />

        {/* pH */}
        <FormField
          label="Soil pH"
          icon="pH"
          type="number"
          name="ph"
          value={values.ph}
          onChange={handleChange}
          placeholder={`${SOIL_RANGES.ph.min} - ${SOIL_RANGES.ph.max}`}
          error={errors.ph}
          inputMode="decimal"
          min={SOIL_RANGES.ph.min}
          max={SOIL_RANGES.ph.max}
          step={SOIL_RANGES.ph.step}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{
          marginTop: 14,
          width: '100%',
          padding: '0.9rem 1.2rem',
          fontWeight: 700,
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
        }}
      >
        {loading ? 'Predicting...' : 'Predict crop'}
      </button>

      <div className="mt-3">
        <FormField
          label="Predicted crop"
          name="predictedCrop"
          value={predictedCrop ?? ''}
          onChange={() => {}}
          placeholder="Your prediction will appear here"
          disabled
          readOnly
        />
      </div>
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