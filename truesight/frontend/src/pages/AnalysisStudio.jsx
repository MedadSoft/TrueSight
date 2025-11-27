import React, { useState } from 'react';
import { Upload, Play, Sliders, FileText, Database, RefreshCw } from 'lucide-react';
import './AnalysisStudio.css';

const AnalysisStudio = () => {
    const [config, setConfig] = useState({
        temperature: 0.6,
        maxTokens: 4096,
        model: 'qwen/qwen3-32b'
    });

    const [sampleCount, setSampleCount] = useState(10);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);

    const [transactions, setTransactions] = useState([]);

    const handleGenerateSample = async (count) => {
        try {
            setLogs(prev => [...prev, `🎲 Generating ${count} sample transactions...`]);
            const response = await fetch(`/api/analysis/generate-sample?count=${count}`, {
                method: 'POST'
            });
            const data = await response.json();
            setTransactions(data);
            setLogs(prev => [...prev, `✅ Generated ${data.length} records ready for analysis.`]);
        } catch (error) {
            setLogs(prev => [...prev, `❌ Error generating sample: ${error.message}`]);
        }
    };

    const handleRunAnalysis = async () => {
        if (transactions.length === 0) {
            alert("Please upload or generate transactions first.");
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setLogs(prev => [...prev, "🚀 Starting analysis pipeline..."]);

        try {
            // Simulate progress steps while waiting for request
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + 5;
                });
            }, 500);

            setLogs(prev => [...prev, `📡 Sending ${transactions.length} transactions to Groq LLM...`]);

            const response = await fetch('/api/analysis/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transactions: transactions,
                    config: config
                })
            });

            const result = await response.json();

            clearInterval(progressInterval);
            setProgress(100);

            if (result.status === 'success') {
                setLogs(prev => [...prev, "✅ Analysis complete!"]);
                setLogs(prev => [...prev, `📊 Processed: ${result.processed_count}, Saved: ${result.saved_count}`]);
                // Redirect to investigation or show success
            } else {
                setLogs(prev => [...prev, "❌ Analysis failed or returned partial results."]);
            }

        } catch (error) {
            setLogs(prev => [...prev, `❌ Error: ${error.message}`]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="analysis-page">
            <div className="page-header">
                <h1 className="page-title">Analysis Studio</h1>
                <p className="page-subtitle">Configure and run AI-powered fraud detection pipelines.</p>
            </div>

            <div className="studio-grid">
                <div className="studio-main">
                    <div className="card">
                        <div className="card-header">
                            <h3><Database size={20} /> Data Source</h3>
                        </div>
                        <div className="data-source-options">
                            <div className="upload-zone">
                                <Upload size={32} />
                                <p>Drag & drop <strong>transactions.csv</strong> here</p>
                                <button className="btn btn-outline btn-sm">Browse Files</button>
                            </div>
                            <div className="divider">OR</div>
                            <div className="generate-zone">
                                <p>Generate synthetic test data</p>
                                <div className="slider-control">
                                    <label>Records: {sampleCount}</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="1000"
                                        value={sampleCount}
                                        onChange={(e) => setSampleCount(parseInt(e.target.value))}
                                    />
                                </div>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleGenerateSample(sampleCount)}
                                >
                                    <RefreshCw size={14} /> Generate Sample
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3><FileText size={20} /> Prompt Configuration</h3>
                        </div>
                        <textarea
                            className="prompt-editor"
                            defaultValue={`ANALYZE these {transaction_count} financial transactions for fraud risk.

FOR EACH transaction, provide:
- Risk level: 🟢 LOW, 🟡 MEDIUM, or 🔴 HIGH
- Concise explanation (UNDER {max_chars} CHARACTERS)
- Focus on 2-3 key risk factors
- Consider TMLScore from source data (1-999 scale)`}
                        />
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3>Execution Logs</h3>
                        </div>
                        <div className="terminal-window">
                            {logs.map((log, i) => (
                                <div key={i} className="log-line">{log}</div>
                            ))}
                            {logs.length === 0 && <div className="log-placeholder">Ready to start...</div>}
                        </div>
                    </div>
                </div>

                <div className="studio-sidebar">
                    <div className="card config-panel">
                        <div className="card-header">
                            <h3><Sliders size={20} /> Model Settings</h3>
                        </div>

                        <div className="form-group">
                            <label>Model</label>
                            <select
                                value={config.model}
                                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                            >
                                <option value="qwen/qwen3-32b">Qwen 3 (32B)</option>
                                <option value="llama3-70b">Llama 3 (70B)</option>
                                <option value="mixtral-8x7b">Mixtral 8x7B</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Temperature: {config.temperature}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={config.temperature}
                                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                            />
                            <div className="range-labels">
                                <span>Precise</span>
                                <span>Creative</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Max Tokens: {config.maxTokens}</label>
                            <input
                                type="range"
                                min="1024"
                                max="8192"
                                step="1024"
                                value={config.maxTokens}
                                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="action-area">
                            <button
                                className={`btn btn-primary btn-block ${isProcessing ? 'disabled' : ''}`}
                                onClick={handleRunAnalysis}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : <><Play size={18} /> Run Analysis</>}
                            </button>
                            {isProcessing && (
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3>Field Selection</h3>
                        </div>
                        <div className="checkbox-list">
                            <label><input type="checkbox" defaultChecked /> Transaction ID</label>
                            <label><input type="checkbox" defaultChecked /> Amount</label>
                            <label><input type="checkbox" defaultChecked /> TML Score</label>
                            <label><input type="checkbox" defaultChecked /> Device Match</label>
                            <label><input type="checkbox" defaultChecked /> IP Address</label>
                            <label><input type="checkbox" /> Time of Day</label>
                            <label><input type="checkbox" /> Merchant Category</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisStudio;
