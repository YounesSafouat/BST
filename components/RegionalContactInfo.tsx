"use client";

import React, { useState, useEffect } from 'react';
import { getUserLocation, getRegionFromCountry } from '@/lib/geolocation';
import { Phone, Mail } from 'lucide-react';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp?: string;
}

interface RegionalContactInfoProps {
  className?: string;
}

export default function RegionalContactInfo({
  className = ""
}: RegionalContactInfoProps) {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState<{
    france: ContactInfo;
    morocco: ContactInfo;
    other: ContactInfo;
  } | null>(null);

  // Detect location using the same logic as pricing section
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const userLocation = await getUserLocation();
        setLocation(userLocation);
      } catch (error) {
        console.error("Error detecting location:", error);
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Fetch CMS data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/content/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.content?.regionalContact) {
            setContactData(data.content.regionalContact);
          }
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    };

    fetchContactData();
  }, []);

  // Get contact info based on detected region
  const getContactInfo = (): ContactInfo | null => {
    if (!location || !contactData) {
      return null;
    }

    const region = getRegionFromCountry(location.countryCode);

    let selectedData;
    switch (region) {
      case 'france':
        selectedData = contactData.france;
        break;
      case 'morocco':
        selectedData = contactData.morocco;
        break;
      default:
        selectedData = contactData.other;
        break;
    }

    return selectedData;
  };

  const contactInfo = getContactInfo();

  // Show loading if location is being detected or no contact data
  if (loading || !contactInfo) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={`bg-[var(--color-main)] p-6 rounded-lg ${className}`}>
      <div className="space-y-6">

        {/* Contact Information */}
        <div className="space-y-3">
          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-white" />
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-white hover:underline"
            >
              {contactInfo.phone}
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-white" />
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-white hover:underline"
            >
              {contactInfo.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 