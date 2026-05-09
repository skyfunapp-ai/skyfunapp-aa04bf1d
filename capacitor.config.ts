import type { CapacitorConfig } from '@capacitor/cli';

// NOTE: For App Store / Play Store production builds, the `server.url` block
// MUST stay disabled so the app loads the bundled `dist/` web assets.
// If you want to test hot-reload from the Lovable preview during development,
// temporarily uncomment the `server` block below — but never ship it.
const config: CapacitorConfig = {
  appId: 'app.lovable.d793674b885d4f798c21aab29d83f935',
  appName: 'skyfunapp',
  webDir: 'dist',
  // server: {
  //   url: 'https://d793674b-885d-4f79-8c21-aab29d83f935.lovableproject.com?forceHideBadge=true',
  //   cleartext: true,
  // },
};

export default config;
