import connectDB from './mongodb';
import Content from '@/models/Content';

export async function getMaintenanceMode() {
  try {
    await connectDB();
    // Read from settings structure where maintenance mode is stored in general.maintenanceMode
    const doc = await Content.findOne({ type: 'settings' });
    return doc?.content?.general?.maintenanceMode === true;
  } catch (error) {
    console.error('Error reading maintenance mode from database:', error);
    // Fallback to environment variable
    return process.env.MAINTENANCE_MODE === 'true';
  }
} 