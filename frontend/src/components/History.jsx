import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Filter, Search, Trash2, Download, Calendar, TrendingUp, BarChart3, X, Info } from 'lucide-react';

const History = ({ history, onClearHistory }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline
    const [selected, setSelected] = useState(null);

    const getColorConfig = (l) => {
        const lowerLabel = l.toLowerCase();
        switch (lowerLabel) {
            case 'organik':
                return {
                    text: 'text-green-400',
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/30',
                    gradient: 'from-green-400 to-emerald-600',
                    icon: '🌱'
                };
            case 'anorganik':
                return {
                    text: 'text-blue-400',
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/30',
                    gradient: 'from-blue-400 to-cyan-600',
                    icon: '♻️'
                };
            case 'campuran':
                return {
                    text: 'text-yellow-400',
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/30',
                    gradient: 'from-yellow-400 to-orange-600',
                    icon: '🗑️'
                };
            default:
                return {
                    text: 'text-gray-400',
                    bg: 'bg-gray-500/10',
                    border: 'border-gray-500/30',
                    gradient: 'from-gray-400 to-gray-600',
                    icon: '❓'
                };
        }
    };

    const filteredAndSortedHistory = useMemo(() => {
        let filtered = history || [];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.class.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(item => item.class.toLowerCase() === filterType);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.timestamp) - new Date(a.timestamp);
                case 'confidence':
                    return b.confidence - a.confidence;
                case 'type':
                    return a.class.localeCompare(b.class);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [history, searchTerm, filterType, sortBy]);

    const stats = useMemo(() => {
        if (!history || history.length === 0) return null;
        
        const typeCounts = history.reduce((acc, item) => {
            acc[item.class] = (acc[item.class] || 0) + 1;
            return acc;
        }, {});

        const avgConfidence = history.reduce((sum, item) => sum + item.confidence, 0) / history.length;

        return {
            total: history.length,
            typeCounts,
            avgConfidence,
            mostCommon: Object.keys(typeCounts).reduce((a, b) =>
                typeCounts[a] > typeCounts[b] ? a : b, Object.keys(typeCounts)[0]
            )
        };
    }, [history]);

    if (!history || history.length === 0) {
        return (
            <motion.div
                id="history"
                className="mt-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="glass-panel p-12 max-w-md mx-auto">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Belum Ada Riwayat</h3>
                    <p className="text-gray-400">
                        Mulai klasifikasi sampah untuk melihat riwayat pemindaian di sini.
                    </p>
                </div>
            </motion.div>
        );
    }

    const MotionDiv = motion.div;
    const MotionButton = motion.button;

    const HistoryCard = ({ item, index }) => {
        const colorConfig = getColorConfig(item.class);
        
        return (
            <MotionDiv
                key={`${item.timestamp}-${index}`}
                className="glass-panel p-4 hover:scale-105 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)"
                }}
                onClick={() => setSelected(item)}
            >
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                            <img
                                src={item.image}
                                alt="Hasil pemindaian"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${colorConfig.bg} ${colorConfig.border} flex items-center justify-center text-xs`}>
                            {colorConfig.icon}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold uppercase mb-1 ${colorConfig.text} flex items-center gap-2`}>
                            {item.class}
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-gray-400">
                                {(item.confidence * 100).toFixed(0)}%
                            </span>
                        </div>
                        
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                        
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MotionButton
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                            title="Unduh gambar"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.image) {
                                    const link = document.createElement('a');
                                    link.href = item.image;
                                    link.download = item.filename || 'scan.jpg';
                                    link.click();
                                }
                            }}
                        >
                            <Download className="w-4 h-4 text-gray-400" />
                        </MotionButton>
                    </div>
                </div>
            </MotionDiv>
        );
    };

    return (
        <motion.div
            id="history"
            className="mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Clock className="w-8 h-8 text-primary" />
                        <span className="gradient-text">Riwayat Pemindaian</span>
                    </h2>
                    
                    {onClearHistory && (
                        <MotionButton
                            onClick={onClearHistory}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus Semua
                        </MotionButton>
                    )}
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <MotionDiv
                            className="glass-panel p-4 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="text-2xl font-bold text-primary mb-1">{stats.total}</div>
                            <div className="text-sm text-gray-400">Total Pemindaian</div>
                        </MotionDiv>
                        
                        <MotionDiv
                            className="glass-panel p-4 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-2xl font-bold text-green-400 mb-1">
                                {(stats.avgConfidence * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-400">Rata-rata Keyakinan</div>
                        </MotionDiv>
                        
                        <MotionDiv
                            className="glass-panel p-4 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-2xl font-bold text-blue-400 mb-1 capitalize">
                                {stats.mostCommon}
                            </div>
                            <div className="text-sm text-gray-400">Paling Sering</div>
                        </MotionDiv>
                        
                        <MotionDiv
                            className="glass-panel p-4 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="text-2xl font-bold text-yellow-400 mb-1">
                                {Object.keys(stats.typeCounts).length}
                            </div>
                            <div className="text-sm text-gray-400">Jenis Ditemukan</div>
                        </MotionDiv>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari riwayat..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="all">Semua Jenis</option>
                            <option value="organik">Organik</option>
                            <option value="anorganik">Anorganik</option>
                            <option value="campuran">Campuran</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="date">Terbaru</option>
                            <option value="confidence">Keyakinan Tertinggi</option>
                            <option value="type">Alfabetis</option>
                        </select>
                    </div>

                    {/* View Mode */}
                    <div className="flex gap-2">
                        <MotionButton
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-primary/20 border border-primary/50 text-primary'
                                    : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:bg-gray-700/50'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </MotionButton>
                        <MotionButton
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-primary/20 border border-primary/50 text-primary'
                                    : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:bg-gray-700/50'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <BarChart3 className="w-4 h-4" />
                        </MotionButton>
                    </div>
                </div>
            </div>

            {/* History Items */}
            <AnimatePresence mode="wait">
                {filteredAndSortedHistory.length > 0 ? (
                    <MotionDiv
                        key="content"
                        className={`grid gap-4 ${
                            viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filteredAndSortedHistory.map((item, index) => (
            <HistoryCard key={item.id ?? item.timestamp ?? index} item={item} index={index} />
                        ))}
                    </MotionDiv>
                ) : (
                    <MotionDiv
                        key="empty"
                        className="text-center py-12"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="glass-panel p-8 max-w-md mx-auto">
                            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">Tidak Ada Hasil</h3>
                            <p className="text-gray-400">
                                Coba ubah kata kunci atau filter untuk menemukan yang Anda cari.
                            </p>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <MotionDiv
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <MotionDiv
                            className="glass-panel max-w-3xl w-full overflow-hidden relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between p-4 border-b border-white/10">
                                <div className="flex items-center gap-2 text-white">
                                    <Info className="w-5 h-5 text-primary" />
                                    <div>
                                        <div className="text-lg font-semibold capitalize">{selected.class}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(selected.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-700/70 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-300" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 p-4">
                                <div className="rounded-xl overflow-hidden bg-gray-900">
                                    {selected.image ? (
                                        <img
                                            src={selected.image}
                                            alt="Detail hasil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="p-6 text-center text-gray-400">Gambar tidak tersedia</div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">Keyakinan</span>
                                        <span className="text-lg font-bold text-white">
                                            {(selected.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-secondary"
                                            style={{ width: `${Math.min(100, selected.confidence * 100)}%` }}
                                        />
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        ID: {selected.id || 'n/a'}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Nama berkas: {selected.filename || 'tidak tersedia'}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Tipe: {selected.content_type || 'tidak diketahui'}
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (selected.image) {
                                                const link = document.createElement('a');
                                                link.href = selected.image;
                                                link.download = selected.filename || 'scan.jpg';
                                                link.click();
                                            }
                                        }}
                                        className="w-full mt-4 px-4 py-2 rounded-lg bg-primary/70 hover:bg-primary text-white font-semibold"
                                    >
                                        Unduh Gambar
                                    </button>
                                </div>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default History;
