"use client";

import { useEffect, useState } from 'react';

export default function StructuredData() {
  const [structuredData, setStructuredData] = useState<any>(null);

  useEffect(() => {
    const fetchStructuredData = async () => {
      try {
        const response = await fetch('/api/content?type=structured-data');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const structuredContent = data.find(item => item.type === 'structured-data');
            if (structuredContent && structuredContent.content) {
              setStructuredData(structuredContent.content);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching structured data:', error);
      }
    };

    fetchStructuredData();
  }, []);

  // Don't render anything if no structured data is available
  if (!structuredData) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 