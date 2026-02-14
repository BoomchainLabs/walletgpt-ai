import { createConfig } from "@0xsequence/connect";

export const sequenceConfig = createConfig("waas", {
  projectAccessKey: "AQAAAAAAALpwcROtu7ivlzVZjjSTDiNljf0",
  waasConfigKey: "eyJwcm9qZWN0SWQiOjQ3NzI4LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=",
  appName: "WalletGPT AI",
  position: "center",
  defaultTheme: "dark",
  defaultChainId: 8453, // Base
  chainIds: [8453, 1, 42161, 137, 10],
  email: true,
  google: { clientId: "37179835985-p4m89lfdkrp0ia12e8b7qfut0vv4hn75.apps.googleusercontent.com" },
  apple: {
    clientId: "YOUR_APPLE_CLIENT_ID",
    redirectURI: window.location.origin + "/#/auth/callback"
  },
  guest: true,
  walletConnect: { projectId: "YOUR_WALLET_CONNECT_PROJECT_ID" },
  coinbase: true,
  metaMask: true,
  enableConfirmationModal: true
});