"use client";

import Navbar from "@/components/Basics/Navbar";
import Footer from "@/components/Basics/Footer";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import * as tf from "@tensorflow/tfjs"; // Import TensorFlow.js

const Dashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [mlbClasses, setMlbClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);

  // Load the model and MLB classes on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Attempting to load model from /models/model.json...");
        const response = await fetch("/models/model(1).json");
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const loadedModel = await tf.loadLayersModel("/models/model(1).json");
        console.log("Model loaded successfully:", loadedModel);
        setModel(loadedModel);

        // Replace with your actual MLB classes from training data
        const simulatedMlbClasses = [" abdominal_pain", " abnormal_menstruation", " acidity", " acute_liver_failure", " altered_sensorium", " anxiety", " back_pain", " belly_pain", " blackheads", " bladder_discomfort", " blister", " blood_in_sputum", " bloody_stool", " blurred_and_distorted_vision", " breathlessness", " brittle_nails", " bruising", " burning_micturition", " chest_pain", " chills", " cold_hands_and_feets", " coma", " congestion", " constipation", " continuous_feel_of_urine", " continuous_sneezing", " cough", " cramps", " dark_urine", " dehydration", " depression", " diarrhoea", " dischromic _patches", " distention_of_abdomen", " dizziness", " drying_and_tingling_lips", " enlarged_thyroid", " excessive_hunger", " extra_marital_contacts", " family_history", " fast_heart_rate", " fatigue", " fluid_overload", " foul_smell_of urine", " headache", " high_fever", " hip_joint_pain", " history_of_alcohol_consumption", " increased_appetite", " indigestion", " inflammatory_nails", " internal_itching", " irregular_sugar_level", " irritability", " irritation_in_anus", " joint_pain", " knee_pain", " lack_of_concentration", " lethargy", " loss_of_appetite", " loss_of_balance", " loss_of_smell", " malaise", " mild_fever", " mood_swings", " movement_stiffness", " mucoid_sputum", " muscle_pain", " muscle_wasting", " muscle_weakness", " nausea", " neck_pain", " nodal_skin_eruptions", " obesity", " pain_behind_the_eyes", " pain_during_bowel_movements", " pain_in_anal_region", " painful_walking", " palpitations", " passage_of_gases", " patches_in_throat", " phlegm", " polyuria", " prominent_veins_on_calf", " puffy_face_and_eyes", " pus_filled_pimples", " receiving_blood_transfusion", " receiving_unsterile_injections", " red_sore_around_nose", " red_spots_over_body", " redness_of_eyes", " restlessness", " runny_nose", " rusty_sputum", " scurring", " shivering", " silver_like_dusting", " sinus_pressure", " skin_peeling", " skin_rash", " slurred_speech", " small_dents_in_nails", " spinning_movements", " spotting_ urination", " stiff_neck", " stomach_bleeding", " stomach_pain", " sunken_eyes", " sweating", " swelled_lymph_nodes", " swelling_joints", " swelling_of_stomach", " swollen_blood_vessels", " swollen_extremeties", " swollen_legs", " throat_irritation", " toxic_look_(typhos)", " ulcers_on_tongue", " unsteadiness", " visual_disturbances", " vomiting", " watering_from_eyes", " weakness_in_limbs", " weakness_of_one_body_side", " weight_gain", " weight_loss", " yellow_crust_ooze", " yellow_urine", " yellowing_of_eyes", " yellowish_skin", "itching"];
        setMlbClasses(simulatedMlbClasses);
      } catch (error) {
        console.error("Model loading error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setModelLoadError(`Error loading model: ${errorMessage}`);
      }
    };
    loadModel();
  }, []);

  // Function to call Hugging Face LLM API
  const consultMedicalLLM = async (userInput: string, tfPrediction?: string) => {
    try {
      const systemPrompt = `You are a medical AI assistant. Provide helpful medical information based on symptoms described by users. Always remind users to consult healthcare professionals for proper diagnosis and treatment. Be empathetic and informative.`;
      
      let userPrompt = userInput;
      if (tfPrediction) {
        userPrompt = `User symptoms: ${userInput}\nTensorFlow model prediction: ${tfPrediction}\n\nBased on these symptoms and the model prediction, please provide medical guidance, possible conditions to consider, and recommendations.`;
      }

      const response = await fetch('/api/medical-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.message || "I apologize, but I couldn't process your request right now. Please try again.";
    } catch (error) {
      console.error("LLM API error:", error);
      return "I'm having trouble connecting to the medical consultation service. Please try again later or consult a healthcare professional directly.";
    }
  };

  const predictDisease = async (symptoms: string[]) => {
    if (!model || !mlbClasses.length) {
      return null; // Return null so we can still use LLM
    }

    try {
      const symptomVector = new Array(mlbClasses.length).fill(0);
      symptoms.forEach((symptom) => {
        const index = mlbClasses.indexOf(symptom.toLowerCase());
        if (index !== -1) symptomVector[index] = 1;
      });

      const inputTensor = tf.tensor3d([[symptomVector]], [1, 1, mlbClasses.length]);
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const predictionData = await prediction.data();
      const predictedIndex = Array.from(predictionData).indexOf(Math.max(...Array.from(predictionData)));
      const predictedDisease = mlbClasses[predictedIndex] || "Unknown condition";

      inputTensor.dispose();
      prediction.dispose();

      return `Model prediction: ${predictedDisease}`;
    } catch (error) {
      console.error("Prediction error:", error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);

    try {
      // Check if the message contains symptoms for ML prediction
      const symptoms = userMessage.toLowerCase().split(/[,\s]+/).map(s => s.trim()).filter(s => s.length > 0);
      let tfPrediction = null;

      // Try to get TensorFlow prediction if model is available
      if (model && mlbClasses.length > 0) {
        tfPrediction = await predictDisease(symptoms);
      }

      // Always consult the LLM for comprehensive response
      const llmResponse = await consultMedicalLLM(userMessage, tfPrediction || undefined);
      
      setChatMessages((prev) => [...prev, { role: "assistant", content: llmResponse }]);
    } catch (error) {
      console.error("Error processing message:", error);
      setChatMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I encountered an error processing your request. Please try again or consult a healthcare professional." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="min-h-[calc(100vh-463px)] my-14 container mx-auto px-5 lg:px-10">
        <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
        <p>This is the page after login. You can add more content here.</p>
        
        <div className="mt-4">
          <Button onClick={() => setIsChatOpen(true)}>AI Medical Assistant</Button>
        </div>
        
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent>
            <div className="flex flex-col max-w-2xl max-h-[80vh] overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">AI Medical Assistant</h2>
              
              {modelLoadError && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-2">
                  <p className="text-sm">Note: {modelLoadError}</p>
                  <p className="text-sm">The AI assistant will still work using the LLM model.</p>
                </div>
              )}
              
              <div className="flex-1 h-80 overflow-y-auto border rounded p-3 bg-white mb-4">
                {chatMessages.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    <p>👨‍⚕️ Hello! I'm your AI Medical Assistant.</p>
                    <p className="mt-2 text-sm">Describe your symptoms and I'll provide helpful medical information.</p>
                    <p className="mt-1 text-xs text-gray-400">Remember: Always consult healthcare professionals for proper diagnosis.</p>
                  </div>
                )}
                
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[80%] p-2 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="text-left mb-3">
                    <div className="inline-block bg-gray-100 text-gray-800 p-2 rounded-lg">
                      <p className="text-sm">🤔 Analyzing your symptoms...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms or ask a medical question..."
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !message.trim()}
                  className="px-6"
                >
                  {isLoading ? "..." : "Send"}
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                ⚠️ This is for informational purposes only. Always consult qualified healthcare professionals.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer /> 
    </div>
  );
};

export default Dashboard;