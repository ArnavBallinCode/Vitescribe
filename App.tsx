import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { analyzeMedicalDocument } from './services/geminiService';
import { AnalysisStatus, HealthAnalysis } from './types';
import { HeartPulse, FileText, ChevronRight, RefreshCw, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisData, setAnalysisData] = useState<HealthAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (file: File) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setAnalysisData(null);

    try {
      const base64 = await fileToBase64(file);
      const data = await analyzeMedicalDocument(base64, file.type);
      setAnalysisData(data);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze document. Please ensure it is a clear image or PDF.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setAnalysisData(null);
    setError(null);
    setShowChat(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg text-white">
              <HeartPulse size={24} />
            </div>
            <div>
               <h1 className="text-xl font-bold text-slate-800 tracking-tight">VitalScribe</h1>
               <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">AI Medical Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {status === AnalysisStatus.COMPLETE && (
               <button 
                 onClick={() => setShowChat(!showChat)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${showChat ? 'bg-teal-100 text-teal-700' : 'bg-white border border-slate-300 hover:bg-slate-50'}`}
               >
                 <MessageCircle size={16} />
                 {showChat ? 'Hide Chat' : 'Ask AI'}
               </button>
             )}
             {status !== AnalysisStatus.IDLE && (
               <button 
                  onClick={handleReset}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  title="New Analysis"
               >
                  <RefreshCw size={20} />
               </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {status === AnalysisStatus.IDLE && (
          <div className="max-w-2xl mx-auto mt-12 animate-fadeIn">
            <div className="text-center mb-10">
               <h2 className="text-3xl font-bold text-slate-900 mb-4">
                 Make sense of your medical records.
               </h2>
               <p className="text-lg text-slate-600">
                 Upload lab reports, prescriptions, or clinical notes. VitalScribe translates them into plain English and actionable insights using advanced AI.
               </p>
            </div>
            
            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Instant Analysis</h3>
                  <p className="text-sm text-slate-500">Extracts key metrics from complex PDF reports or photos.</p>
               </div>
               <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-3">
                    <HeartPulse size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Plain English</h3>
                  <p className="text-sm text-slate-500">Explains medical jargon simply so you understand your health.</p>
               </div>
               <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-3">
                    <ChevronRight size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Actionable Steps</h3>
                  <p className="text-sm text-slate-500">Personalized lifestyle and dietary recommendations.</p>
               </div>
            </div>
          </div>
        )}

        {status === AnalysisStatus.ANALYZING && (
           <div className="max-w-2xl mx-auto mt-20">
              <FileUpload onFileSelect={()=>{}} isAnalyzing={true} />
              
              <div className="mt-8 space-y-3">
                 <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 animate-[loading_2s_ease-in-out_infinite] w-1/3"></div>
                 </div>
                 <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Reading Document...</span>
                    <span>Checking References...</span>
                    <span>Generating Insights...</span>
                 </div>
              </div>
           </div>
        )}

        {status === AnalysisStatus.ERROR && (
           <div className="max-w-lg mx-auto mt-20 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <RefreshCw size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <button 
                 onClick={handleReset}
                 className="px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                 Try Again
              </button>
           </div>
        )}

        {status === AnalysisStatus.COMPLETE && analysisData && (
           <div className="flex flex-col lg:flex-row gap-6 relative">
              <div className={`flex-1 transition-all duration-300 ${showChat ? 'lg:w-2/3' : 'w-full'}`}>
                 <Dashboard data={analysisData} />
              </div>
              
              {/* Floating Chat Sidebar Desktop / Modal Mobile */}
              {showChat && (
                <div className={`
                    fixed inset-0 z-50 lg:static lg:z-0 lg:block lg:w-1/3 
                    bg-slate-900/50 lg:bg-transparent flex items-center justify-center p-4 lg:p-0
                `}>
                   <div className="w-full max-w-md lg:max-w-none lg:sticky lg:top-24">
                      {/* Mobile Close Button */}
                      <button 
                        onClick={() => setShowChat(false)}
                        className="lg:hidden absolute top-2 right-2 p-2 bg-white rounded-full"
                      >
                         X
                      </button>
                      <ChatInterface contextData={analysisData} />
                   </div>
                </div>
              )}
           </div>
        )}
      </main>
      
      <style>{`
        @keyframes loading {
          0% { margin-left: -33%; }
          100% { margin-left: 100%; }
        }
        .animate-fadeIn {
           animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
           from { opacity: 0; transform: translateY(10px); }
           to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;