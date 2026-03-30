import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import DataIngestion from './pages/DataIngestion';
import CarbonCalculation from './pages/CarbonCalculation';
import HotspotAnalysis from './pages/HotspotAnalysis';
import AuditTrust from './pages/AuditTrust';
import Recommendations from './pages/Recommendations';
import ViewsRecommendations from './pages/ViewsRecommendations';
import Sidebar from './components/Sidebar';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <main className="main-content" style={{ background: '#f8fafc' }}>
                    <Routes>
                        <Route path="/" element={<ViewsRecommendations />} />
                        <Route path="/ingestion" element={<DataIngestion />} />
                        <Route path="/calculation" element={<CarbonCalculation />} />
                        <Route path="/hotspot" element={<HotspotAnalysis />} />
                        <Route path="/audit" element={<AuditTrust />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
