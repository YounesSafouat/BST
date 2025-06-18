import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-white z-50">
      <DotLottieReact
        src="https://lottie.host/7bcdd207-d088-46d4-8280-994b6cfabacd/qhWx7Wyyn1.lottie"
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
} 