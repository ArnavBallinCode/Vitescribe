import React, { useCallback, useState, useEffect } from 'react';
import { Upload, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setLoadingTime(0);
      interval = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const getLoadingMessage = () => {
    if (loadingTime < 5) return "VitalScribe is analyzing your document...";
    if (loadingTime < 15) return "Reading lab values and metrics...";
    if (loadingTime < 30) return "Cross-referencing medical guidelines...";
    return "Finalizing insights... almost there!";
  };

  return (
    <div 
      className={`relative w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-6
        ${dragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-white hover:border-teal-400'}
        ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        accept="image/*,application/pdf"
        onChange={handleChange}
        disabled={isAnalyzing}
      />

      {isAnalyzing ? (
        <div className="flex flex-col items-center animate-pulse">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-center">{getLoadingMessage()}</p>
          <p className="text-xs text-slate-400 mt-2">Running Gemini 3 Pro reasoning engine</p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            Upload Medical Record
          </h3>
          <p className="text-sm text-slate-500 text-center max-w-xs mb-4">
            Drag & drop or click to upload. <br/> Supports Images (JPG, PNG) and PDF.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FileText size={14} /> Lab Reports</span>
            <span className="flex items-center gap-1"><ImageIcon size={14} /> Prescriptions</span>
          </div>
        </>
      )}
    </div>
  );
};