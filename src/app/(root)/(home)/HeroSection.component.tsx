import React from "react";

import { Hotel, Utensils, MapPin, CalendarDays, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SearchForm = () => (
  <div className="bg-background w-1/2 mx-auto p-4 rounded-lg shadow-lg flex flex-wrap gap-4">
    {/* Destination Input */}
    <div className="flex-1 min-w-[250px]">
      <Input
        placeholder="Where are you going?"
        className="w-full"
      />
    </div>

    {/* Check-in / Check-out */}
    {/* <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[250px]">
          <CalendarDays className="mr-2 h-4 w-4" />
          Check-in — Check-out
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="range" numberOfMonths={2} />
      </PopoverContent>
    </Popover> */}

    {/* Guests & Rooms */}
    {/* <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[200px]">
          <Users className="mr-2 h-4 w-4" />2 adults · 1 room
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4 space-y-4">
          {[{ label: "Adults", value: 2 }, { label: "Rooms", value: 1 }].map((item) => (
            <div className="flex justify-between items-center" key={item.label}>
              <span>{item.label}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  -
                </Button>
                <span>{item.value}</span>
                <Button variant="outline" size="sm">
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover> */}

    {/* Search Button */}
    <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
      <Search className="mr-2 h-4 w-4" />
      Search
    </Button>
  </div>
);

const HeroSection = () => (
  <section className="text-primary-foreground pb-24 pt-8 bg-no-repeat bg-cover bg-center"
  style={{ backgroundImage: "url('images/main-banner.jpg')" }}>

    {/* Tabs */}
    <Tabs defaultValue="hotels" className="py-4">
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
