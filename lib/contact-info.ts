import connectDB from './mongodb';
import Content from '@/models/Content';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    await connectDB();
    const doc = await Content.findOne({ type: 'contact-info' });
    return doc?.content || null;
  } catch (error) {
    console.error('Error reading contact info from database:', error);
    return null;
  }
}

export async function getContactInfoAPI() {
  try {
    const response = await fetch('/api/content?type=contact-info');
    if (response.ok) {
      const data = await response.json();
      return data.length > 0 ? data[0].content : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
} 