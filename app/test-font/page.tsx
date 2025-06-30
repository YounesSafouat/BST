"use client";

import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export default function TestFontPage() {
  const { theme } = useTheme();
  const [currentFont, setCurrentFont] = useState<string>("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bodyStyle = window.getComputedStyle(document.body);
      setCurrentFont(bodyStyle.fontFamily);
    }
  }, [theme]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Font Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Database Information</h2>
          <p><strong>Theme Name:</strong> {theme?.name || 'No theme loaded'}</p>
          <p><strong>Font Family from DB:</strong> {theme?.fontFamily || 'Not set'}</p>
          <p><strong>Heading Font Family from DB:</strong> {theme?.headingFontFamily || 'Not set'}</p>
          <p><strong>Font Size from DB:</strong> {theme?.fontSize || 'Not set'}</p>
          <p><strong>Heading Font Size from DB:</strong> {theme?.headingFontSize || 'Not set'}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">CSS Variables</h2>
          <p><strong>--font-family:</strong> <span style={{ fontFamily: 'var(--font-family)' }}>This text uses var(--font-family)</span></p>
          <p><strong>--heading-font-family:</strong> <span style={{ fontFamily: 'var(--heading-font-family)' }}>This text uses var(--heading-font-family)</span></p>
          <p><strong>--font-size:</strong> <span style={{ fontSize: 'var(--font-size)' }}>This text uses var(--font-size)</span></p>
          <p><strong>--heading-font-size:</strong> <span style={{ fontSize: 'var(--heading-font-size)' }}>This text uses var(--heading-font-size)</span></p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Computed Styles</h2>
          <p><strong>Body Font Family:</strong> {currentFont}</p>
          <p><strong>Body Font Size:</strong> {typeof window !== 'undefined' ? window.getComputedStyle(document.body).fontSize : 'N/A'}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Text Samples</h2>
          <p className="text-lg mb-4">This is a sample paragraph using the current theme font. It should reflect the font family, size, and line height from your database settings.</p>
          
          <h3 className="text-2xl font-bold mb-2">This is a heading using the heading font family</h3>
          <p className="mb-4">This paragraph should use the body font family and size from your database.</p>
          
          <div className="space-y-2">
            <p style={{ fontFamily: 'Inter, sans-serif' }}>Inter font test</p>
            <p style={{ fontFamily: 'Roboto, sans-serif' }}>Roboto font test</p>
            <p style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins font test</p>
            <p style={{ fontFamily: 'Open Sans, sans-serif' }}>Open Sans font test</p>
            <p style={{ fontFamily: 'Lato, sans-serif' }}>Lato font test</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif' }}>Montserrat font test</p>
            <p style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>Source Sans Pro font test</p>
            <p style={{ fontFamily: 'Nunito, sans-serif' }}>Nunito font test</p>
          </div>
        </div>
      </div>
    </div>
  );
} 