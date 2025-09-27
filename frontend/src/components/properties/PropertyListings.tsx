'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { type Property } from "@/lib/properties-data";

interface PropertyListingsProps {
  properties: Property[];
}

const PROPERTIES_PER_PAGE = 9;

export function PropertyListings({ properties }: PropertyListingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const getPrice = (p: Property) => parseFloat(p.price.replace(/[^\d.]/g, ""));
  const getYield = (p: Property) => parseFloat(p.yield.replace('%', ''));

  const filteredAndSortedProperties = useMemo(() => {
    if (!Array.isArray(properties)) {
      return [];
    }
    const filtered = [...properties].filter(p => {
      if (!p || !p.name || !p.location) {
        return false;
      }
      return p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.location.toLowerCase().includes(searchTerm.toLowerCase());
    });

    switch (sortOrder) {
      case 'price_asc':
        filtered.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'price_desc':
        filtered.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'yield_desc':
        filtered.sort((a, b) => getYield(b) - getYield(a));
        break;
      default:
        break;
    }

    return filtered;
  }, [properties, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedProperties.length / PROPERTIES_PER_PAGE);
  const paginatedProperties = filteredAndSortedProperties.slice(
    (currentPage - 1) * PROPERTIES_PER_PAGE,
    currentPage * PROPERTIES_PER_PAGE
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <Input
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="max-w-full md:max-w-sm"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1); // Reset to first page on sort
            }}
            className="bg-background border border-input rounded-md p-2 text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
          >
            <option value="default">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="yield_desc">Yield: High to Low</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
      {paginatedProperties.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-8">
            <Button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            >
            Previous
            </Button>
            <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
            </span>
            <Button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            >
            Next
            </Button>
        </div>
      )}
    </div>
  );
}
