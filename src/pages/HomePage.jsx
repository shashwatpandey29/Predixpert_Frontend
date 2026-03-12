import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaTint,
    FaRibbon, 
    FaStethoscope, 
    FaHeartbeat,
    FaChartLine 
} from 'react-icons/fa';

// --- Custom hook to track mouse position for the aurora effect ---
const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = ev => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return mousePosition;
};

// --- UPDATED: The definitive Glassmorphism Card ---
const ModuleCard = ({ to, icon, title, description, bgColor, features }) => (
    <Link to={to} className="group block h-full">
        <div 
            className="h-full p-6 rounded-2xl shadow-xl backdrop-blur-lg relative overflow-hidden
                       border border-white/10
                       transition duration-300 ease-in-out hover:border-white/20 hover:-translate-y-2
                       will-change-transform"
            style={{
                // --- DESIGN: Enhanced glassy background for the card ---
                background: 'rgba(255, 255, 255, 0.05)',
            }}
        >
            {/* --- DESIGN: Added a glowing border effect on hover --- */}
            <div className="absolute top-0 left-0 w-full h-full border-2 border-teal-400 rounded-2xl
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                 style={{ boxShadow: '0 0 15px rgba(56, 189, 189, 0.5)' }}></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 h-full">
                <div className={`p-4 rounded-full ${bgColor} shadow-lg`}>
                    {icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>

                <div className="relative h-20 w-full flex items-center justify-center">
                    <div className="absolute transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
                        <p className="text-sm text-gray-200">{description}</p>
                    </div>
                    <div className="absolute text-center transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                        <p className="text-xs text-gray-300 mb-3 px-2">Key features: {features}</p>
                        <span className="inline-block px-5 py-2 text-sm font-bold bg-teal-400 text-gray-900 rounded-lg shadow-lg">
                            Analyze
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Link>
);


const HomePage = () => {
    const { x, y } = useMousePosition();

    return (
        <div 
            className="min-h-screen w-full font-sans flex items-center justify-center p-8 overflow-hidden relative"
            style={{ backgroundColor: '#0a0217' }} // A deep purple fallback
        >
            {/* --- DESIGN: The new animated gradient background --- */}
            <div className="absolute inset-0 z-0 w-full h-full bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 animate-gradient-x"></div>

            {/* --- DESIGN: The smoother aurora/spotlight effect --- */}
            <div 
                className="absolute inset-0 z-10"
                style={{ 
                    background: `radial-gradient(600px at ${x}px ${y}px, rgba(45, 212, 191, 0.1), transparent 80%)`,
                }}
            ></div>
            
            {/* Main Content Container */}
            <div className="relative z-20 max-w-7xl w-full text-center space-y-16">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-cyan-300 to-purple-400">
                        Intelligent Health & Finance Insights
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                        Harnessing Machine Learning to provide predictions for critical health and financial markets. Select a module below to begin your analysis.
                    </p>
                </div>
                
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-teal-300 border-b-2 border-teal-300/30 pb-2 inline-block">
                        Health Modules
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Cards now use the new glassy style */}
                        <ModuleCard 
                            to="/diabetes"
                            icon={<FaTint className="text-white text-4xl" />}
                            title="Diabetes Prediction"
                            description="Analyze metabolic markers to assess risk."
                            bgColor="bg-gradient-to-br from-red-500 to-pink-500"
                            features="Glucose, BMI, Age"
                        />
                        <ModuleCard 
                            to="/cancer"
                            icon={<FaRibbon className="text-white text-4xl" />}
                            title="Breast Cancer Analysis"
                            description="Classify tumor characteristics."
                            bgColor="bg-gradient-to-br from-purple-500 to-indigo-500"
                            features="Radius, Texture, Area"
                        />
                        <ModuleCard 
                            to="/prognosis"
                            icon={<FaStethoscope className="text-white text-4xl" />}
                            title="Disease Prognosis"
                            description="Predict ailments from symptoms."
                            bgColor="bg-gradient-to-br from-blue-500 to-cyan-500"
                            features="Symptom analysis"
                        />
                        <ModuleCard 
                            to="/heart-disease"
                            icon={<FaHeartbeat className="text-white text-4xl" />}
                            title="Heart Disease Prediction"
                            description="Assess cardiovascular risk factors."
                            bgColor="bg-gradient-to-br from-rose-500 to-red-600"
                            features="Cholesterol, BP, Age"
                        />
                    </div>
                </section>
                
                <section className="space-y-6">
                     <h2 className="text-3xl font-semibold text-green-300 border-b-2 border-green-300/30 pb-2 inline-block">
                        Finance Module
                    </h2>
                    <div className="flex justify-center">
                        <div className="w-full lg:w-1/3 md:w-1/2">
                             <ModuleCard 
                                to="/stock-predictor"
                                icon={<FaChartLine className="text-white text-4xl" />}
                                title="Stock Predictor"
                                description="Forecast stock price direction."
                                bgColor="bg-gradient-to-br from-green-500 to-teal-500"
                                features="Moving Averages, Volume"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;