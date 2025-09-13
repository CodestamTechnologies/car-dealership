"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Reusable select component ---
const FilterSelect = ({ label, value, onValueChange, options }) => (
  <div className="grid w-full items-center gap-1.5">
    <Label htmlFor={label}>{label}</Label>
    <Select id={label} value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options
          .filter((option) => option)
          .map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div>
);

// --- Sidebar component ---
export default function FilterSidebar({ filters, setFilters, clearFilters, filterOptions }) {
  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-full max-w-xs flex-col gap-4 border-r bg-background p-4 hidden lg:flex">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>
      <Separator />
      <div className="flex-1 space-y-4 overflow-y-auto">
        <FilterSelect
          label="Make"
          value={filters.make}
          onValueChange={(value) => setFilters({ ...filters, make: value })}
          options={filterOptions.makes}
        />
        <FilterSelect
          label="Model"
          value={filters.model}
          onValueChange={(value) => setFilters({ ...filters, model: value })}
          options={filterOptions.models}
        />
        <FilterSelect
          label="Year"
          value={filters.year}
          onValueChange={(value) => setFilters({ ...filters, year: value })}
          options={filterOptions.years}
        />
        <FilterSelect
          label="Price"
          value={filters.price}
          onValueChange={(value) => setFilters({ ...filters, price: value })}
          options={filterOptions.prices}
        />
        <FilterSelect
          label="Currency"
          value={filters.currency}
          onValueChange={(value) => setFilters({ ...filters, currency: value })}
          options={filterOptions.currencies}
        />
        <FilterSelect
          label="Odometer Reading"
          value={filters.odometer}
          onValueChange={(value) => setFilters({ ...filters, odometer: value })}
          options={filterOptions.odometers}
        />
        <FilterSelect
          label="Odometer Unit"
          value={filters.odometerUnit}
          onValueChange={(value) => setFilters({ ...filters, odometerUnit: value })}
          options={filterOptions.odometerUnits}
        />
        <FilterSelect
          label="Transmission"
          value={filters.transmission}
          onValueChange={(value) => setFilters({ ...filters, transmission: value })}
          options={filterOptions.transmissions}
        />
        <FilterSelect
          label="Fuel Type"
          value={filters.fuelType}
          onValueChange={(value) => setFilters({ ...filters, fuelType: value })}
          options={filterOptions.fuelTypes}
        />
        <FilterSelect
          label="Body Type"
          value={filters.bodyType}
          onValueChange={(value) => setFilters({ ...filters, bodyType: value })}
          options={filterOptions.bodyTypes}
        />
        <FilterSelect
          label="Colour"
          value={filters.color}
          onValueChange={(value) => setFilters({ ...filters, color: value })}
          options={filterOptions.colors}
        />
      </div>
    </aside>
  );
}
