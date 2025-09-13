// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// export default function BuyerFormDialog({ car }) {
//   const [open, setOpen] = useState(false);
//   const [buyer, setBuyer] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     email: "",
//   });
//   const router = useRouter();

//   const handleChange = (e) =>
//     setBuyer({ ...buyer, [e.target.name]: e.target.value });

//   const handleContinue = async () => {
//     try {
//       // ✅ Save buyer info in "buyers" collection
//       const docRef = await addDoc(collection(db, "buyers"), {
//         ...buyer,
//         car: `${car.year} ${car.make} ${car.model}`,
//         price: car.price,
//         createdAt: serverTimestamp(),
//       });

//       // ✅ Redirect to InvoicePreviewPage with buyerId
//       router.push(`/invoice-preview?buyerId=${docRef.id}`);
//     } catch (error) {
//       console.error("Error adding buyer:", error);
//       alert("Failed to create invoice. Try again.");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="w-full">Buy</Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Buyer Details</DialogTitle>
//         </DialogHeader>

//         <form className="space-y-3">
//           <Input
//             placeholder="Name"
//             name="name"
//             value={buyer.name}
//             onChange={handleChange}
//           />
//           <Input
//             placeholder="Address"
//             name="address"
//             value={buyer.address}
//             onChange={handleChange}
//           />
//           <Input
//             placeholder="Phone"
//             name="phone"
//             value={buyer.phone}
//             onChange={handleChange}
//           />
//           <Input
//             placeholder="Email"
//             name="email"
//             value={buyer.email}
//             onChange={handleChange}
//           />
//           <Button type="button" onClick={handleContinue}>
//             Continue
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
