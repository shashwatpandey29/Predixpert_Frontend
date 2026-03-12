import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaChartLine, FaSearch, FaArrowUp, FaMinusCircle, FaAngleDown, FaSpinner } from 'react-icons/fa';
import Plot from 'react-plotly.js';

const availableStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

// A simple spinner component for the loading overlay
const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            <p className="text-lg text-slate-700">Analyzing, please wait...</p>
        </div>
    </div>
);

const StockModule = () => {
    const [ticker, setTicker] = useState(availableStocks[0]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await axios.get(`/api/predict/stock/${ticker}`);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setResult(response.data);
            toast.success(`Analysis for ${ticker} complete!`);
        } catch (err) {
            const msg = err.message || "An error occurred fetching the prediction.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen px-4 py-10 bg-slate-50 text-slate-800 font-sans">
            <Toaster position="top-right" />
            {loading && <LoadingSpinner />}
            
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-indigo-600 flex items-center justify-center gap-3">
                        <FaChartLine /> Stock Predictor
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Select a stock to view its price chart and our model's prediction for the next trading day.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <div className="relative">
                        <select
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                            className="p-3 bg-slate-100 border-2 border-slate-300 rounded-lg shadow-sm appearance-none w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {availableStocks.map(stock => (
                                <option key={stock} value={stock}>{stock}</option>
                            ))}
                        </select>
                        <FaAngleDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Analyzing...' : <><FaSearch /> Analyze</>}
                    </button>
                </form>

                {error && <div className="text-red-600 bg-red-100 border border-red-400 rounded-lg p-4 text-center">❌ {error}</div>}

                {result && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 rounded-lg shadow-md p-6 bg-white border border-slate-200 flex flex-col items-center justify-center">
                                <h2 className="text-xl font-semibold mb-4 text-slate-600">Prediction for Tomorrow</h2>
                                {result.prediction_for_next_day === "Significant Buy" ? (
                                    <div className="text-5xl font-bold text-green-600 flex items-center gap-3"><FaArrowUp /> BUY</div>
                                ) : (
                                    <div className="text-4xl font-bold text-orange-500 flex items-center gap-3"><FaMinusCircle /> NO-TRADE</div>
                                )}
                                <div className="mt-6 text-sm text-slate-500 text-center border-t border-slate-200 pt-4 w-full space-y-2">
                                    <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
                                    <p><strong>Backtested Accuracy:</strong> {(result.metrics.accuracy * 100).toFixed(2)}%</p>
                                    <p><strong>Backtested Precision:</strong> {(result.metrics.precision * 100).toFixed(2)}%</p>
                                </div>
                            </div>

                            <div className="lg:col-span-2 rounded-lg shadow-md p-6 bg-white border border-slate-200">
                                <Plot
                                    data={[{ x: result.chart_data.map(d => d.date), y: result.chart_data.map(d => d.price), type: 'scatter', mode: 'lines', line: { color: '#4f46e5', width: 2 } }]}
                                    layout={{
                                        title: `${ticker} - Last 100 Days`,
                                        paper_bgcolor: 'white',
                                        plot_bgcolor: 'white',
                                        font: { color: '#334155' },
                                        xaxis: { gridcolor: '#e2e8f0' },
                                        yaxis: { gridcolor: '#e2e8f0', tickprefix: '$' },
                                        margin: { l: 50, r: 20, t: 50, b: 40 }
                                    }}
                                    className="w-full h-full" useResizeHandler={true}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg shadow-md p-6 bg-white border border-slate-200">
                            <h2 className="text-xl font-semibold mb-4 text-slate-700">Recent Trends & Predictions</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-300">
                                            <th className="p-3 font-semibold text-slate-600">Date</th>
                                            <th className="p-3 font-semibold text-slate-600">Open</th>
                                            <th className="p-3 font-semibold text-slate-600">High</th>
                                            <th className="p-3 font-semibold text-slate-600">Low</th>
                                            <th className="p-3 font-semibold text-slate-600">Close</th>
                                            <th className="p-3 font-semibold text-slate-600 text-center">Model Prediction</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.trends_data.slice(0).reverse().map((row, index) => (
                                            <tr key={index} className="border-b border-slate-200 last:border-b-0 even:bg-slate-50">
                                                <td className="p-3">{row.Date}</td>
                                                <td className="p-3">${row.Open.toFixed(2)}</td>
                                                <td className="p-3 text-green-600">${row.High.toFixed(2)}</td>
                                                <td className="p-3 text-red-600">${row.Low.toFixed(2)}</td>
                                                <td className="p-3 font-bold text-slate-800">${row.Close.toFixed(2)}</td>
                                                <td className="p-3 text-center">
                                                    {row.Prediction === "Significant Buy" ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                                                            <FaArrowUp /> BUY
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                                                            <FaMinusCircle /> NO-TRADE
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockModule;