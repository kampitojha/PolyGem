import React, { useState } from 'react';
import { generateSvgCode } from '../services/geminiService';
import { Button } from './Button';
import { Download, RefreshCw, Wand2 } from 'lucide-react';

export const SvgGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [svgCode, setSvgCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const code = await generateSvgCode(prompt);
      setSvgCode(code);
    } catch (err) {
      setError('Failed to generate artwork. Please check your API key or try a different prompt.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!svgCode) return;
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-art-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-indigo-600" />
          AI SVG Studio
        </h2>
        <p className="text-gray-500">Describe an image and Gemini will create vector artwork for you.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A futuristic neon city skyline at sunset"
          className="flex-1 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} isLoading={loading} disabled={!prompt.trim()}>
          Generate
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="text-center space-y-4 animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto"></div>
            <div className="text-gray-500 font-medium">Dreaming up vector shapes...</div>
          </div>
        ) : svgCode ? (
          <div className="w-full h-full p-8 flex items-center justify-center">
             <div 
               className="w-full h-full flex items-center justify-center transition-all duration-500 ease-out"
               dangerouslySetInnerHTML={{ __html: svgCode }} 
             />
             <div className="absolute top-4 right-4 flex gap-2">
               <Button variant="secondary" onClick={handleDownload} title="Download SVG">
                 <Download className="w-4 h-4" />
               </Button>
             </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center">
            <div className="mb-2 mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-gray-400" />
            </div>
            <p>Your artwork will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
