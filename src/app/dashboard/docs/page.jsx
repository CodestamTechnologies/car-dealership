"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: { padding: 20, fontSize: 12, lineHeight: 1.5 },
  title: { fontSize: 20, textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 14, marginTop: 10, fontWeight: "bold" },
  list: { marginLeft: 10, marginTop: 5 },
  listItem: { marginBottom: 3 },
});

const infoData = {
  documents: [
    "Valid Government ID (Aadhar, Passport, Driving License)",
    "Address Proof (Utility Bill, Passport, Aadhar)",
    "Bank Account Details for payment (if applicable)",
    "PAN Card (for financial transactions if needed)",
    "Any additional documents requested by our team for verification",
  ],
  policies: [
    "All payments must be completed before delivery of the car.",
    "Partial or advance payments are accepted, but full payment is required to complete the transfer of ownership.",
    "We do not accept cash above regulatory limits. Use UPI, bank transfer, or approved finance options.",
    "The price displayed on our website includes basic charges. Additional charges like destination fee or optional add-ons will be communicated before purchase.",
    "Cars are sold on a first-come-first-serve basis. Booking confirmation requires complete documentation.",
    "Any false information or incomplete documents may delay the purchase process.",
    "Refunds are handled according to our company policy, which will be shared at the time of payment.",
  ],
  process: [
    "Choose the car you want from our listing.",
    "Fill out the buyer form with your details.",
    "Upload required documents for verification.",
    "Make payment via UPI, bank transfer, or other accepted methods.",
    "Once payment is confirmed, your documents will be verified and processed.",
    "You will receive your invoice and confirmation of purchase.",
    "The car will be delivered to you or ready for pickup as per your preference.",
  ],
};

const InfoDocument = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.title}>Car Buying Guide & Policy</Text>

      <Text style={styles.subtitle}>Required Documents:</Text>
      <View style={styles.list}>
        {infoData.documents.map((doc, i) => (
          <Text key={i} style={styles.listItem}>• {doc}</Text>
        ))}
      </View>

      <Text style={styles.subtitle}>Buying Rules & Policies:</Text>
      <View style={styles.list}>
        {infoData.policies.map((rule, i) => (
          <Text key={i} style={styles.listItem}>• {rule}</Text>
        ))}
      </View>

      <Text style={styles.subtitle}>Buying Process:</Text>
      <View style={styles.list}>
        {infoData.process.map((step, i) => (
          <Text key={i} style={styles.listItem}>{i + 1}. {step}</Text>
        ))}
      </View>

      <Text style={styles.subtitle}>Need Help?</Text>
      <Text>If you have any questions about the process, payment, or documents, contact our support team via email, phone, or chat during working hours.</Text>
    </Page>
  </Document>
);

export default function BuyingInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Buying Guide & Customer Information
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Required Documents</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {infoData.documents.map((doc, i) => (
              <li key={i}>{doc}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Buying Rules & Policies</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {infoData.policies.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Buying Process</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {infoData.process.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </Card>

        <div className="text-center mt-4">
          <PDFDownloadLink document={<InfoDocument />} fileName="buying_guide.pdf">
            {({ loading }) => (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? "Generating PDF..." : "Download PDF Guide"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}
