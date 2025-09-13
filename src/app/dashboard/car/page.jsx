"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Eye, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function CarTable() {
  const [cars, setCars] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);

  // --- Fetch cars from Firestore ---
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

  // --- Filtering ---
  const filteredCars = useMemo(() => {
    return cars.filter(
      (car) => filterStatus === "ALL" || car.status === filterStatus
    );
  }, [cars, filterStatus]);

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Table Row Component ---
  const TableRow = ({ car }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editData, setEditData] = useState({
      ...car,
      expenses: car.expenses || "",
      works: car.works || "",
    });

    const handleEditChange = (e) => {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSave = async () => {
      try {
        const carRef = doc(db, "cars", car.id);
        await updateDoc(carRef, editData);
        setEditOpen(false);
      } catch (err) {
        console.error("Error updating car:", err);
        alert("Failed to update car.");
      }
    };

    const handleDeleteConfirm = async () => {
      try {
        await deleteDoc(doc(db, "cars", car.id));
        setDeleteOpen(false);
      } catch (err) {
        console.error("Error deleting car:", err);
        alert("Failed to delete car.");
      }
    };

    const editFields = [
      "make",
      "model",
      "year",
      "title",
      "price",
      "currency",
      "odometer",
      "odometerUnit",
      "transmission",
      "fuelType",
      "bodyType",
      "colour",
      "description",
      "status",
      "image",
      "expenses", // new field
      "works",    // new field
    ];

    return (
      <tr className="hover:bg-gray-100">
        <td className="px-4 py-2">{car.id}</td>
        <td className="px-4 py-2">
          {car.image && (
            <Image
              src={car.image}
              alt={"IMG"}
              width={60}
              height={40}
              className="rounded object-cover"
            />
          )}
        </td>
        <td className="px-4 py-2">{car.title}</td>
        <td className="px-4 py-2">₹{car.price}</td>
        <td className="px-4 py-2">{car.vrm}</td>
        <td className="px-4 py-2">{car.colour}</td>
        <td className="px-4 py-2">{car.status}</td>
        <td className="px-4 py-2">{car.dateCreated}</td>
        <td className="px-4 py-2">{car.views}</td>
        <td className="px-4 py-2 flex space-x-2">
          {/* Edit Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Pencil size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Car</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Update car details below.
                </p>
              </DialogHeader>
              <div className="grid gap-2 py-2">
                {editFields.map((field) => (
                  <div key={field} className="flex flex-col">
                    <Label htmlFor={field} className="font-medium text-sm">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      value={editData[field] || ""}
                      onChange={handleEditChange}
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleEditSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Dialog */}
          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Eye size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{car.title}</DialogTitle>
                <p className="text-lg text-muted-foreground mt-1">
                  Car full details:
                </p>
              </DialogHeader>
              <div className="grid gap-2 py-2">
                {car.image && (
                  <Image
                    src={car.image}
                    alt={"IMG"}
                    width={100}
                    height={50}
                    className="rounded-md object-cover"
                  />
                )}
                {Object.entries(car)
                  .filter(([key]) => key !== "image")
                  .map(([key, value]) => {
                    let displayValue = value;
                    if (value && typeof value === "object") {
                      if (value.seconds && value.nanoseconds) {
                        displayValue = new Date(
                          value.seconds * 1000
                        ).toLocaleString();
                      } else {
                        displayValue = JSON.stringify(value);
                      }
                    }
                    return (
                      <p key={key}>
                        <strong>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>{" "}
                        {displayValue}
                      </p>
                    );
                  })}
              </div>
              <DialogFooter>
                <Button onClick={() => setViewOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to delete this car?
                </p>
              </DialogHeader>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </td>
      </tr>
    );
  };

  // --- Pagination Component ---
  const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <div className="flex items-center justify-center mt-4 space-x-2">
        <Button
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-2">
        {["ALL", "LIVE", "DRAFT", "SOLD"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading cars...</p>
      ) : (
        <>
          {/* Table */}
          <Card className="overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "ID",
                    "Image",
                    "Title",
                    "Price",
                    "VRM",
                    "Colour",
                    "Status",
                    "Date Created",
                    "Views",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-left font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCars.map((car) => (
                  <TableRow key={car.id} car={car} />
                ))}
              </tbody>
            </table>
          </Card>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
