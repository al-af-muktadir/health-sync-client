"use client";
/* Importing required dependencies for React, motion, and state management */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/api/Context/UserContext";

// Defining the list of unique symptoms extracted from the dataset
const symptomList = [
  "itching",
  "skin_rash",
  "nodal_skin_eruptions",
  "dischromic _patches",
  "continuous_sneezing",
  "shivering",
  "chills",
  "watering_from_eyes",
  "stomach_pain",
  "acidity",
  "ulcers_on_tongue",
  "vomiting",
  "cough",
  "chest_pain",
  "yellowish_skin",
  "nausea",
  "loss_of_appetite",
  "abdominal_pain",
  "yellowing_of_eyes",
  "burning_micturition",
  "spotting_ urination",
  "indigestion",
  "passage_of_gases",
  "internal_itching",
  "muscle_wasting",
  "patches_in_throat",
  "high_fever",
  "extra_marital_contacts",
  "fatigue",
  "weight_loss",
  "restlessness",
  "lethargy",
  "irregular_sugar_level",
  "blurred_and_distorted_vision",
  "obesity",
  "excessive_hunger",
  "increased_appetite",
  "polyuria",
  "sunken_eyes",
  "dehydration",
  "diarrhoea",
  "breathlessness",
  "family_history",
  "mucoid_sputum",
  "headache",
  "dizziness",
  "loss_of_balance",
  "lack_of_concentration",
  "stiff_neck",
  "depression",
  "irritability",
  "visual_disturbances",
  "back_pain",
  "weakness_in_limbs",
  "neck_pain",
  "weakness_of_one_body_side",
  "altered_sensorium",
  "dark_urine",
  "sweating",
  "muscle_pain",
  "mild_fever",
  "swelled_lymph_nodes",
  "malaise",
  "red_spots_over_body",
  "joint_pain",
  "pain_behind_the_eyes",
  "constipation",
  "toxic_look_(typhos)",
  "belly_pain",
  "yellow_urine",
  "receiving_blood_transfusion",
  "receiving_unsterile_injections",
  "acute_liver_failure",
  "coma",
  "stomach_bleeding",
  "swelling_of_stomach",
  "distention_of_abdomen",
  "history_of_alcohol_consumption",
  "fluid_overload",
  "phlegm",
  "blood_in_sputum",
  "throat_irritation",
  "redness_of_eyes",
  "sinus_pressure",
  "runny_nose",
  "congestion",
  "loss_of_smell",
  "fast_heart_rate",
  "rusty_sputum",
  "pain_during_bowel_movements",
  "pain_in_anal_region",
  "bloody_stool",
  "irritation_in_anus",
  "cramps",
  "bruising",
  "swollen_legs",
  "swollen_blood_vessels",
  "prominent_veins_on_calf",
  "weight_gain",
  "cold_hands_and_feets",
  "mood_swings",
  "puffy_face_and_eyes",
  "enlarged_thyroid",
  "brittle_nails",
  "swollen_extremeties",
  "abnormal_menstruation",
  "anxiety",
  "drying_and_tingling_lips",
  "slurred_speech",
  "palpitations",
  "knee_pain",
  "hip_joint_pain",
  "swelling_joints",
  "painful_walking",
  "movement_stiffness",
  "spinning_movements",
  "unsteadiness",
  "pus_filled_pimples",
  "blackheads",
  "scurring",
  "bladder_discomfort",
  "foul_smell_of urine",
  "continuous_feel_of_urine",
  "skin_peeling",
  "silver_like_dusting",
  "small_dents_in_nails",
  "inflammatory_nails",
  "blister",
  "red_sore_around_nose",
  "yellow_crust_ooze",
];

const Prediction = () => {
  const { user } = useUser();
  // Managing state for input, symptoms list, prediction result, and loading status
  const [inputSymptom, setInputSymptom] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handling adding a symptom to the list
  const handleAddSymptom = () => {
    const trimmed = inputSymptom.trim();
    if (
      trimmed &&
      !symptoms.includes(trimmed) &&
      symptomList.includes(trimmed)
    ) {
      setSymptoms([...symptoms, trimmed]);
    }
    setInputSymptom("");
  };

  // Handling removing a symptom from the list
  const handleRemoveSymptom = (symptom) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  // Handling form submission to predict disease
  const handleSubmit = async () => {
    if (symptoms.length === 0) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });

      const data = await res.json();
      console.log("Prediction Result:", data);
      setResult(data);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handling Suggest Doctor button click
  const handleSuggestDoctor = (disease) => {
    window.location.href = `http://localhost:3000/predict-disease/predictdiseasebydoctor?prediction=${encodeURIComponent(
      disease
    )}`;
  };

  // Filtering symptoms for autocomplete based on user input
  const filteredSymptoms = symptomList.filter((symptom) =>
    symptom.toLowerCase().includes(inputSymptom.toLowerCase())
  );

  // Animation variants for staggered symptom tags
  const symptomVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  // Animation variants for buttons
  const buttonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  // Animation variants for the result section
  const resultVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    // Rendering the main container to fit the viewport without scrolling
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full flex flex-col gap-6"
      >
        {/* Title Section */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-extrabold text-center text-violet-400"
        >
          🧬 Disease Predictor
        </motion.h1>

        {/* Symptom Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-violet-400 mb-3">
            Enter Your Symptoms
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type a symptom (e.g., fever, rash)"
              value={inputSymptom}
              onChange={(e) => setInputSymptom(e.target.value)}
              list="symptoms-list"
              className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:outline-none focus:border-violet-500"
            />
            <datalist id="symptoms-list">
              {filteredSymptoms.map((symptom) => (
                <option key={symptom} value={symptom} />
              ))}
            </datalist>
            <motion.button
              onClick={handleAddSymptom}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg"
            >
              Add
            </motion.button>
          </div>
        </motion.section>

        {/* Selected Symptoms Section */}
        <AnimatePresence>
          {symptoms.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-violet-400 mb-3">
                Selected Symptoms
              </h2>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {symptoms.map((symptom, index) => (
                  <motion.span
                    key={symptom}
                    custom={index}
                    variants={symptomVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-zinc-800 text-sm px-3 py-1 rounded-full border border-violet-500 flex items-center gap-2"
                  >
                    {symptom}
                    <button
                      onClick={() => handleRemoveSymptom(symptom)}
                      className="text-red-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Predict Button Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={handleSubmit}
            disabled={loading || symptoms.length === 0}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Predicting..." : "🔮 Predict Disease"}
          </motion.button>
        </motion.section>

        {/* Prediction Result Section */}
        <AnimatePresence>
          {result && (
            <motion.section
              variants={resultVariants}
              initial="hidden"
              animate="visible"
              className="bg-zinc-900 rounded-xl border border-violet-500 p-6"
            >
              <h2 className="text-xl font-bold text-violet-400 mb-3">
                🩺 Prediction Result
              </h2>
              <div className="space-y-3">
                <p>
                  <strong className="text-fuchsia-400">Disease:</strong>{" "}
                  {result?.disease}
                </p>
                <p className="line-clamp-2">
                  <strong className="text-fuchsia-400">Description:</strong>{" "}
                  {result?.description}
                </p>
                <div>
                  <strong className="text-fuchsia-400">Precautions:</strong>
                  <ul className="list-disc list-inside mt-1 text-sm text-zinc-300 max-h-20 overflow-y-auto">
                    {result?.precautions?.map((p, index) => (
                      <li key={index}>{p}</li>
                    ))}
                  </ul>
                </div>
                {user?.role === "PATIENT" ||
                  (user?.role === "ADMIN" && (
                    <motion.button
                      onClick={() => handleSuggestDoctor(result?.disease)}
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      className="bg-violet-600 text-white px-4 py-2 rounded-lg mt-3"
                    >
                      Suggest Doctor
                    </motion.button>
                  ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Prediction;
