import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizationPanel } from './components/VisualizationPanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { Header } from './components/Header';
import { useDataStore } from './hooks/useDataStore';
import { useStats } from './hooks/useStats';
import { CalculationDetailView } from './components/CalculationDetailView';
import { StatType } from './types/statistics';

function App() {
  const { data, addCandy, removeDataPoint, clearData, setData } = useDataStore();
  const stats = useStats(data);
  const [activeView, setActiveView] = useState<StatType | 'visualization'>('visualization');

  const handleGenerateRandomData = useCallback((count: number) => {
    const newData = Array.from({ length: count }, () =>
      Math.round(Math.random() * 80 + 10)
    );
    setData(newData);
  }, [setData]);

  const handleViewChange = (view: StatType | 'visualization') => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {activeView === 'visualization' ? (
            <motion.div
              key="visualization"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)]"
            >
              <div className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-gray-200">
                <VisualizationPanel
                  data={data}
                  stats={stats}
                  onAddData={addCandy}
                  onRemoveData={removeDataPoint}
                  onGenerateRandomData={handleGenerateRandomData}
                  onClearData={clearData}
                  onViewChange={handleViewChange}
                />
              </div>
              <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200">
                <ExplanationPanel
                  stats={stats}
                  onViewChange={handleViewChange}
                  data={data}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CalculationDetailView
                activeCalculation={activeView as StatType}
                onBack={() => handleViewChange('visualization')}
                data={data}
                stats={stats}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
