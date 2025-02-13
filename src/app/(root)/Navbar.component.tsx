"use client";

import Link from "next/link";
import { Search, MenuIcon, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
        <Link href="/" className="flex items-center space-x-2 ml-4 md:ml-0">
          <span className="text-xl font-bold">TripAdvisor</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 mx-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium">
              Discover
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Restaurants</DropdownMenuItem>
              <DropdownMenuItem>Hotels</DropdownMenuItem>
              <DropdownMenuItem>Things to Do</DropdownMenuItem>
              <DropdownMenuItem>Vacation Rentals</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Link href="/trips" className="text-sm font-medium">
            Trips
          </Link> */}
          <Link href="/reviews" className="text-sm font-medium">
            Review
          </Link>
          <Link href="/alerts" className="text-sm font-medium">
            Alerts
          </Link>
        </nav>
        <div className="flex items-center space-x-4 ml-auto">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium">
                {session.user?.name ?? "User"}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
