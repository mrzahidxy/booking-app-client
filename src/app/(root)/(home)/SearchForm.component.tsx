"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

export const SearchForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (location) params.append("location", location);
    params.append("page", "1");
    params.append("limit", "50")
    router.push(`/search?${params.toString()}`);
  };

  return (
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
      <Button onClick={handleSearch} className="bg-primary text-white">
        <Search className="h-4 w-4 mr-1" /> Search
      </Button>
    </div>
  );
};
