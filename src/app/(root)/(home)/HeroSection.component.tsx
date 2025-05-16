"use client";
import React, { useState } from "react";
import { Hotel, Utensils, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("hotels");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (location) params.append("location", location);
    params.append("page", "1");
    params.append("limit", "50");
    router.push(`/search/${type}/?${params.toString()}`);
  };


  return (
    <section
      className="bg-gray-900 text-primary-foreground pb-24 pt-8 bg-no-repeat bg-cover bg-center opacity-95"
      style={{ backgroundImage: "url('/images/main-banner.jpg')" }}
    >
      {/* Tabs */}
      <Tabs defaultValue="hotels" className="p-4" >
        <TabsList className="bg-transparent border-b border-primary-foreground/20">
          {[
            { value: "hotels", label: "Hotels", icon: Hotel },
            { value: "restaurants", label: "Restaurants", icon: Utensils },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setType(tab.value)}
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
        <div className="text-black flex flex-wrap gap-4 bg-background p-4 rounded-lg shadow-md w-full md:w-2/3 mx-auto">
          <Input
            placeholder="Search by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          <Input
            placeholder="Search by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          <Button onClick={handleSearch} className="bg-primary text-white"
          disabled={!name && !location}
          >
            <Search className="h-4 w-4 mr-1" /> Search
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
