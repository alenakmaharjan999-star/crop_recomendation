// import { useState } from 'react';
// import AppLayout from '../components/AppLayout';
// import SoilForm from '../components/SoilForm';
// import RecommendationCard from '../components/RecommendationCard';
// import FertilizerRecommendationCard from '../components/FertilizerRecommendationCard';
// import ModelPerformancePanel from '../components/ModelPerformancePanel';
// import { submitSoilData } from '../api/apiClient';

// export default function Recommend() {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   async function handlePredict(values) {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await submitSoilData(values);
//       setResult(res.data);
//     } catch (err) {
//       const data = err.response?.data;
//       const fieldErrors = data?.errors ? Object.values(data.errors).flat() : [];
//       setError(fieldErrors[0] || data?.error || 'Prediction failed. Please try again.');
//       setResult(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <AppLayout>
//       <h1 className="mb-1.5 font-display text-[1.5rem] text-slate-900">Recommend a crop</h1>
//       <p className="mb-6 text-[0.9rem] text-slate-600">
//         Enter your soil's N, P, K and pH values along with current weather to get a recommendation.
//       </p>

//       <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] xl:items-start">
//         <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
//           <SoilForm onSubmit={handlePredict} loading={loading} />
//         </div>
//         <aside className="space-y-5" aria-live="polite">
//           <div>
//             <h2 className="mb-1 font-display text-[1.1rem] text-slate-900">Crop prediction</h2>
//             <p className="text-[0.84rem] text-slate-600">Your recommended crop based on the submitted soil and weather data.</p>
//             <RecommendationCard crop={result?.crop} confidence={result?.confidence} loading={loading} />
//             {error && (
//               <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//                 {error}
//               </p>
//             )}
//           </div>
//           <section className="rounded-[18px] border border-slate-200 bg-slate-50 p-5">
//             <h2 className="font-display text-[1.05rem] text-slate-900">Model performance</h2>
//             <p className="mt-1 text-[0.84rem] text-slate-600">Evaluation metrics returned by the crop prediction model.</p>
//             {result?.modelPerformance ? (
//               <div className="mt-4"><ModelPerformancePanel performance={result.modelPerformance} /></div>
//             ) : (
//               <p className="mt-4 text-sm text-slate-600">Model metrics will appear here after a successful crop prediction.</p>
//             )}
//           </section>
//           <FertilizerRecommendationCard fertilizer={result?.fertilizerRecommendation} />
//         </aside>
//       </div>
//     </AppLayout>
//   );
// }

// function LeafIcon() {
//   return (
//     <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
//       <path d="M20 4c-7.2.2-12 2.6-14.5 7.1-1.7 3-1.5 6.2.2 7.9 1.8 1.8 5 1.5 8-.2 4.4-2.5 6.4-7.4 6.3-14.8Z" />
//       <path d="M5 19c3.1-4.7 6.8-8 11.3-9.9" />
//     </svg>
//   );
// }


// src/pages/Recommend.jsx
// import { useState } from 'react';
// import AppLayout from '../components/AppLayout';
// import SoilForm from '../components/SoilForm';
// import RecommendationCard from '../components/RecommendationCard';
// import FertilizerRecommendationCard from '../components/FertilizerRecommendationCard';
// import ModelPerformancePanel from '../components/ModelPerformancePanel';
// import { submitSoilData } from '../api/apiClient';

// export default function Recommend() {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   async function handlePredict(values) {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await submitSoilData(values);
//       setResult(res.data);
//     } catch (err) {
//       const data = err.response?.data;
//       const fieldErrors = data?.errors ? Object.values(data.errors).flat() : [];
//       setError(fieldErrors[0] || data?.error || 'Prediction failed. Please try again.');
//       setResult(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <AppLayout>
//       <h1 className="mb-1.5 font-display text-[1.5rem] text-slate-900">Recommend a crop</h1>
//       <p className="mb-6 text-[0.9rem] text-slate-600">
//         Enter your soil's N, P, K and pH values along with your location to get a recommendation.
//       </p>

//       <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] xl:items-start">
//         <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
//           <SoilForm onSubmit={handlePredict} loading={loading} />
//         </div>
//         <aside className="space-y-5" aria-live="polite">
//           <div>
//             <h2 className="mb-1 font-display text-[1.1rem] text-slate-900">Crop prediction</h2>
//             <p className="text-[0.84rem] text-slate-600">Your recommended crop based on the submitted soil and weather data.</p>
//             <RecommendationCard crop={result?.crop} confidence={result?.confidence} loading={loading} />
//             {error && (
//               <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//                 {error}
//               </p>
//             )}
//           </div>
//           <section className="rounded-[18px] border border-slate-200 bg-slate-50 p-5">
//             <h2 className="font-display text-[1.05rem] text-slate-900">Model performance</h2>
//             <p className="mt-1 text-[0.84rem] text-slate-600">Evaluation metrics returned by the crop prediction model.</p>
//             {result?.modelPerformance ? (
//               <div className="mt-4"><ModelPerformancePanel performance={result.modelPerformance} /></div>
//             ) : (
//               <p className="mt-4 text-sm text-slate-600">Model metrics will appear here after a successful crop prediction.</p>
//             )}
//           </section>
//           <FertilizerRecommendationCard fertilizer={result?.fertilizerRecommendation} />
//         </aside>
//       </div>
//     </AppLayout>
//   );
// }

// src/pages/Recommend.jsx
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import SoilForm from '../components/SoilForm';
import RecommendationCard from '../components/RecommendationCard';
import FertilizerRecommendationCard from '../components/FertilizerRecommendationCard';
import ModelPerformancePanel from '../components/ModelPerformancePanel';
import { submitSoilData } from '../api/apiClient';

export default function Recommend() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePredict(values) {
    setLoading(true);
    setError('');
    try {
      const res = await submitSoilData(values);
      console.log('API Response:', res.data);
      
      // ✅ Store the full result
      setResult(res.data);
    } catch (err) {
      const data = err.response?.data;
      const fieldErrors = data?.errors ? Object.values(data.errors).flat() : [];
      setError(fieldErrors[0] || data?.error || 'Prediction failed. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Get the crop name from either property
  const cropName = result?.predictedCrop || result?.crop;

  return (
    <AppLayout>
      <h1 className="mb-1.5 font-display text-[1.5rem] text-slate-900">Recommend a crop</h1>
      <p className="mb-6 text-[0.9rem] text-slate-600">
        Enter your soil's N, P, K and pH values along with your location to get a recommendation.
      </p>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] xl:items-start">
        <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
          {/* ✅ Pass the crop name to SoilForm */}
          <SoilForm 
            onSubmit={handlePredict} 
            loading={loading} 
            predictedCrop={cropName} 
          />
        </div>
        
        <aside className="space-y-5" aria-live="polite">
          <div>
            <h2 className="mb-1 font-display text-[1.1rem] text-slate-900">Crop prediction</h2>
            <p className="text-[0.84rem] text-slate-600">Your recommended crop based on the submitted soil and weather data.</p>
            
            {/* ✅ Pass the crop name correctly */}
            <RecommendationCard 
              crop={cropName} 
              confidence={result?.confidence} 
              loading={loading} 
            />
            
            {error && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          
          {/* ✅ Model Performance - Pass as performance object */}
          <section className="rounded-[18px] border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-display text-[1.05rem] text-slate-900">Model performance</h2>
            <p className="mt-1 text-[0.84rem] text-slate-600">Evaluation metrics returned by the crop prediction model.</p>
            
            {result?.accuracy !== undefined && result?.accuracy !== null ? (
              <div className="mt-4">
                <ModelPerformancePanel 
                  performance={{
                    accuracy: result.accuracy,
                    precision: result.precision,
                    recall: result.recall,
                    f1Score: result.f1Score,
                    confusionMatrix: result.confusionMatrix
                  }} 
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">Model metrics will appear here after a successful crop prediction.</p>
            )}
          </section>

          {/* ✅ Pass fertilizer data correctly */}
          <FertilizerRecommendationCard fertilizer={result?.fertilizerRecommendation} />
        </aside>
      </div>
    </AppLayout>
  );
}