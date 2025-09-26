import React, { useState, useRef } from 'react';
import { Upload, Image, Video, X, Play, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { UploadedFile, ProcessingResult } from '../types';
import { clsx } from 'clsx';

interface UploadSectionProps {
  onProcessingComplete: (result: ProcessingResult) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onProcessingComplete }) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only JPG, PNG, or MP4 files');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size must be less than 50MB');
      return;
    }

    const url = URL.createObjectURL(file);
    const uploadedFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url,
      size: file.size,
      uploadedAt: new Date(),
    };

    setUploadedFile(uploadedFile);
  };

  const simulateProcessing = async (): Promise<ProcessingResult> => {
    // Simulate ML processing pipeline
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate realistic detection results
    const zones = {
      floor: {
        score: Math.floor(Math.random() * 100),
        detections: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
          x: Math.random() * 400,
          y: Math.random() * 300 + 200,
          width: 50 + Math.random() * 100,
          height: 30 + Math.random() * 60,
          confidence: 0.7 + Math.random() * 0.3,
          label: 'dirt_spot'
        }))
      },
      toiletSeat: {
        score: Math.floor(Math.random() * 100),
        detections: Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, i) => ({
          x: Math.random() * 200 + 100,
          y: Math.random() * 100 + 50,
          width: 40 + Math.random() * 80,
          height: 20 + Math.random() * 40,
          confidence: 0.8 + Math.random() * 0.2,
          label: 'stain'
        }))
      },
      sink: {
        score: Math.floor(Math.random() * 100),
        detections: Array.from({ length: Math.floor(Math.random() * 2) }, (_, i) => ({
          x: Math.random() * 150 + 250,
          y: Math.random() * 80 + 100,
          width: 30 + Math.random() * 60,
          height: 20 + Math.random() * 40,
          confidence: 0.75 + Math.random() * 0.25,
          label: 'soap_residue'
        }))
      },
      dustbin: {
        score: Math.floor(Math.random() * 100),
        detections: Array.from({ length: Math.floor(Math.random() * 2) }, (_, i) => ({
          x: Math.random() * 100 + 350,
          y: Math.random() * 150 + 200,
          width: 25 + Math.random() * 50,
          height: 30 + Math.random() * 60,
          confidence: 0.7 + Math.random() * 0.3,
          label: 'overflow'
        }))
      }
    };

    const overallScore = Math.floor(
      (zones.floor.score + zones.toiletSeat.score + zones.sink.score + zones.dustbin.score) / 4
    );

    const status = overallScore >= 70 ? 'Clean' : overallScore >= 40 ? 'Moderately Dirty' : 'Dirty';

    return {
      id: `result-${Date.now()}`,
      fileId: uploadedFile!.id,
      cleanlinessScore: overallScore,
      status,
      zones,
      processedAt: new Date(),
      processingTime: 2.8 + Math.random() * 1.2,
      modelConfidence: 0.85 + Math.random() * 0.15,
      alertTriggered: overallScore < 30,
    };
  };

  const handleProcessing = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      const result = await simulateProcessing();
      onProcessingComplete(result);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Upload className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Upload for Analysis</h2>
          <p className="text-gray-600">Upload images or videos for AI-powered cleanliness detection</p>
        </div>
      </div>

      {!uploadedFile ? (
        <div
          className={clsx(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Image className="h-8 w-8 text-blue-600" />
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your files here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPG, PNG, MP4 files up to 50MB
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">AI Processing Pipeline:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• OpenCV preprocessing & edge detection</p>
                <p>• YOLOv8 zone-wise dirt detection</p>
                <p>• CNN classification (Clean/Dirty/Moderate)</p>
                <p>• LSTM predictive analytics</p>
                <p>• Privacy-preserving processing (no face storage)</p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,video/mp4"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Preview */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={clsx(
                  'p-2 rounded-lg',
                  uploadedFile.type === 'image' ? 'bg-blue-100' : 'bg-purple-100'
                )}>
                  {uploadedFile.type === 'image' ? (
                    <Image className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Video className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{uploadedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadedFile.size)} • Uploaded {uploadedFile.uploadedAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
              {uploadedFile.type === 'image' ? (
                <img
                  src={uploadedFile.url}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="h-12 w-12 mx-auto mb-2 opacity-75" />
                    <p className="text-sm">Video Preview</p>
                    <p className="text-xs opacity-75">Click "Check Cleanliness" to process</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Processing Controls */}
          <div className="flex justify-center">
            <button
              onClick={handleProcessing}
              disabled={isProcessing}
              className={clsx(
                'px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3',
                isProcessing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing with AI Models...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Check Cleanliness</span>
                </>
              )}
            </button>
          </div>

          {isProcessing && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <h3 className="font-medium text-blue-900">AI Processing Pipeline Active</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">OpenCV Preprocessing</span>
                  <div className="w-32 bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">YOLOv8 Zone Detection</span>
                  <div className="w-32 bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">CNN Classification</span>
                  <div className="w-32 bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">LSTM Prediction Analysis</span>
                  <div className="w-32 bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};