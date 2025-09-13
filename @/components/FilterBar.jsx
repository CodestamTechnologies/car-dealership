"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Reusable select component ---
function FilterSelect({ label, value, onValueChange, options }) {
  return (
    <div className="flex flex-col w-40">
      <Label className="mb-1 text-xs">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
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
}

export default function FilterBar({
  filters,
  setFilters,
  clearFilters,
  filterOptions,
  addCar,
}) {
  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    currency: "USD",
    odometer: "",
    odometerUnit: "miles",
    transmission: "",
    fuelType: "",
    bodyType: "",
    color: "",
    image: "",
    description: "",
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewCar({ ...newCar, image: imageUrl });
    }
  };

  const handleAddCar = () => {
    if (!newCar.make || !newCar.model) {
      alert("Please fill at least Make and Model.");
      return;
    }

    addCar({
      ...newCar,
      id: Date.now(),
      year: parseInt(newCar.year) || 2023,
      price: parseInt(newCar.price) || 0,
      odometer: parseInt(newCar.odometer) || 0,
      image: newCar.image || "/cars/default.jpg",
    });

    setNewCar({
      make: "",
      model: "",
      year: "",
      price: "",
      currency: "USD",
      odometer: "",
      odometerUnit: "miles",
      transmission: "",
      fuelType: "",
      bodyType: "",
      color: "",
      image: "",
      description: "",
    });

    setDialogOpen(false);
  };

  return (
    <div className="flex flex-wrap items-end gap-2 border rounded-lg bg-background p-2 shadow-sm">
      {/* Filters */}
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
        label="Color"
        value={filters.color}
        onValueChange={(value) => setFilters({ ...filters, color: value })}
        options={filterOptions.colors}
      />

      {/* Buttons */}
      <Button variant="outline" size="sm" onClick={clearFilters}>
        Clear All
      </Button>

      {/* Add Car Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {/* <Button size="sm">+ Add Car</Button> */}
        </DialogTrigger>
        <DialogContent className="max-w-lg m gap-y-0">
          <DialogHeader className="">
            <DialogTitle>Add a new car</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new car listing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              "make",
              "model",
              "year",
              "price",
              "odometer",
              "transmission",
              "fuelType",
              "bodyType",
              "color",
              "description",
            ].map((field) => (
              <Input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={newCar[field]}
                onChange={handleChange}
              />
            ))}

            {/* Image Upload */}
            <div className="flex flex-col">
              <Label className="mb-1 text-xs">Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {newCar.image && (
                <img
                  src={newCar.image}
                  alt="Car Preview"
                  className="mt-2 size-12  object-cover rounded"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCar}>Save Car</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
