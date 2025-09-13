"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="#" className="font-bold text-2xl">
            Our Collections
          </a>
        </div>
        {/* <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
            HOME
          </a>
          
          <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
            ABOUT US
          </a>
          <a href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
            INVENTORY
          </a>
          
        </nav> */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="grid gap-6 text-lg font-medium mt-6">
              <a href="#" className="hover:text-foreground/80 text-foreground/60">
                HOME
              </a>
              
              <a href="#" className="hover:text-foreground/80 text-foreground/60">
                ABOUT US
              </a>
              <a href="#" className="hover:text-foreground/80 text-foreground">
                INVENTORY
              </a>
              
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
