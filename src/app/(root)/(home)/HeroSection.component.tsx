import React from "react";

import { Hotel, Utensils, MapPin, CalendarDays, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchForm } from "./SearchForm.component";



const HeroSection = () => (
  <section className="bg-gray-900 text-primary-foreground pb-24 pt-8 bg-no-repeat bg-cover bg-center opacity-95"
  style={{ backgroundImage: "url('/images/main-banner.jpg')" }}>

    {/* Tabs */}
    <Tabs defaultValue="hotels" className="p-4 ">
      <TabsList className="bg-transparent border-b border-primary-foreground/20">
        {[
          { value: "hotels", label: "Hotels", icon: Hotel },
          { value: "restaurants", label: "Restaurants", icon: Utensils },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-primary-foreground/10 text-primary-foreground"
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>

    {/* Content */}
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold mb-2">Your perfect stay awaits</h2>
      <p className="text-xl text-primary-foreground/80 mb-8">
        Find and book hotels & restaurants worldwide
      </p>

      {/* Search Form Component */}
      <SearchForm />
    </div>
  </section>
);

export default HeroSection;
