import { useState } from 'react';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { UserInput } from './components/UserInput';
import { DataAggregation } from './components/DataAggregation';
import { CommodityPrediction } from './components/CommodityPrediction';
import { EarlyWarning } from './components/EarlyWarning';
import { Leaderboard } from './components/Leaderboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Show loading for maximum 5 seconds
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 border-2 border-black border-r-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading FarmForecast...</p>
          <p className="text-xs text-gray-500 mt-2">Initializing authentication...</p>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="text-[#00FFA3] hover:text-[#FF61F6] text-sm underline"
            >
              Refresh if stuck
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'input':
        return <UserInput />;
      case 'stats':
        return <DataAggregation />;
      case 'prediction':
        return <CommodityPrediction />;
      case 'warning':
        return <EarlyWarning />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;