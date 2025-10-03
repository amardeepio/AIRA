import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvestmentCard } from "@/components/properties/InvestmentCard";
import {
  DollarSign,
  TrendingUp,
  Home,
  PieChart,
  FileText,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { Metadata } from "next";

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

  return (
    <div className="container mx-auto py-8">
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Properties
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Image and Investment */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{property.name}</CardTitle>
              <CardDescription>{property.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={property.imageUrl}
                alt={property.name}
                className="rounded-lg w-full h-auto object-cover mb-4"
              />
              <p className="text-muted-foreground">{property.description}</p>
            </CardContent>
          </Card>
          <InvestmentCard property={property} />
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Financials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign size={18} />
                  <span className="font-medium">AIRA Valuation</span>
                </div>
                <span className="font-bold text-lg">{property.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} />
                  <span className="font-medium">Est. Yield</span>
                </div>
                <span className="font-bold text-lg">{property.yield}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tokenomics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Home size={18} />
                  <span className="font-medium">Total Shares</span>
                </div>
                <span className="font-mono">{property.totalShares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <PieChart size={18} />
                  <span className="font-medium">Shares Available</span>
                </div>
                <span className="font-mono">{property.sharesAvailable.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Documents & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText size={16} /> View Legal Documents
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MapPin size={16} /> View on Map
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
