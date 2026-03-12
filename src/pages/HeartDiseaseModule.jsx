import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaHeartBroken, FaFlask, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const modelOptions = ["LogisticRegression", "RandomForestClassifier", "SVC"];

const featureFields = [
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'sex', label: 'Sex (1=Male; 0=Female)', type: 'number' },
    { name: 'cp', label: 'Chest Pain Type (0-3)', type: 'number' },
    { name: 'trestbps', label: 'Resting Blood Pressure', type: 'number' },
    { name: 'chol', label: 'Serum Cholestoral (mg/dl)', type: 'number' },
    { name: 'fbs', label: 'Fasting Blood Sugar > 120 mg/dl (1=True; 0=False)', type: 'number' },
    { name: 'restecg', label: 'Resting ECG Results (0-2)', type: 'number' },
    { name: 'thalach', label: 'Maximum Heart Rate Achieved', type: 'number' },
    { name: 'exang', label: 'Exercise Induced Angina (1=Yes; 0=No)', type: 'number' },
    { name: 'oldpeak', label: 'ST Depression Induced by Exercise', type: 'number', step: '0.1' },
    { name: 'slope', label: 'Slope of Peak Exercise ST Segment (0-2)', type: 'number' },
    { name: 'ca', label: 'Major Vessels Colored by Flourosopy (0-4)', type: 'number' },
    { name: 'thal', label: 'Thal (0-2)', type: 'number' }
];

const HeartDiseaseModule = () => {
    const [inputValues, setInputValues] = useState({});
    const [selectedModel, setSelectedModel] = useState(modelOptions[0]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (name, value) => {
        setInputValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        const orderedInputValues = featureFields.map(field => parseFloat(inputValues[field.name] || 0));

        const requestData = {
            model_name: selectedModel,
            input_data: orderedInputValues
        };

        try {
            const response = await axios.post('/api/predict/heart_disease', requestData);
            setResult(response.data);
            toast.success('Prediction complete!');
        } catch (err) {
            const msg = err.response?.data?.detail || "An error occurred.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-4 py-10 bg-gray-50 text-gray-800 font-sans">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 flex items-center justify-center gap-3">
                        <FaHeartBroken /> Heart Disease Prediction
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl shadow-lg p-6 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">1️⃣ Enter Patient Data</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {featureFields.map(field => (
                                <div key={field.name}>
                                    <label className="block mb-1 text-sm font-medium">{field.label}</label>
                                    <input
                                        type={field.type}
                                        step={field.step || '1'}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl shadow-lg p-6 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">2️⃣ Select Model</h2>
                        <select
                            value={selectedModel}
                            onChange={e => setSelectedModel(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                            {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-lg font-semibold"
                    >
                        {loading ? 'Running Prediction...' : 'Predict'}
                    </button>
                </form>

                {result && (
                    <div className="rounded-2xl shadow-xl p-6 mt-6 bg-white border">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaFlask /> Prediction Result</h2>
                        <div className={`text-2xl font-bold flex items-center gap-2 ${result.prediction.includes('Detected') ? 'text-red-500' : 'text-green-600'}`}>
                            {result.prediction.includes('Detected') ? <FaTimesCircle /> : <FaCheckCircle />}
                            <span>{result.prediction}</span>
                        </div>
                        <p className="mt-2 text-gray-700">
                            <strong>Model Accuracy:</strong> {result.accuracy}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeartDiseaseModule;