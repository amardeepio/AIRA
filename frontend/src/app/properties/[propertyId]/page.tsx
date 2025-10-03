import { notFound } from "next/navigation";
import { Metadata } from "next";
import PropertyDetailContent from "@/components/properties/PropertyDetailContent";

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  yield: string;
  imageUrl: string;
  description: string;
  totalShares: number;
  sharesAvailable: number;
}

async function getProperty(propertyId: string): Promise<Property | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/properties/${propertyId}`, { 
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching property:", error);
  }
  return null;
}

export async function generateMetadata({ params }: { params: { propertyId: string } }): Promise<Metadata> {
  const property = await getProperty(params.propertyId);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: property.name,
    description: property.description,
    openGraph: {
      title: property.name,
      description: property.description,
      images: [
        {
          url: property.imageUrl,
          width: 1200,
          height: 630,
          alt: property.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: property.name,
      description: property.description,
      images: [property.imageUrl],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const property = await getProperty(params.propertyId);

  if (!property) {
    notFound();
  }

  return <PropertyDetailContent property={property} />;
}
