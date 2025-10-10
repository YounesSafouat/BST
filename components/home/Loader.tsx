import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full backdrop-blur-sm z-[9999] pointer-events-none">
      <div className="relative flex items-center justify-center pointer-events-auto">
        <DotLottieReact
          src="https://lottie.host/a3992c7b-3e59-45e6-a068-c5a8a24f0d1a/h0AxrlehaZ.lottie"
          loop
          autoplay
          style={{ width: 200, height: 200 }}
        />
      </div>
    </div>
  );
} 