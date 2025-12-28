import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ImageUpload from './components/ImageUpload';
import PredictionResult from './components/PredictionResult';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import History from './components/History';
import WasteInfo from './components/WasteInfo';
import SettingsPanel from './components/SettingsPanel';
import ParticleBackground from './components/animations/ParticleBackground';
import ConfettiCelebration from './components/animations/ConfettiCelebration';
import useAccessibility from './hooks/useAccessibility';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);
  const [historyLimit, setHistoryLimit] = useState(20);
  
  const { announceToScreenReader, prefersReducedMotion } = useAccessibility();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Fetch history from backend so data tetap ada walau storage lokal dihapus
  useEffect(() => {
    const fetchHistoryFromServer = async () => {
      try {
        const res = await fetch('http://localhost:8000/history');
        if (!res.ok) throw new Error('Gagal memuat riwayat dari server');
        const data = await res.json();
        const mapped = (data.items || []).map((item) => ({
          ...item,
          timestamp: item.created_at
            ? new Date(item.created_at.replace(' ', 'T')).toISOString()
            : item.timestamp || new Date().toISOString(),
          image: item.image_data || item.image,
        }));
        setHistory(mapped);
        if (!result && mapped.length > 0) {
          setResult(mapped[0]);
        }
        localStorage.setItem('scanHistory', JSON.stringify(mapped));
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistoryFromServer();
  }, []);

  const addToHistory = (prediction, image) => {
    const newItem = {
      ...prediction,
      image,
      timestamp: new Date().toISOString()
    };

    setHistory((prev) => {
      const nextHistory = [newItem, ...prev].slice(0, historyLimit); // Simpan sesuai batas
      localStorage.setItem('scanHistory', JSON.stringify(nextHistory));
      return nextHistory;
    });
  };

  // Trim history if batas berubah ke lebih kecil
  useEffect(() => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyLimit);
      localStorage.setItem('scanHistory', JSON.stringify(trimmed));
      return trimmed;
    });
  }, [historyLimit]);

  const handleImageSelect = async (file, imagePreview) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediksi gagal');
      }

      const data = await response.json();
      setResult(data);
      addToHistory(data, imagePreview);
      
      // Trigger confetti for high confidence results
      const confidenceValue = typeof data.confidence === 'number'
        ? data.confidence
        : parseFloat(data.confidence) || 0;

      if (confidenceValue >= confidenceThreshold) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        // Announce to screen reader
        announceToScreenReader(`Klasifikasi selesai: ${data.class} dengan keyakinan ${(data.confidence * 100).toFixed(1)}%`);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal mengklasifikasikan gambar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker to-gray-900 text-white font-sans selection:bg-primary selection:text-white relative overflow-hidden">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Lompat ke konten utama
      </a>
      
      {/* Particle Background - respect reduced motion preference */}
      {!prefersReducedMotion && <ParticleBackground />}
      
      {/* Confetti Celebration */}
      <ConfettiCelebration trigger={showConfetti} />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel border border-white/20',
          style: {
            background: 'rgba(31, 41, 55, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" role="main">
        <div className="max-w-3xl mx-auto text-center mb-16 pt-10">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
            🤖 Klasifikasi Sampah Berbasis AI
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent bg-300% animate-gradient mb-6">
            Pilah Lebih Cerdas, <br /> Hidup Lebih Hijau
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Unggah foto untuk langsung mengklasifikasikan sampah sebagai Organik, Anorganik, atau Campuran.
            Mari bergabung dalam gerakan menuju bumi yang lebih bersih. 🌍
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-8 md:p-12 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
            <SettingsPanel
              confidenceThreshold={confidenceThreshold}
              onThresholdChange={setConfidenceThreshold}
              historyLimit={historyLimit}
              onHistoryLimitChange={setHistoryLimit}
            />

            <ImageUpload onImageSelect={handleImageSelect} />

            {error && (
              <div className="mt-8 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center animate-slide-down">
                ⚠️ {error}
              </div>
            )}

            <PredictionResult
              result={result}
              loading={loading}
              confidenceThreshold={confidenceThreshold}
            />
          </div>
        </div>

        <History history={history} />

        <WasteInfo />
      </main>

      <Footer />
    </div>
  );
}

export default App;
