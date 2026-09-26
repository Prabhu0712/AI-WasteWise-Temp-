import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const startCamera = async (facing: 'environment' | 'user') => {
    setLoading(true);
    setError(null);

    // Stop current stream if running
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings.'
          : 'Could not access camera. Please make sure no other app is using it or upload an image file instead.'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera(cameraFacing);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraFacing]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Stop stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onCapture(dataUrl);
  };

  const toggleFacing = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col items-center justify-center p-4 min-h-[380px]">
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={onCancel}
          className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          title="Close Camera"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center space-y-3 py-12 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-sm">Initializing camera stream...</p>
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center text-center p-6 max-w-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={() => startCamera(cameraFacing)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition"
          >
            Retry Camera Access
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Target Reticle / Viewfinder */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-emerald-400/40 rounded-xl relative">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-emerald-400/60 font-mono uppercase tracking-widest">
                  Target Material
                </div>
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Camera controls */}
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={toggleFacing}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Flip Camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={handleCapture}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-500/30 transition transform active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>Capture Snapshot</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
