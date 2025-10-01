'use client';

import { PropertyListings } from "@/components/properties/PropertyListings";
import { useEffect, useState } from "react";
import { type Property } from "@/lib/properties-data";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/properties`);
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Properties</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <PropertyListings properties={properties} />
      )}
    </div>
  );
}