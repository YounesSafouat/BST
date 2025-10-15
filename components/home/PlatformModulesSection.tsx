"use client";

import React, { useState, useEffect } from 'react';

interface PlatformApp {
    title: string;
    description: string;
    icon: string;
    features: string[];
}

interface PlatformModulesSectionProps {
    homePageData?: {
        platformSection?: {
            headline?: string;
            subheadline?: string;
            description?: string;
        };
    };
    timeline1: PlatformApp[];
    timeline2: PlatformApp[];
    timeline3: PlatformApp[];
}

const PlatformModulesSection: React.FC<PlatformModulesSectionProps> = ({
    homePageData,
    timeline1,
    timeline2,
    timeline3
}) => {
    const [hiddenTimelineCards, setHiddenTimelineCards] = useState<Set<string>>(new Set());

    const handleTimelineCardError = (cardKey: string) => {
        setHiddenTimelineCards(prev => new Set(prev).add(cardKey));
    };

    return (
        <section className="py-12 lg:py-6 xl:py-16 2xl:py-20 bg-white overflow-hidden pt-20 lg:pt-8 xl:pt-20 2xl:pt-24 relative z-30" id="modules">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    
                    <h2 
                        className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4"
                        dangerouslySetInnerHTML={{ __html: homePageData?.platformSection?.subheadline || 'Plateforme Odoo' }}
                    />
                   
                </div>

                {/* Timeline 1 - Scrolling Up */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[500px] lg:h-[450px] xl:h-[600px] relative">

                    <div className="relative overflow-hidden rounded-2xl timeline-container">
                        <div className="flex flex-col space-y-6 animate-scroll-up">
                            {[...timeline1, ...timeline1].map((app, index) => {
                                const cardKey = `timeline1-${index}`;
                                if (hiddenTimelineCards.has(cardKey)) return null;

                                return (
                                    <div
                                        key={cardKey}
                                        className="timeline-card bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                    >
                                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                            <img
                                                src={app.icon}
                                                alt={app.title}
                                                className="w-12 h-12 object-contain"
                                                onError={() => handleTimelineCardError(cardKey)}
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                            {app.description}
                                        </p>
                                        <div className="space-y-2">
                                            {app.features.slice(0, 2).map((feature, i) => (
                                                <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                                                    <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl timeline-container hidden md:block">
                        <div className="flex flex-col space-y-6 animate-scroll-down">
                            {[...timeline2, ...timeline2].map((app, index) => {
                                const cardKey = `timeline2-${index}`;
                                if (hiddenTimelineCards.has(cardKey)) return null;

                                return (
                                    <div
                                        key={cardKey}
                                        className="timeline-card bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                    >
                                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                            <img
                                                src={app.icon}
                                                alt={app.title}
                                                className="w-12 h-12 object-contain"
                                                onError={() => handleTimelineCardError(cardKey)}
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                            {app.description}
                                        </p>
                                        <div className="space-y-2">
                                            {app.features.slice(0, 2).map((feature, i) => (
                                                <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                                                    <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl timeline-container hidden md:block">
                        <div className="flex flex-col space-y-6 animate-scroll-up-slow">
                            {[...timeline3, ...timeline3].map((app, index) => {
                                const cardKey = `timeline3-${index}`;
                                if (hiddenTimelineCards.has(cardKey)) return null;

                                return (
                                    <div
                                        key={cardKey}
                                        className="timeline-card bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[var(--color-secondary)] transition-all duration-300 hover:shadow-lg group min-h-[200px] flex flex-col text-center"
                                    >
                                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                            <img
                                                src={app.icon}
                                                alt={app.title}
                                                className="w-12 h-12 object-contain"
                                                onError={() => handleTimelineCardError(cardKey)}
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{app.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                            {app.description}
                                        </p>
                                        <div className="space-y-2">
                                            {app.features.slice(0, 2).map((feature, i) => (
                                                <div key={i} className="flex items-center text-xs text-[var(--color-secondary)]">
                                                    <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full mr-2"></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PlatformModulesSection;
