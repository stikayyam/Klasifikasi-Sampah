import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, CheckCircle, AlertCircle } from 'lucide-react';

const ImageUpload = ({ onImageSelect }) => {
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const dragCounter = useRef(0);

    const processFile = useCallback((file) => {
        if (!file.type.startsWith('image/')) {
            setUploadStatus('error');
            setErrorMessage('Unggah berkas gambar');
            setTimeout(() => setUploadStatus('idle'), 3000);
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setUploadStatus('error');
            setErrorMessage('Ukuran berkas harus di bawah 10MB');
            setTimeout(() => setUploadStatus('idle'), 3000);
            return;
        }

        setUploadStatus('uploading');
        
        const reader = new FileReader();
        reader.onloadstart = () => setUploadStatus('uploading');
        reader.onloadend = () => {
            setPreview(reader.result);
            setUploadStatus('success');
            onImageSelect(file, reader.result);
            setTimeout(() => setUploadStatus('idle'), 2000);
        };
        reader.onerror = () => {
            setUploadStatus('error');
            setErrorMessage('Gagal membaca berkas');
            setTimeout(() => setUploadStatus('idle'), 3000);
        };
        reader.readAsDataURL(file);
    }, [onImageSelect]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }, [processFile]);

    const removeImage = useCallback(() => {
        setPreview(null);
        setUploadStatus('idle');
        setErrorMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const MotionDiv = motion.div;
    const MotionButton = motion.button;

    const uploadZoneVariants = {
        idle: {
            borderColor: 'rgba(156, 163, 175, 0.5)',
            backgroundColor: 'rgba(31, 41, 55, 0.3)',
            scale: 1,
        },
        dragging: {
            borderColor: 'rgba(16, 185, 129, 0.8)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            scale: 1.02,
            transition: { duration: 0.2 }
        },
        hover: {
            borderColor: 'rgba(16, 185, 129, 0.5)',
            backgroundColor: 'rgba(31, 41, 55, 0.5)',
            scale: 1.01,
        }
    };

    const statusIconVariants = {
        idle: { rotate: 0, scale: 1 },
        uploading: { rotate: 360, scale: 1.1, transition: { duration: 1, repeat: Infinity, ease: "linear" } },
        success: { rotate: 0, scale: 1.2, transition: { type: "spring", stiffness: 300 } },
        error: { rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.5 } }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <MotionDiv
                className="relative"
                variants={uploadZoneVariants}
                animate={isDragging ? 'dragging' : 'idle'}
                whileHover={!isDragging ? 'hover' : ''}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !preview && fileInputRef.current?.click()}
            >
                <div className="glass-panel p-8 text-center cursor-pointer relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Status indicator */}
                    <AnimatePresence>
                        {uploadStatus !== 'idle' && (
                            <MotionDiv
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute top-4 right-4 z-10"
                            >
                                {uploadStatus === 'uploading' && (
                                    <MotionDiv variants={statusIconVariants} animate="uploading">
                                        <Upload className="w-6 h-6 text-primary" />
                                    </MotionDiv>
                                )}
                                {uploadStatus === 'success' && (
                                    <MotionDiv variants={statusIconVariants} animate="success">
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    </MotionDiv>
                                )}
                                {uploadStatus === 'error' && (
                                    <MotionDiv variants={statusIconVariants} animate="error">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                    </MotionDiv>
                                )}
                            </MotionDiv>
                        )}
                    </AnimatePresence>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <AnimatePresence mode="wait">
                        {preview ? (
                            <MotionDiv
                                key="preview"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="relative group"
                            >
                                <div className="relative overflow-hidden rounded-xl">
                                    <img
                                        src={preview}
                                        alt="Pratinjau"
                                        className="w-full h-64 object-cover"
                                    />
                                    
                                    {/* Overlay with controls */}
                                    <MotionDiv
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-4"
                                    >
                                        <div className="flex justify-end">
                                            <MotionButton
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage();
                                                }}
                                                className="bg-red-500/80 backdrop-blur-sm p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </MotionButton>
                                        </div>
                                        
                                        <div className="text-center">
                                            <p className="text-white font-medium mb-2">Klik untuk ganti gambar</p>
                                            <MotionButton
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                                className="bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm hover:bg-primary transition-colors"
                                            >
                                                Pilih Gambar Baru
                                            </MotionButton>
                                        </div>
                                    </MotionDiv>
                                </div>
                            </MotionDiv>
                        ) : (
                            <MotionDiv
                                key="upload"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6 py-8"
                            >
                                {/* Animated upload icon */}
                                <MotionDiv
                                    variants={statusIconVariants}
                                    animate={isDragging ? 'uploading' : 'idle'}
                                    className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/30"
                                >
                                    <Image className="w-12 h-12 text-primary" />
                                </MotionDiv>

                                <div className="space-y-2">
                                    <MotionDiv
                                        className="text-xl font-semibold text-white"
                                        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                                    >
                                        {isDragging ? 'Lepaskan gambar di sini' : 'Unggah foto sampah Anda'}
                                    </MotionDiv>
                                    <p className="text-gray-400 text-sm">
                                        Tarik lalu lepas atau klik untuk memilih
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        Mendukung: JPG, PNG, GIF, WebP (maks 10MB)
                                    </p>
                                </div>

                                {/* Upload button */}
                                <MotionButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    className="bg-gradient-to-r from-primary to-primary/80 text-white font-medium py-3 px-6 rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-glow"
                                >
                                    Pilih Berkas
                                </MotionButton>
                            </MotionDiv>
                        )}
                    </AnimatePresence>

                    {/* Error message */}
                    <AnimatePresence>
                        {errorMessage && (
                            <MotionDiv
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm"
                            >
                                {errorMessage}
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>
            </MotionDiv>
        </div>
    );
};

export default ImageUpload;
