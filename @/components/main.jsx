// "use client";

// import * as React from "react";
// import { useState, useMemo } from "react";
// import {
//   Car,
//   Gauge,
//   Fuel,
//   Palette,
//   ChevronDown,
//   Search, 
//   Menu,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// // --- DUMMY DATA ---
// const carsData = [
//   {
//     id: 1,
//     make: "Aston Martin",
//     model: "DBS Superleggera",
//     year: 2018,
//     price: 78000,
//     currency: "GBP",
//     mileage: 126000,
//     mileageUnit: "mi",
//     fuelType: "Petrol",
//     transmission: "Automatic",
//     bodyType: "Coupe",
//     color: "Silver",
//     description: "A stunning example of British engineering and luxury.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 2,
//     make: "BMW",
//     model: "M4",
//     year: 2020,
//     price: 65000,
//     currency: "GBP",
//     mileage: 25000,
//     mileageUnit: "mi",
//     fuelType: "Petrol",
//     transmission: "Automatic",
//     bodyType: "Coupe",
//     color: "Blue",
//     description: "High-performance coupe with aggressive styling.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 3,
//     make: "Audi",
//     model: "RS6",
//     year: 2021,
//     price: 95000,
//     currency: "GBP",
//     mileage: 15000,
//     mileageUnit: "mi",
//     fuelType: "Petrol",
//     transmission: "Automatic",
//     bodyType: "Estate",
//     color: "Grey",
//     description: "The ultimate family car with supercar performance.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 4,
//     make: "Mercedes-Benz",
//     model: "G-Class",
//     year: 2022,
//     price: 150000,
//     currency: "GBP",
//     mileage: 5000,
//     mileageUnit: "mi",
//     fuelType: "Diesel",
//     transmission: "Automatic",
//     bodyType: "SUV",
//     color: "Black",
//     description: "Iconic off-roader with a luxurious interior.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 5,
//     make: "Porsche",
//     model: "911 GT3",
//     year: 2019,
//     price: 135000,
//     currency: "GBP",
//     mileage: 8000,
//     mileageUnit: "mi",
//     fuelType: "Petrol",
//     transmission: "Manual",
//     bodyType: "Coupe",
//     color: "Red",
//     description: "A track-focused machine that's road legal.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 6,
//     make: "Ford",
//     model: "Mustang",
//     year: 2019,
//     price: 35000,
//     currency: "GBP",
//     mileage: 30000,
//     mileageUnit: "mi",
//     fuelType: "Petrol",
//     transmission: "Manual",
//     bodyType: "Coupe",
//     color: "Yellow",
//     description: "American muscle with modern technology.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 7,
//     make: "Tesla",
//     model: "Model S",
//     year: 2022,
//     price: 80000,
//     currency: "GBP",
//     mileage: 12000,
//     mileageUnit: "mi",
//     fuelType: "Electric",
//     transmission: "Automatic",
//     bodyType: "Saloon",
//     color: "White",
//     description: "Cutting-edge electric vehicle with ludicrous speed.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 8,
//     make: "Land Rover",
//     model: "Defender",
//     year: 2021,
//     price: 70000,
//     currency: "GBP",
//     mileage: 22000,
//     mileageUnit: "mi",
//     fuelType: "Diesel",
//     transmission: "Automatic",
//     bodyType: "SUV",
//     color: "Green",
//     description: "A modern take on a legendary off-road vehicle.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 9,
//     make: "Volkswagen",
//     model: "Golf R",
//     year: 2020,
//     price: 38000,
//     currency: "GBP",
//     mileage: 18000,
//     mileageUnit: "mi",
//     fuelType: "Petrol",
//     transmission: "Automatic",
//     bodyType: "Hatchback",
//     color: "Black",
//     description: "The perfect all-rounder hot hatchback.",
//     image: "/placeholder.svg",
//   },
//   {
//     id: 10,
//     make: "Toyota",
//     model: "Supra",
//     year: 2021,
//     price: 55000,
//     currency: "GBP",
//     mileage: 9000,
//     mileageUnit: "mi",
//     fuelType: "Petrol",
//     transmission: "Automatic",
//     bodyType: "Coupe",
//     color: "Red",
//     description: "A legendary nameplate returns with a vengeance.",
//     image: "/placeholder.svg",
//   },
// ];

// // --- REUSABLE COMPONENTS ---

// const Header = () => (
//   <header className="sticky top-0 z-40 w-full border-b bg-background">
//     <div className="container flex h-16 items-center justify-between">
//       <div className="flex items-center gap-6">
//         <a href="#" className="font-bold text-lg">
//           Car Dealer Inventory
//         </a>
//       </div>
//       <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
//         <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">HOME</a>
//         <a href="#" className="transition-colors hover:text-foreground/80 text-foreground">INVENTORY</a>
//         <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">ABOUT US</a>
//         <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">CONTACT</a>
//       </nav>
//       <Sheet>
//         <SheetTrigger asChild>
//           <Button variant="outline" size="icon" className="md:hidden">
//             <Menu className="h-4 w-4" />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="right">
//           <nav className="grid gap-6 text-lg font-medium mt-6">
//             <a href="#" className="hover:text-foreground/80 text-foreground/60">HOME</a>
//             <a href="#" className="hover:text-foreground/80 text-foreground">INVENTORY</a>
//             <a href="#" className="hover:text-foreground/80 text-foreground/60">ABOUT US</a>
//             <a href="#" className="hover:text-foreground/80 text-foreground/60">CONTACT</a>
//           </nav>
//         </SheetContent>
//       </Sheet>
//     </div>
//   </header>
// );

// const FilterSelect = ({ label, value, onValueChange, options }) => (
//   <div className="grid w-full items-center gap-1.5">
//     <Label htmlFor={label}>{label}</Label>
//     <Select id={label} value={value} onValueChange={onValueChange}>
//       <SelectTrigger>
//         <SelectValue placeholder={`Select ${label}`} />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="all">All</SelectItem>
//         {options.map((option) => (
//           <SelectItem key={option} value={option}>
//             {option}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   </div>
// );

// const FilterSidebar = ({ filters, setFilters, clearFilters, filterOptions }) => (
//   <aside className="sticky top-16 h-[calc(100vh-4rem)] w-full max-w-xs flex-col gap-4 border-r bg-background p-4 hidden lg:flex">
//     <div className="flex items-center justify-between">
//       <h3 className="text-lg font-semibold">Filters</h3>
//       <Button variant="ghost" size="sm" onClick={clearFilters}>
//         Clear all
//       </Button>
//     </div>
//     <Separator />
//     <div className="flex-1 space-y-4 overflow-y-auto">
//       <FilterSelect
//         label="Make"
//         value={filters.make}
//         onValueChange={(value) => setFilters({ ...filters, make: value })}
//         options={filterOptions.makes}
//       />
//       <FilterSelect
//         label="Model"
//         value={filters.model}
//         onValueChange={(value) => setFilters({ ...filters, model: value })}
//         options={filterOptions.models}
//       />
//       {/* Model Variant is not in the data, so it's omitted for now */}
//       <FilterSelect
//         label="Year"
//         value={filters.year}
//         onValueChange={(value) => setFilters({ ...filters, year: value })}
//         options={filterOptions.years}
//       />
//       <FilterSelect
//         label="Price"
//         value={filters.price}
//         onValueChange={(value) => setFilters({ ...filters, price: value })}
//         options={filterOptions.prices}
//       />
//       <FilterSelect
//         label="Currency"
//         value={filters.currency}
//         onValueChange={(value) => setFilters({ ...filters, currency: value })}
//         options={filterOptions.currencies}
//       />
//       <FilterSelect
//         label="Odometer Reading"
//         value={filters.odometer}
//         onValueChange={(value) => setFilters({ ...filters, odometer: value })}
//         options={filterOptions.odometers}
//       />
//       <FilterSelect
//         label="Odometer Unit"
//         value={filters.odometerUnit}
//         onValueChange={(value) => setFilters({ ...filters, odometerUnit: value })}
//         options={filterOptions.odometerUnits}
//       />
//       <FilterSelect
//         label="Transmission"
//         value={filters.transmission}
//         onValueChange={(value) => setFilters({ ...filters, transmission: value })}
//         options={filterOptions.transmissions}
//       />
//       <FilterSelect
//         label="Fuel Type"
//         value={filters.fuelType}
//         onValueChange={(value) => setFilters({ ...filters, fuelType: value })}
//         options={filterOptions.fuelTypes}
//       />
//       <FilterSelect
//         label="Body Type"
//         value={filters.bodyType}
//         onValueChange={(value) => setFilters({ ...filters, bodyType: value })}
//         options={filterOptions.bodyTypes}
//       />
//       <FilterSelect
//         label="Colour"
//         value={filters.color}
//         onValueChange={(value) => setFilters({ ...filters, color: value })}
//         options={filterOptions.colors}
//       />
//     </div>
//   </aside>
// );

// const CarCard = ({ car }) => {
//   const handleViewDetails = () => {
//     console.log("Car Details:", car);
//   };

//   return (
//     <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
//       <CardHeader className="p-0 relative">
//         <Image
//           alt={`${car.year} ${car.make} ${car.model}`}
//           className="aspect-video w-full object-cover"
//           height="225"
//           src={car.image}
//           width="400"
//         />
//         <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-md font-bold text-sm">
//           {new Intl.NumberFormat("en-GB", {
//             style: "currency",
//             currency: car.currency,
//             minimumFractionDigits: 0,
//           }).format(car.price)}
//         </div>
//       </CardHeader>
//       <CardContent className="p-4 flex-grow">
//         <CardTitle className="text-lg font-bold">
//           {car.year} {car.make} {car.model}
//         </CardTitle>
//         <p className="text-sm text-muted-foreground mt-1">{car.description}</p>
//         <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1">
//           <div className="flex items-center gap-1">
//             <Gauge className="h-4 w-4" />
//             <span className="text-sm">{car.mileage.toLocaleString()} {car.mileageUnit}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Fuel className="h-4 w-4" />
//             <span className="text-sm">{car.fuelType}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Car className="h-4 w-4" />
//             <span className="text-sm">{car.transmission}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Palette className="h-4 w-4" />
//             <span className="text-sm">{car.color}</span>
//           </div>
//         </div>
//       </CardContent>
//       <CardFooter className="flex flex-col gap-2 p-4">
//         <Button className="w-full">Reserve</Button>
//         <Button variant="outline" className="w-full" onClick={handleViewDetails}>
//           View Details
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// const initialFilters = {
//   make: "all",
//   model: "all",
//   year: "all",
//   price: "all",
//   currency: "all",
//   odometer: "all",
//   odometerUnit: "all",
//   transmission: "all",
//   fuelType: "all",
//   bodyType: "all",
//   color: "all",
// };

// export default function Page() {
//   const [filters, setFilters] = useState(initialFilters);

//   const clearFilters = () => {
//     setFilters(initialFilters);
//   };

//   const filterOptions = useMemo(() => {
//     const makes = [...new Set(carsData.map(car => car.make))];
//     const models = [...new Set(carsData.map(car => car.model))];
//     const years = [...new Set(carsData.map(car => car.year))].sort((a, b) => b - a);
//     const transmissions = [...new Set(carsData.map(car => car.transmission))];
//     const fuelTypes = [...new Set(carsData.map(car => car.fuelType))];
//     const bodyTypes = [...new Set(carsData.map(car => car.bodyType))];
//     const colors = [...new Set(carsData.map(car => car.color))];
//     const prices = [...new Set(carsData.map(car => car.price))].sort((a, b) => a - b).map(price => price.toString());
//     const currencies = [...new Set(carsData.map(car => car.currency))];
//     const odometers = [...new Set(carsData.map(car => car.mileage))].sort((a, b) => a - b).map(odometer => odometer.toString());
//     const odometerUnits = [...new Set(carsData.map(car => car.mileageUnit))];

//     return {
//       makes,
//       models,
//       years: years.map(year => year.toString()),
//       transmissions,
//       fuelTypes,
//       bodyTypes,
//       colors,
//       prices,
//       currencies,
//       odometers,
//       odometerUnits,
//     };
//   }, []);

//   const filteredCars = useMemo(() => {
//     return carsData.filter(car => {
//       return (
//         (filters.make === "all" || car.make === filters.make) &&
//         (filters.model === "all" || car.model === filters.model) &&
//         (filters.year === "all" || car.year.toString() === filters.year) &&
//         (filters.price === "all" || car.price.toString() === filters.price) &&
//         (filters.currency === "all" || car.currency === filters.currency) &&
//         (filters.odometer === "all" || car.mileage.toString() === filters.odometer) &&
//         (filters.odometerUnit === "all" || car.mileageUnit === filters.odometerUnit) &&
//         (filters.transmission === "all" || car.transmission === filters.transmission) &&
//         (filters.fuelType === "all" || car.fuelType === filters.fuelType) &&
//         (filters.bodyType === "all" || car.bodyType === filters.bodyType) &&
//         (filters.color === "all" || car.color === filters.color)
//       );
//     });
//   }, [filters]);

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
//       <div className="container mx-auto px-4 py-6">
//         <div className="flex  flex-col lg:flex-row gap-6">
//           <FilterSidebar 
//             filters={filters} 
//             setFilters={setFilters} 
//             clearFilters={clearFilters} 
//             filterOptions={filterOptions} 
//           />
//           <main className="flex-1">
//             <div className="mb-6">
//               <h1 className="text-2xl font-bold">We have found {filteredCars.length} vehicles</h1>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredCars.map((car) => (
//                 <CarCard key={car.id} car={car} />
//               ))}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }