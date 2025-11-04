"use client"

import React, { useState, useEffect } from 'react';

export default function RendezVousPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section id="contact" style={{ paddingTop: '7rem', paddingBottom: '10rem' }}>
            {isMounted && (
                <div className="iclosed-widget" data-url="https://app.iclosed.io/e/warrenblackswan/rendez-vous-avec-warren-blackswan" title="Rendez-vous avec Warren"></div>
            )}
        </section>
    )
}