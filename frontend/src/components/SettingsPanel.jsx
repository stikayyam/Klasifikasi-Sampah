import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, History, Gauge } from 'lucide-react';

const SettingsPanel = ({
  confidenceThreshold,
  onThresholdChange,
  historyLimit,
  onHistoryLimitChange,
}) => {
  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  const handleThresholdInput = (value) => {
    const parsed = Math.min(1, Math.max(0, parseFloat(value) || 0));
    onThresholdChange(parsed);
  };

  const handleHistoryLimit = (value) => {
    const parsed = Math.min(50, Math.max(1, parseInt(value, 10) || 1));
    onHistoryLimitChange(parsed);
  };

  return (
    <MotionDiv
      className="glass-panel p-4 md:p-6 mb-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 text-primary font-semibold">
        <SlidersHorizontal className="w-5 h-5" />
        <span>Pengaturan</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/40 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Gauge className="w-5 h-5 text-primary" />
              Ambang Keyakinan
            </div>
            <span className="text-sm text-gray-400">
              {(confidenceThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={confidenceThreshold}
            onChange={(e) => handleThresholdInput(e.target.value)}
            className="w-full accent-primary"
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={confidenceThreshold}
              onChange={(e) => handleThresholdInput(e.target.value)}
              className="w-20 px-2 py-1 rounded bg-gray-900 border border-gray-700 text-white text-sm"
            />
            <span className="text-xs text-gray-400">
              Tentukan batas minimal keyakinan untuk dianggap yakin.
            </span>
          </div>
        </div>

        <div className="bg-gray-800/40 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <History className="w-5 h-5 text-secondary" />
              Batas Riwayat
            </div>
            <span className="text-sm text-gray-400">
              {historyLimit} entri
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={historyLimit}
              onChange={(e) => handleHistoryLimit(e.target.value)}
              className="w-full accent-secondary"
            />
            <input
              type="number"
              min="1"
              max="50"
              value={historyLimit}
              onChange={(e) => handleHistoryLimit(e.target.value)}
              className="w-20 px-2 py-1 rounded bg-gray-900 border border-gray-700 text-white text-sm"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Batasi jumlah riwayat yang disimpan di perangkat ini.
          </p>
          <MotionButton
            className="mt-3 text-sm text-secondary hover:text-white transition-colors"
            whileHover={{ x: 4 }}
            onClick={() => onHistoryLimitChange(20)}
          >
            Reset ke 20
          </MotionButton>
        </div>
      </div>
    </MotionDiv>
  );
};

export default SettingsPanel;
