"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Gauge, Fuel, Palette } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";



// ---------------- BuyerFormDialog ----------------
function BuyerFormDialog({ car, onComplete }) {
  const [open, setOpen] = useState(false);
  const [buyer, setBuyer] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const router = useRouter();

  const handleChange = (e) =>
    setBuyer({ ...buyer, [e.target.name]: e.target.value });

  const handleContinue = async (e) => {
    e.preventDefault(); // stop native form submit
    try {
      const docRef = await addDoc(collection(db, "buyers"), {
        ...buyer,
        car: `${car.year} ${car.make} ${car.model}`,
        price: car.price,
        createdAt: serverTimestamp(),
      });

      onComplete?.(buyer);
      router.push(`/invoice-preview?buyerId=${docRef.id}`);
    } catch (error) {
      console.error("Error adding buyer:", error);
      alert("Failed to create invoice. Try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Buy</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buyer Details</DialogTitle>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleContinue}>
          <Input
            placeholder="Name"
            name="name"
            value={buyer.name}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Address"
            name="address"
            value={buyer.address}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Phone"
            name="phone"
            value={buyer.phone}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Email"
            name="email"
            value={buyer.email}
            onChange={handleChange}
            type="email"
            required
          />
          <Button type="submit">Continue</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------- CarCard ----------------
const formatRupees = (amount) =>
  `₹${amount?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) || 0}`;

export default function CarCard({ car }) {
  const [carData, setCarData] = useState(car);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [customCharge, setCustomCharge] = useState(995);
  const [customDescription, setCustomDescription] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "cars", car.id), (snapshot) => {
      if (snapshot.exists()) {
        setCarData({ id: snapshot.id, ...snapshot.data() });
      }
    });
    return () => unsub();
  }, [car.id]);

  const handleFinalSubmit = async () => {
    if (!buyerInfo) return;

    try {
      await addDoc(collection(db, "bills"), {
        customer: buyerInfo.name,
        email: buyerInfo.email,
        phone: buyerInfo.phone,
        carMake: carData.make,
        carModel: carData.model,
        carYear: carData.year,
        carPrice: carData.price,
        amount: carData.price,
        status: "Pending",
        date: serverTimestamp(),
        invoice: `INV-${Date.now()}`,
        customCharge,
        customDescription,
      });

      alert("Purchase saved! Documents and billing updated.");
      setDocOpen(false);
      setBuyerInfo(null);
      setCustomCharge(995);
      setCustomDescription("");
    } catch (error) {
      console.error("Error saving billing info:", error);
      alert("Failed to save billing. Try again.");
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          alt={`${carData.year} ${carData.make} ${carData.model}`}
          className="aspect-video w-full object-cover"
          height={225}
          src={carData.image}
          width={400}
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-md font-bold text-sm">
          {formatRupees(carData.price)}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold">
          {carData.year} {carData.make} {carData.model}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{carData.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" /> {carData.odometer?.toLocaleString()}{" "}
            {carData.odometerUnit}
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" /> {carData.fuelType}
          </div>
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4" /> {carData.transmission}
          </div>
          <div className="flex items-center gap-1">
            <Palette className="h-4 w-4" /> {carData.color || carData.colour}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <p>
            <strong>Expenses:</strong> {carData.expenses || "N/A"}
          </p>
          <p>
            <strong>Works:</strong> {carData.works || "N/A"}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 p-4">
        <BuyerFormDialog
          car={carData}
          onComplete={(info) => {
            setBuyerInfo(info);
            setPaymentOpen(true);
          }}
        />

        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </DialogTrigger>

          <DialogContent className="w-3/4 max-w-4xl h-[80vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {carData.year} {carData.make} {carData.model}
              </DialogTitle>
              <p className="text-base text-muted-foreground">Full car details</p>
            </DialogHeader>

            <div className="grid gap-4 py-4 md:grid-cols-2">
              <Image
                src={carData.image}
                alt={carData.model}
                width={500}
                height={300}
                className="rounded-lg object-cover w-full"
              />
              <div className="space-y-2">
                <p>
                  <strong>Price:</strong> {formatRupees(carData.price)}
                </p>
                <p>
                  <strong>Odometer:</strong>{" "}
                  {carData.odometer?.toLocaleString()} {carData.odometerUnit}
                </p>
                <p>
                  <strong>Fuel Type:</strong> {carData.fuelType}
                </p>
                <p>
                  <strong>Transmission:</strong> {carData.transmission}
                </p>
                <p>
                  <strong>Body Type:</strong> {carData.bodyType}
                </p>
                <p>
                  <strong>Color:</strong> {carData.color || carData.colour}
                </p>
                <p>
                  <strong>Description:</strong> {carData.description}
                </p>
                <p>
                  <strong>Expenses:</strong> {carData.expenses || "N/A"}
                </p>
                <p>
                  <strong>Works:</strong> {carData.works || "N/A"}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
