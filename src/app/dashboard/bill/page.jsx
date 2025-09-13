"use client";

import { useEffect, useState, useMemo } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jsPDF from "jspdf";

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // -------- Fetch Bills --------
  useEffect(() => {
    const q = query(collection(db, "bills"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setBills(data);
    });
    return () => unsub();
  }, []);

  const formatCurrency = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  // -------- Filter & Search --------
  const filteredBills = useMemo(() => {
    const s = search.trim().toLowerCase();
    return bills.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(s) ||
        (b.buyerName || "").toLowerCase().includes(s) ||
        (b.car || "").toLowerCase().includes(s);
      const matchesStatus =
        statusFilter === "All" ||
        (b.status || "Pending").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [bills, search, statusFilter]);

  // -------- Actions --------
  const handleMarkPaid = async (id) => {
    try {
      await updateDoc(doc(db, "bills", id), { status: "Paid" });
    } catch (e) {
      console.error(e);
      alert("Failed to mark as paid.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this bill?")) return;
    try {
      await deleteDoc(doc(db, "bills", id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete bill.");
    }
  };

  const handleDownload = (bill) => {
    const pdf = new jsPDF();
    pdf.setFontSize(16).text("Car Invoice", 105, 20, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(`Invoice ID: ${bill.id}`, 20, 35);
    pdf.text(`Buyer: ${bill.buyerName}`, 20, 45);
    pdf.text(`Car: ${bill.car}`, 20, 55);
    pdf.text(`Price: ${formatCurrency(bill.price)}`, 20, 65);
    pdf.text(`Additional Charge: ${formatCurrency(bill.additionalCharge || 0)}`, 20, 75);
    pdf.text(`Expenses: ${formatCurrency(bill.expenses || 0)}`, 20, 85);
    pdf.text(`Total: ${formatCurrency(bill.totalAmount)}`, 20, 95);
    pdf.text(`Payment Mode: ${bill.paymentMode || "N/A"}`, 20, 105);
    pdf.text(`Status: ${bill.status || "Pending"}`, 20, 115);
    const date =
      bill.createdAt?.toDate?.().toLocaleDateString?.() || new Date().toLocaleDateString();
    pdf.text(`Date: ${date}`, 20, 125);
    pdf.save(`Invoice-${bill.buyerName || bill.id}.pdf`);
  };

  // -------- UI --------
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Billing Dashboard</h1>
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Search by invoice ID, buyer, or car"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      {filteredBills.length === 0 && (
        <p className="text-gray-500">No bills match your filter.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBills.map((bill) => {
          const invoiceDate =
            bill.createdAt?.toDate?.() || new Date(bill.createdAt || Date.now());
          const {
            buyerName,
            car,
            price = 0,
            additionalCharge = 0,
            expenses = 0,
            totalAmount = Number(price) + Number(additionalCharge) + Number(expenses),
            paymentMode,
            status = "Pending",
            note,
          } = bill;

          const isPaid = status === "Paid";

          return (
            <Card key={bill.id} className="shadow hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{buyerName}</span>
                  <span className="text-xs text-muted-foreground">
                    {invoiceDate.toLocaleDateString()}
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Invoice ID: {bill.id}</p>
              </CardHeader>

              <CardContent className="space-y-1 text-sm">
                <p><strong>Car:</strong> {car}</p>
                <p><strong>Base Price:</strong> {formatCurrency(price)}</p>
                <p><strong>Additional Charge:</strong> {formatCurrency(additionalCharge)}</p>
                <p><strong>Expenses:</strong> {formatCurrency(expenses)}</p>
                <p className="font-semibold">Total: {formatCurrency(totalAmount)}</p>
                <p><strong>Payment Mode:</strong> {paymentMode || "N/A"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      isPaid
                        ? "text-green-600 font-semibold"
                        : status === "Overdue"
                        ? "text-orange-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {status}
                  </span>
                </p>
                {note && <p><strong>Note:</strong> {note}</p>}
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 justify-between pt-3">
                <Button size="sm" variant="outline" onClick={() => handleDownload(bill)}>
                  Download
                </Button>
                <Button
                  size="sm"
                  variant={isPaid ? "default" : "secondary"}
                  className={isPaid ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                  onClick={() => handleMarkPaid(bill.id)}
                  disabled={isPaid}
                >
                  {isPaid ? "Paid" : "Mark Paid"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(bill.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
