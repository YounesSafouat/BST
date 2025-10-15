"use client";

import React from 'react';

interface VideoBackgroundSectionProps {
    headline?: string;
    description?: string;
    ctaText?: string;
    ctaUrl?: string;
}

const VideoBackgroundSection: React.FC<VideoBackgroundSectionProps> = ({
    headline = "Vous avez un projet ERP, CRM ou de gestion d'entreprise ?",
    description = "Parlons-en ensemble. Nos experts Odoo vous aident à structurer vos processus, centraliser vos données et accélérer votre croissance.",
    ctaText = "Planifiez un échange avec un expert",
    ctaUrl = "/contact"
}) => {
    return (
        <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/video%20module%20section.mp4" type="video/mp4" />
                </video>
                
                {/* Blue Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0ca5e9]/70 to-[#9c9da3]/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left Side - Text Content */}
                        <div className="text-white space-y-6">
                            <h1 
                                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                                dangerouslySetInnerHTML={{ __html: headline }}
                            />
                            <p 
                                className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        </div>

                        {/* Right Side - CTA Button */}
                        <div className="flex justify-center lg:justify-end">
                            <a
                                href={ctaUrl}
                                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <span dangerouslySetInnerHTML={{ __html: ctaText }} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoBackgroundSection;
