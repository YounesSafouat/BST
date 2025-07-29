import { NextResponse } from "next/server";
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // Récupérer les données de la page Home
    const homeData = await Content.findOne({ type: 'home-page' });
    
    if (!homeData) {
      return NextResponse.json(
        { error: "Données Home non trouvées" },
        { status: 404 }
      );
    }

    // Convertir l'ObjectId en string pour la sérialisation JSON
    // Return only the content field, not the entire document
    const serializedData = JSON.parse(JSON.stringify(homeData.content));
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données Home:', error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Mettre à jour ou créer les données Home
    const homeData = await Content.findOneAndUpdate(
      { type: 'home-page' },
      { 
        type: 'home-page',
        content: body,
        updatedAt: new Date()
      },
      { 
        new: true, 
        upsert: true 
      }
    );

    return NextResponse.json(homeData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données Home:', error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 