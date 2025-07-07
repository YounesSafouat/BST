import connectDB from './mongodb';
import Content from '@/models/Content';

export async function getMaintenanceMode() {
  await connectDB();
  // Adjust the query and path to match your schema for the maintenance flag
  const doc = await Content.findOne({ type: 'settings' });
  return doc?.content?.maintenanceMode === true;
} 