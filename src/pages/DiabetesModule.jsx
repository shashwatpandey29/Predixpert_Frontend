import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaHeartbeat, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const featureOptions = [
  "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
  "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
];

const modelOptions = ["LogisticRegression", "RandomForest", "SVM"];

const DiabetesModule = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedModel, setSelectedModel] = useState(modelOptions[0]);
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFeatureChange = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleInputChange = (feature, value) => {
    setInputValues({ ...inputValues, [feature]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const orderedInputValues = selectedFeatures.map(f => parseFloat(inputValues[f] || 0));

    const requestData = {
      features: selectedFeatures,
      model_type: selectedModel,
      input_values: orderedInputValues
    };

    try {
      const response = await axios.post('/api/predict/diabetes', requestData);
      setResult(response.data);
      toast.success('Prediction completed!');
    } catch (err) {
      const msg = err.response?.data?.detail || "An error occurred.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 text-gray-800 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-600 flex items-center justify-center gap-2">
            <FaHeartbeat className="text-rose-500" /> Diabetes Prediction Module
          </h1>
          <p className="mt-2 text-gray-600">
            Select features, choose a model, and enter patient data to predict the likelihood of diabetes.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feature Selection */}
          <div className="rounded-2xl shadow-lg p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-red-100">
            <h2 className="text-lg font-semibold mb-4">1️⃣ Select Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {featureOptions.map(f => (
                <label key={f} className="flex items-center gap-2" title={`Enter value for ${f}`}>
                  <input
                    type="checkbox"
                    className="accent-pink-600"
                    checked={selectedFeatures.includes(f)}
                    onChange={() => handleFeatureChange(f)}
                  />
                  {f}
                </label>
              ))}
            </div>
            {selectedFeatures.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 italic">
                Please select at least one feature.
              </p>
            )}
          </div>

          {/* Model Selection */}
          <div className="rounded-2xl shadow-lg p-6 bg-gradient-to-r from-green-100 via-teal-100 to-blue-100">
            <h2 className="text-lg font-semibold mb-4">2️⃣ Select Model</h2>
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {modelOptions.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Input Values */}
          {selectedFeatures.length > 0 && (
            <div className="rounded-2xl shadow-lg p-6 bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100">
              <h2 className="text-lg font-semibold mb-4">3️⃣ Enter Test Values</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedFeatures.map(f => (
                  <div key={f}>
                    <label className="block mb-1 font-medium">{f}</label>
                    <input
                      type="number"
                      step="any"
                      placeholder={`Enter ${f}`}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      onChange={(e) => handleInputChange(f, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || selectedFeatures.length === 0}
            className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Running...
              </>
            ) : (
              '🔮 Run Prediction'
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="text-red-600 bg-red-100 border border-red-200 rounded-lg p-4 mt-4">
            ❌ {error}
          </div>
        )}

        {/* Prediction Result */}
        {result && (
          <div className="rounded-2xl shadow-xl p-6 bg-gradient-to-r from-green-100 via-lime-100 to-emerald-100 mt-6">
            <h2 className="text-xl font-semibold mb-2">📊 Prediction Result</h2>
            <div className="text-lg flex items-center gap-2">
              {result.prediction === "Positive" ? (
                <FaTimesCircle className="text-red-500" />
              ) : (
                <FaCheckCircle className="text-green-600" />
              )}
              <strong>Outcome:</strong> {result.prediction === "Positive" ? "Diabetic" : "Non-Diabetic"}
            </div>
            <p className="mt-2 text-gray-800">
              <strong>Model Accuracy:</strong> {(result.accuracy * 100).toFixed(2)}%
            </p>
            {result.probability !== undefined && (
              <p className="text-sm text-gray-700 mt-1">
                <strong>Confidence:</strong> {(result.probability * 100).toFixed(1)}%
              </p>
            )}

            <a href={`/api/download_model/${result.download_filename}`} download>
              <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                ⬇️ Download Trained Model
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiabetesModule;
