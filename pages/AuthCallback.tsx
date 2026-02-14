import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWaas } from "@0xsequence/connect";
import { Layout } from "../components/Layout";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { completeOAuthLogin } = useWaas();

  useEffect(() => {
    async function finishLogin() {
      try {
        console.log("Completing OAuth login...");
        const address = await completeOAuthLogin();
        console.log("Logged in with address:", address);
        // Navigate to root with address state
        navigate("/", { state: { connectedAddress: address } });
      } catch (err) {
        console.error("OAuth login failed:", err);
        // Even if it fails, go home so the user can try again
        navigate("/");
      }
    }
    finishLogin();
  }, [completeOAuthLogin, navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <h2 className="text-xl font-medium text-white">Finalizing secure connection...</h2>
        <p className="text-gray-400 text-sm">Please wait while we verify your credentials.</p>
      </div>
    </Layout>
  );
}