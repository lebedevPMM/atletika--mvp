
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { FileText, Shield, Check, ArrowRight, Loader2, LogOut, WifiOff, AlertCircle } from 'lucide-react';

interface OfferAcceptScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const OfferAcceptScreen: React.FC<OfferAcceptScreenProps> = ({ onNavigate }) => {
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOffline = false; // Mock offline state

  const canProceed = offerAccepted && policyAccepted && !isLoading && !isOffline;

  const handleAccept = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('auth_permissions');
    }, 400);
  };

  const handleDecline = () => {
    if (window.confirm('Decline terms? You will be returned to the login screen.')) {
      onNavigate('auth_phone');
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col p-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 bg-cyan-900/30 rounded-2xl flex items-center justify-center mb-6 text-cyan-500 shadow-lg shadow-cyan-900/20 border border-cyan-500/20">
          <Shield className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-black text-white mb-4 leading-tight italic uppercase tracking-tighter">Legal<br />Consents</h1>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-medium">
          To access the club and your personal account, you must accept the terms of service.
        </p>

        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-red-950/20 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold mb-6 animate-in slide-in-from-top-2 border border-red-500/20">
            <WifiOff className="w-4 h-4" />
            <span className="opacity-90">No connection. Check internet.</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Offer Checkbox */}
          <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${offerAccepted ? 'border-cyan-500 bg-cyan-950/20' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`}>
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${offerAccepted ? 'bg-cyan-600 border-cyan-600' : 'border-zinc-600 bg-zinc-800'}`}>
              {offerAccepted && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={offerAccepted}
              onChange={() => setOfferAccepted(!offerAccepted)}
            />
            <div className="flex-1">
              <span className="text-sm font-bold text-white block mb-1">Offer Agreement</span>
              <span className="text-xs text-zinc-500 leading-snug block">
                I accept the <button onClick={(e) => { e.preventDefault(); onNavigate('auth_privacy'); }} className="text-cyan-500 underline font-medium hover:text-cyan-400">public offer</button> and club rules.
              </span>
            </div>
          </label>

          {/* Privacy Checkbox */}
          <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${policyAccepted ? 'border-cyan-500 bg-cyan-950/20' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`}>
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${policyAccepted ? 'bg-cyan-600 border-cyan-600' : 'border-zinc-600 bg-zinc-800'}`}>
              {policyAccepted && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={policyAccepted}
              onChange={() => setPolicyAccepted(!policyAccepted)}
            />
            <div className="flex-1">
              <span className="text-sm font-bold text-white block mb-1">Privacy Policy</span>
              <span className="text-xs text-zinc-500 leading-snug block">
                I agree to the processing of <button onClick={(e) => { e.preventDefault(); onNavigate('auth_privacy'); }} className="text-cyan-500 underline font-medium hover:text-cyan-400">personal data</button>.
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className="safe-area-bottom pt-6">
        <button
          onClick={handleAccept}
          disabled={!canProceed}
          className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold shadow-xl shadow-cyan-900/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-cyan-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Accept & Continue <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <button
          onClick={handleDecline}
          disabled={isLoading}
          className="w-full mt-3 py-3 text-sm font-bold text-zinc-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Decline & Exit
        </button>
      </div>
    </div>
  );
};

export default OfferAcceptScreen;