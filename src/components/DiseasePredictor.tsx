// // File: src/components/DiseasePredictor.tsx

// import React, { useState } from 'react';
// import axios from 'axios';

// interface Doctor {
//   id: string;
//   name: string;
//   email: string;
//   contactNumber: string;
//   designation: string;
//   profilePhoto?: string | null;
// }

// interface PredictionResponse {
//   disease: string;
//   description: string;
//   precautions: string[];
//   doctors: Doctor[];
// }

// const DiseasePredictor: React.FC = () => {
//   const [symptomsInput, setSymptomsInput] = useState('');
//   const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setPrediction(null);

//     // Convert comma-separated symptoms string into array
//     const symptoms = symptomsInput
//       .split(',')
//       .map((s) => s.trim())
//       .filter(Boolean);

//     if (symptoms.length === 0) {
//       setError('Please enter at least one symptom.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post<PredictionResponse>('/api/predict', { symptoms });
//       setPrediction(response.data);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to get prediction');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
//       <h2>Disease Predictor</h2>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="symptoms">Enter symptoms (comma separated):</label>
//         <input
//           id="symptoms"
//           type="text"
//           value={symptomsInput}
//           onChange={(e) => setSymptomsInput(e.target.value)}
//           placeholder="e.g. fever, cough, headache"
//           style={{ width: '100%', padding: 8, marginTop: 8, marginBottom: 12 }}
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Predicting...' : 'Predict Disease'}
//         </button>
//       </form>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {prediction && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Prediction Result</h3>
//           <p><strong>Disease:</strong> {prediction.disease}</p>
//           <p><strong>Description:</strong> {prediction.description}</p>
//           <p><strong>Precautions:</strong></p>
//           <ul>
//             {prediction.precautions.map((precaution, idx) => (
//               <li key={idx}>{precaution}</li>
//             ))}
//           </ul>

//           <h4>Recommended Doctors</h4>
//           {prediction.doctors.length === 0 && <p>No doctors found for this disease.</p>}
//           <ul>
//             {prediction.doctors.map((doc) => (
//               <li key={doc.id} style={{ marginBottom: 12 }}>
//                 <strong>{doc.name}</strong> ({doc.designation})<br />
//                 Email: {doc.email}<br />
//                 Contact: {doc.contactNumber}<br />
//                 {doc.profilePhoto && (
//                   <img
//                     src={doc.profilePhoto}
//                     alt={`${doc.name}'s profile`}
//                     style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 40, marginTop: 6 }}
//                   />
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiseasePredictor;
