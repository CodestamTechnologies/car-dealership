"use client";

import { useState, useMemo, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NavBar from "@/components/NavBar";
import FilterBar from "@/components/FilterBar";
import CarCard from "@/components/CarCard";

export default function DashboardPage() {
  /* ---------- State ---------- */
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState(defaultFilters());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCar, setNewCar] = useState(emptyCar());
  const [loading, setLoading] = useState(true);

  /* ---------- Helpers ---------- */
  function defaultFilters() {
    return {
      make: "all",
      model: "all",
      year: "all",
      price: "all",
      currency: "all",
      odometer: "all",
      odometerUnit: "all",
      transmission: "all",
      fuelType: "all",
      bodyType: "all",
      color: "all",
    };
  }
  function emptyCar() {
    return {
      make: "",
      model: "",
      year: "",
      price: "",
      currency: "Rs",
      odometer: "",
      odometerUnit: "km",
      transmission: "",
      fuelType: "",
      bodyType: "",
      color: "",
      description: "",
      image: "",
    };
  }

  const clearFilters = () => setFilters(defaultFilters());

  /* ---------- Firestore subscription ---------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cars"), (snapshot) => {
      const carsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(carsArr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ---------- Filter options ---------- */
  const filterOptions = useMemo(() => {
    return {
      makes: [...new Set(cars.map((c) => c.make))],
      models: [...new Set(cars.map((c) => c.model))],
      years: [...new Set(cars.map((c) => c.year))].sort((a, b) => b - a),
      prices: ["Below 10k", "10k-20k", "20k+"],
      currencies: [...new Set(cars.map((c) => c.currency))],
      odometers: ["Below 20k", "20k-50k", "50k+"],
      odometerUnits: [...new Set(cars.map((c) => c.odometerUnit))],
      transmissions: [...new Set(cars.map((c) => c.transmission))],
      fuelTypes: [...new Set(cars.map((c) => c.fuelType))],
      bodyTypes: [...new Set(cars.map((c) => c.bodyType))],
      colors: [...new Set(cars.map((c) => c.color))],
    };
  }, [cars]);

  /* ---------- Filtering ---------- */
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      return (
        (filters.make === "all" || car.make === filters.make) &&
        (filters.model === "all" || car.model === filters.model) &&
        (filters.year === "all" || car.year?.toString() === filters.year) &&
        (filters.currency === "all" || car.currency === filters.currency) &&
        (filters.transmission === "all" ||
          car.transmission === filters.transmission) &&
        (filters.fuelType === "all" || car.fuelType === filters.fuelType) &&
        (filters.bodyType === "all" || car.bodyType === filters.bodyType) &&
        (filters.color === "all" || car.color === filters.color)
      );
    });
  }, [cars, filters]);

  /* ---------- Add Car ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setNewCar((prev) => ({ ...prev, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleAddCar = async () => {
    if (!newCar.make || !newCar.model) {
      alert("Please enter at least make and model");
      return;
    }

    try {
      await addDoc(collection(db, "cars"), {
        ...newCar,
        createdAt: serverTimestamp(),
      });
      setNewCar(emptyCar());
      setDialogOpen(false);
    } catch (err) {
      console.error("Error adding car:", err);
      alert("Error saving car to database.");
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-muted/10">
      <NavBar />

      <div className="container py-4 flex items-center justify-between">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
          filterOptions={filterOptions}
        />

        {/* Add Car Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">+ Add Car</Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
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
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newCar[field]}
                  onChange={handleChange}
                />
              ))}

              <div className="flex flex-col">
                <Label className="mb-1 text-xs">Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newCar.image && (
                  <img
                    src={newCar.image}
                    alt="preview"
                    className="mt-2 h-20 w-20 object-cover rounded"
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

      <main className="container py-6">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading cars...</p>
        ) : filteredCars.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No cars found matching your filters.
          </p>
        )}
      </main>
    </div>
  );
}
