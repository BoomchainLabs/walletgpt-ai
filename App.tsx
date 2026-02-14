import React from "react";
import { useAccount, SequenceConnect } from "@0xsequence/connect";
import { HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import AuthCallback from "./pages/AuthCallback";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./components/Layout";
import { sequenceConfig } from "./sequenceConfig";

// Wrapper to separate hook usage from Router provider
function AppContent() {
  const { address, isConnected } = useAccount();
  const location = useLocation();
  
  // Check if we were redirected here with a connected address in state (from AuthCallback)
  // or if the hook already knows we are connected.
  const connectedAddress = (location.state as any)?.connectedAddress || address;
  const isUserLoggedIn = isConnected && connectedAddress;

  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={isUserLoggedIn ? <Dashboard address={connectedAddress} /> : <Home />} 
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <SequenceConnect config={sequenceConfig}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </SequenceConnect>
  );
}