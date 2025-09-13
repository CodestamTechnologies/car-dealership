"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PDFViewer, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function InvoicePreviewPage() {
  const params = useSearchParams();
  const router = useRouter();
  const buyerId = params.get("buyerId");

  const [loading, setLoading] = useState(true);
  const [buyer, setBuyer] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [expenses, setExpenses] = useState(0);
  const [invoiceId, setInvoiceId] = useState("");

  useEffect(() => {
    if (!buyerId) return;
    const fetchBuyer = async () => {
      try {
        const docRef = doc(db, "buyers", buyerId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setBuyer(data);
          setExpenses(Number(data.expenses || 0));
          setInvoiceId(`INV-${Date.now()}`); // Generate invoice ID once
        } else console.error("Buyer not found!");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyer();
  }, [buyerId]);

  const handleConfirmPayment = async () => {
    if (!paymentMode) return alert("Please select a payment mode.");
    const price = Number(buyer.price || 0);
    const additionalCharge = 995;
    const totalAmount = price + additionalCharge + expenses;

    try {
      await addDoc(collection(db, "bills"), {
        buyerName: buyer.name,
        car: buyer.car,
        price,
        additionalCharge,
        expenses,
        totalAmount,
        paymentMode,
        note: customNote || "",
        status: "Pending",
        createdAt: serverTimestamp(),
        invoiceId,
      });
      alert("Payment confirmed!");
      router.push("/dashboard/bill");
    } catch (err) {
      console.error("Error saving bill:", err);
      alert("Failed to save bill.");
    }
  };

  if (loading) return <div className="p-6">Loading invoice...</div>;
  if (!buyer) return <div className="p-6 text-red-500">Buyer not found.</div>;

  const price = Number(buyer.price || 0);
  const additionalCharge = 995;
  const totalAmount = price + additionalCharge + expenses;

  // PDF Document
  const InvoicePDF = (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.title}>Car Invoice</Text>
        <Text style={styles.subtitle}>Invoice Details:</Text>
        <Text>Invoice Date: {new Date().toLocaleDateString()}</Text>
        <Text>Invoice ID: {invoiceId}</Text>

        <Text style={styles.subtitle}>Billed To:</Text>
        <Text>Client: {buyer.name}</Text>
        <Text>Car: {buyer.car}</Text>

        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={styles.tableColHeader}>Description</Text>
            <Text style={styles.tableColHeader}>Unit Price</Text>
            <Text style={styles.tableColHeader}>Qty</Text>
            <Text style={styles.tableColHeader}>Total</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>{buyer.car}</Text>
            <Text style={styles.tableCol}>₹{price}</Text>
            <Text style={styles.tableCol}>1</Text>
            <Text style={styles.tableCol}>₹{price}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Additional Charge</Text>
            <Text style={styles.tableCol}>₹{additionalCharge}</Text>
            <Text style={styles.tableCol}>1</Text>
            <Text style={styles.tableCol}>₹{additionalCharge}</Text>
          </View>

          {expenses > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Expenses</Text>
              <Text style={styles.tableCol}>₹{expenses}</Text>
              <Text style={styles.tableCol}>1</Text>
              <Text style={styles.tableCol}>₹{expenses}</Text>
            </View>
          )}
        </View>

        <Text style={styles.total}>Total Amount Due: ₹{totalAmount}</Text>
      </Page>
    </Document>
  );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="border shadow-lg bg-white flex justify-center items-center p-4">
        <PDFViewer
          key={totalAmount} // Re-render PDF when total changes
          style={{ width: "595px", height: "842px", border: "1px solid #ccc" }}
        >
          {InvoicePDF}
        </PDFViewer>
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Invoice Preview</h1>
        <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Invoice Details</h2>
          <p><span className="font-medium">Buyer:</span> {buyer.name}</p>
          <p><span className="font-medium">Car:</span> {buyer.car}</p>
          <p><span className="font-medium">Additional Charge:</span> ₹{additionalCharge}</p>

          <div className="flex flex-col">
            <Label htmlFor="expenses">Expenses (₹)</Label>
            <Input
              id="expenses"
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
            />
          </div>

          <p><span className="font-medium">Total:</span> ₹{totalAmount}</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-40">Pay Now</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Payment Mode</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <RadioGroup value={paymentMode} onValueChange={setPaymentMode} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Cash" id="cash" />
                  <Label htmlFor="cash">Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Online" id="online" />
                  <Label htmlFor="online">Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Card" id="card" />
                  <Label htmlFor="card">Card</Label>
                </div>
              </RadioGroup>

              <Input
                placeholder="Additional notes (optional)"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
              />

              <Button onClick={handleConfirmPayment} className="w-full">Confirm Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  body: { padding: 30, fontSize: 12 },
  title: { fontSize: 20, textAlign: "center", marginBottom: 10 },
  subtitle: { marginTop: 10, fontSize: 14, fontWeight: "bold" },
  table: { display: "table", width: "auto", marginTop: 15 },
  tableRowHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#000", borderBottomStyle: "solid", marginBottom: 5 },
  tableRow: { flexDirection: "row", marginBottom: 5 },
  tableColHeader: { width: "25%", fontWeight: "bold" },
  tableCol: { width: "25%" },
  total: { marginTop: 10, fontSize: 14, fontWeight: "bold" },
});
