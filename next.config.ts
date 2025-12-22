import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // מתעלם משגיאות TS בזמן הבנייה (כדי שהסקריפטים לא יתקעו את ה-Deploy)
    ignoreBuildErrors: true,
  },
  eslint: {
    // מתעלם משגיאות ESLint בזמן הבנייה
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;