import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, BarChart3, PieChart } from 'lucide-react';

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const PredictionResult = ({ result, loading, confidenceThreshold = 0.8 }) => {
  if (loading) {
    return (
      <MotionDiv
        className="w-full max-w-md mx-auto mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-panel p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-gray-400 font-medium">
            Menganalisis gambar sampah...
          </p>
          <div className="mt-4 space-y-2">
            <div className="skeleton h-2 w-3/4 mx-auto rounded" />
            <div className="skeleton h-2 w-1/2 mx-auto rounded" />
          </div>
        </div>
      </MotionDiv>
    );
  }

  if (!result) {
    return (
      <div className="w-full max-w-md mx-auto mt-8">
        <div className="glass-panel p-6 text-center border border-white/10">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Belum ada hasil
          </h3>
          <p className="text-sm text-gray-400">
            Unggah gambar untuk melihat hasil klasifikasi di sini.
          </p>
        </div>
      </div>
    );
  }

  const label = result.class || result.predicted_class || 'Tidak diketahui';
  const confidence =
    typeof result.confidence === 'number'
      ? result.confidence
      : parseFloat(result.confidence) || 0;

  const probabilities =
    typeof result.probabilities === 'object' && result.probabilities
      ? result.probabilities
      : {};

  const sortedProbabilities = Object.entries(probabilities).sort(
    (a, b) => b[1] - a[1],
  );

  const thresholdPercent = (confidenceThreshold ?? 0) * 100;

  const getColorConfig = (l) => {
    const lower = String(l).toLowerCase();
    switch (lower) {
      case 'organik':
        return {
          text: 'text-green-400',
          gradient: 'from-green-400 to-emerald-600',
          icon: '🌱',
        };
      case 'anorganik':
        return {
          text: 'text-blue-400',
          gradient: 'from-blue-400 to-cyan-600',
          icon: '♻️',
        };
      case 'campuran':
        return {
          text: 'text-yellow-400',
          gradient: 'from-yellow-400 to-orange-500',
          icon: '🗑️',
        };
      default:
        return {
          text: 'text-gray-300',
          gradient: 'from-gray-400 to-gray-600',
          icon: '❓',
        };
    }
  };

  const colorConfig = getColorConfig(label);

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="glass-panel p-6 text-center border border-primary/40 relative overflow-hidden">
        {/* badge */}
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>

        {/* header */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-400 mb-2 flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Hasil Klasifikasi Terakhir
          </div>
          <div
            className={`text-4xl md:text-5xl font-extrabold mb-2 flex items-center justify-center gap-3 ${colorConfig.text}`}
          >
            <span className="text-4xl">{colorConfig.icon}</span>
            <span className="capitalize">{label}</span>
          </div>
          <div className="text-gray-400 text-sm">
            Jenis sampah terdeteksi • Ambang{' '}
            {thresholdPercent.toFixed(0)}
            %
          </div>
        </div>

        {/* confidence bar */}
        <div className="mb-6 text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tingkat Keyakinan
            </span>
            <span className={`font-bold ${colorConfig.text}`}>
              {(confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-700/60 rounded-full h-4 overflow-hidden relative">
            <div
              className={`h-full bg-gradient-to-r ${colorConfig.gradient}`}
              style={{ width: `${Math.min(100, confidence * 100)}%` }}
            />
          </div>
        </div>

        {/* probability breakdown */}
        {sortedProbabilities.length > 0 && (
          <div className="mt-4 text-left">
            <div className="flex items-center gap-2 mb-2 text-gray-300 text-sm">
              <PieChart className="w-4 h-4" />
              Analisis Detail
            </div>
            <div className="space-y-2">
              {sortedProbabilities.map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/60"
                >
                  <span className="text-sm capitalize text-gray-200">
                    {key}
                  </span>
                  <MotionSpan
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold text-white"
                  >
                    {(val * 100).toFixed(1)}%
                  </MotionSpan>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionResult;
