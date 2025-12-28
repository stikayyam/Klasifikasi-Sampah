import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf,
    Recycle,
    AlertTriangle,
    ChevronRight,
    BookOpen,
    Play,
    CheckCircle,
    X,
    Info,
    TrendingUp,
    Clock
} from 'lucide-react';

const WasteInfo = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);

    const wasteTypes = [
        {
            id: 'organik',
            title: 'Organik',
            description: 'Sampah mudah terurai yang berasal dari tumbuhan atau hewan.',
            detailedInfo: 'Sampah organik terurai secara alami dan dapat dikomposkan menjadi tanah kaya nutrisi. Jenis sampah ini ramah lingkungan bila dikelola dengan benar.',
            examples: ['Sisa makanan', 'Kulit buah', 'Sampah sayuran', 'Daun', 'Kertas', 'Ampas kopi'],
            disposalMethod: 'Dikomposkan atau dibuang ke tempat sampah organik',
            decompositionTime: '2-6 minggu',
            environmentalImpact: 'Rendah - mengembalikan nutrisi ke tanah',
            color: 'from-green-400 to-emerald-600',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
            textColor: 'text-green-400',
            icon: Leaf,
            stats: {
                percentage: 45,
                co2Saved: '2.5kg',
                recyclingRate: '85%'
            }
        },
        {
            id: 'anorganik',
            title: 'Anorganik',
            description: 'Sampah tidak mudah terurai dan sulit membusuk.',
            detailedInfo: 'Sampah anorganik tidak terurai secara alami tetapi sering dapat didaur ulang. Pemilahan dan daur ulang yang tepat membantu menekan dampak lingkungan.',
            examples: ['Botol plastik', 'Kemasan kaca', 'Kaleng logam', 'Aluminium foil', 'Perangkat elektronik'],
            disposalMethod: 'Tempat daur ulang atau pengumpulan khusus',
            decompositionTime: '100-1000 tahun',
            environmentalImpact: 'Tinggi - perlu didaur ulang',
            color: 'from-blue-400 to-cyan-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            textColor: 'text-blue-400',
            icon: Recycle,
            stats: {
                percentage: 35,
                co2Saved: '1.8kg',
                recyclingRate: '65%'
            }
        },
        {
            id: 'campuran',
            title: 'Campuran',
            description: 'Sampah campuran yang sulit dipisah atau terkontaminasi.',
            detailedInfo: 'Sampah campuran berisi bahan yang sulit dipisah atau sudah terkontaminasi. Jenis ini sering berakhir di TPA dan membutuhkan penanganan khusus.',
            examples: ['Kemasan kotor', 'Popok', 'Bahan komposit', 'Kertas terkontaminasi', 'Elektronik rusak'],
            disposalMethod: 'Tempat sampah umum',
            decompositionTime: 'Beragam',
            environmentalImpact: 'Sangat tinggi - biasanya ke TPA',
            color: 'from-yellow-400 to-orange-600',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
            textColor: 'text-yellow-400',
            icon: AlertTriangle,
            stats: {
                percentage: 20,
                co2Saved: '0.5kg',
                recyclingRate: '15%'
            }
        }
    ];

    const MotionDiv = motion.div;
    const MotionButton = motion.button;

    const WasteCard = ({ type, index }) => (
        <MotionDiv
            key={type.id}
            className="glass-panel p-6 relative overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
            }}
            onClick={() => setExpandedCard(expandedCard === type.id ? null : type.id)}
        >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Floating particles */}
            <div className="absolute top-4 right-4">
                <MotionDiv
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={`w-8 h-8 rounded-full ${type.bg} ${type.borderColor} border flex items-center justify-center`}
                >
                    <type.icon className={`w-4 h-4 ${type.textColor}`} />
                </MotionDiv>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <type.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <MotionButton
                        className={`p-2 rounded-lg ${type.bg} ${type.borderColor} border group-hover:scale-110 transition-transform`}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedType(type);
                        }}
                    >
                        <Info className={`w-4 h-4 ${type.textColor}`} />
                    </MotionButton>
                </div>

                {/* Content */}
                <div className="mb-4">
                    <h3 className={`text-2xl font-bold mb-2 ${type.textColor}`}>{type.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{type.description}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className={`text-center p-2 rounded-lg ${type.bg}`}>
                        <div className={`text-lg font-bold ${type.textColor}`}>{type.stats.percentage}%</div>
                        <div className="text-xs text-gray-400">dari sampah</div>
                    </div>
                    <div className={`text-center p-2 rounded-lg ${type.bg}`}>
                        <div className={`text-lg font-bold ${type.textColor}`}>{type.stats.co2Saved}</div>
                        <div className="text-xs text-gray-400">CO₂ dihemat</div>
                    </div>
                    <div className={`text-center p-2 rounded-lg ${type.bg}`}>
                        <div className={`text-lg font-bold ${type.textColor}`}>{type.stats.recyclingRate}</div>
                        <div className="text-xs text-gray-400">didaur ulang</div>
                    </div>
                </div>

                {/* Examples */}
                <div className={`border-t ${type.borderColor} pt-4`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contoh</span>
                        <MotionDiv
                            animate={{ rotate: expandedCard === type.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronRight className={`w-4 h-4 ${type.textColor}`} />
                        </MotionDiv>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {type.examples.slice(0, expandedCard === type.id ? type.examples.length : 3).map((example, idx) => (
                            <span
                                key={idx}
                                className={`text-xs px-2 py-1 rounded-full ${type.bg} ${type.textColor} ${type.borderColor} border`}
                            >
                                {example}
                            </span>
                        ))}
                        {expandedCard !== type.id && type.examples.length > 3 && (
                            <span className="text-xs text-gray-400">+{type.examples.length - 3} lagi</span>
                        )}
                    </div>
                </div>

                {/* Expand button */}
                <AnimatePresence>
                    {expandedCard === type.id && (
                        <MotionDiv
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-gray-700"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">
                                        <strong>Waktu terurai:</strong> {type.decompositionTime}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">
                                        <strong>Dampak lingkungan:</strong> {type.environmentalImpact}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Recycle className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">
                                        <strong>Cara pembuangan:</strong> {type.disposalMethod}
                                    </span>
                                </div>
                            </div>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </div>
        </MotionDiv>
    );

    return (
        <motion.div
            id="info"
            className="mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="text-center mb-12">
                <motion.h2
                    className="text-4xl font-bold mb-4 gradient-text"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    Memahami Jenis Sampah
                </motion.h2>
                <motion.p
                    className="text-xl text-gray-400 max-w-3xl mx-auto"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Pelajari cara memilah dan membuang berbagai jenis sampah untuk lingkungan yang lebih bersih.
                </motion.p>
            </div>

            {/* Waste Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {wasteTypes.map((type, index) => (
                    <WasteCard key={type.id} type={type} index={index} />
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedType && (
                    <MotionDiv
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedType(null)}
                    >
                        <MotionDiv
                            className="glass-panel p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedType.color} flex items-center justify-center`}>
                                        <selectedType.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-bold ${selectedType.textColor}`}>{selectedType.title}</h3>
                                        <p className="text-gray-400">{selectedType.description}</p>
                                    </div>
                                </div>
                                
                                <MotionButton
                                    onClick={() => setSelectedType(null)}
                                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </MotionButton>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                        Informasi Detail
                                    </h4>
                                    <p className="text-gray-300 leading-relaxed">{selectedType.detailedInfo}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`p-4 rounded-xl ${selectedType.bg} ${selectedType.borderColor} border`}>
                                        <h5 className={`font-semibold ${selectedType.textColor} mb-2`}>Fakta Singkat</h5>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-400">Waktu terurai:</span>
                                                <span className={`text-sm font-medium ${selectedType.textColor}`}>{selectedType.decompositionTime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-400">Cara pembuangan:</span>
                                                <span className={`text-sm font-medium ${selectedType.textColor}`}>{selectedType.disposalMethod}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-400">Dampak lingkungan:</span>
                                                <span className={`text-sm font-medium ${selectedType.textColor}`}>{selectedType.environmentalImpact}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl ${selectedType.bg} ${selectedType.borderColor} border`}>
                                        <h5 className={`font-semibold ${selectedType.textColor} mb-2`}>Contoh Umum</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedType.examples.map((example, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`text-sm px-3 py-1 rounded-full ${selectedType.bg} ${selectedType.textColor} ${selectedType.borderColor} border`}
                                                >
                                                    {example}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <MotionButton
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${selectedType.color} text-white font-medium`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Play className="w-4 h-4" />
                                        Pelajari Lebih Lanjut tentang {selectedType.title}
                                    </MotionButton>
                                </div>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default WasteInfo;
