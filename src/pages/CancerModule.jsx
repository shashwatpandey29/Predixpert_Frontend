import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaRibbon, FaCheckCircle, FaTimesCircle, FaFlask } from 'react-icons/fa';

// Define feature and model options as constants
const featureOptions = [
    "radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean",
    "compactness_mean", "concavity_mean", "concave points_mean", "symmetry_mean",
    "fractal_dimension_mean", "radius_se", "texture_se", "perimeter_se", "area_se",
    "smoothness_se", "compactness_se", "concavity_se", "concave points_se",
    "symmetry_se", "fractal_dimension_se", "radius_worst", "texture_worst",
    "perimeter_worst", "area_worst", "smoothness_worst", "compactness_worst",
    "concavity_worst", "concave points_worst", "symmetry_worst", "fractal_dimension_worst"
];

const modelOptions = [
    "LogisticRegression",
    "DecisionTreeClassifier",
    "RandomForestClassifier",
    "SVC"
];

const CancerModule = () => {
    // State Management
    const [selectedFeatures, setSelectedFeatures] = useState(featureOptions); // Pre-select all features
    const [selectedModel, setSelectedModel] = useState(modelOptions[0]);
    const [inputValues, setInputValues] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Event Handlers
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
            selected_features: selectedFeatures,
            model_name: selectedModel,
            input_data: orderedInputValues
        };

        try {
            const response = await axios.post('/api/predict/breast_cancer', requestData);
            setResult(response.data);
            toast.success('Prediction successful!');
        } catch (err) {
            const msg = err.response?.data?.error || "An unexpected error occurred.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // JSX Rendering
    return (
        <div className="min-h-screen px-4 py-10 bg-gray-50 text-gray-800 font-sans">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-purple-600 flex items-center justify-center gap-3">
                        <FaRibbon className="text-pink-500" /> Breast Cancer Prediction
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Select features, choose a model, and input data to predict if a tumor is benign or malignant.
                    </p>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Feature Selection */}
                    <div className="rounded-2xl shadow-lg p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">1️⃣ Select Features</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                            {featureOptions.map(f => (
                                <label key={f} className="flex items-center gap-2 cursor-pointer" title={f}>
                                    <input
                                        type="checkbox"
                                        className="accent-pink-600"
                                        checked={selectedFeatures.includes(f)}
                                        onChange={() => handleFeatureChange(f)}
                                    />
                                    <span className="truncate">{f}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div className="rounded-2xl shadow-lg p-6 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">2️⃣ Select Model</h2>
                        <select
                            value={selectedModel}
                            onChange={e => setSelectedModel(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                            {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    {/* Input Values */}
                    {selectedFeatures.length > 0 && (
                        <div className="rounded-2xl shadow-lg p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">3️⃣ Enter Test Values</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedFeatures.map(f => (
                                    <div key={f}>
                                        <label className="block mb-1 text-sm font-medium">{f}</label>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder={`Value for ${f}`}
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
                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? '🔬 Analyzing...' : '🔮 Run Prediction'}
                    </button>
                </form>

                {/* Results Section */}
                {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">❌ {error}</div>}

                {result && (
                    <div className="rounded-2xl shadow-xl p-6 mt-6 bg-white border">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaFlask/>Result</h2>
                        <div className={`text-2xl font-bold flex items-center gap-2 ${result.prediction === 'Malignant' ? 'text-red-500' : 'text-green-600'}`}>
                            {result.prediction === 'Malignant' ? <FaTimesCircle/> : <FaCheckCircle/>}
                            <span>{result.prediction}</span>
                        </div>
                        <p className="mt-2 text-gray-700">
                            <strong>Model Accuracy:</strong> {result.accuracy}
                        </p>
                        <a href={`/api/download/${result.model_filename}`} download>
                            <button className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm">
                                ⬇️ Download Model
                            </button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CancerModule;