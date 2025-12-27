"use client";
import React, { useTransition } from "react";
import { Hotel, Utensils, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Formik, Form } from "formik";
import { Label } from "@/components/ui/label";
import type { SearchFormValues, SearchType } from "@/features/search/types";

const HeroSection = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialValues: SearchFormValues = {
    name: "",
    location: "",
    type: "hotels",
  };

  const validate = (values: SearchFormValues) => {
    const errors: Partial<Record<keyof SearchFormValues | "form", string>> = {};
    if (!values.name.trim() && !values.location.trim()) {
      errors.form = "Enter a name or location to search.";
    }
    return errors;
  };

  const handleSubmit = (values: SearchFormValues) => {
    const queryValue = [values.name, values.location]
      .map((item) => item.trim())
      .filter(Boolean)
      .join(" ");

    if (!queryValue) {
      return;
    }

    const params = new URLSearchParams({
      query: queryValue,
      page: "1",
      limit: "50",
    });

    startTransition(() => {
      router.push(`/search/${values.type}/?${params.toString()}`);
    });
  };

  return (
    <section
      className="relative overflow-hidden bg-gray-900 text-primary-foreground pb-28 pt-14"
    >
      <Image
        src="/images/main-banner.jpg"
        alt="Scenic travel destination"
        fill
        priority
        className="object-cover opacity-90"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/80" />
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-3">
          Your perfect stay awaits
        </h2>
        <p className="text-base sm:text-lg text-primary-foreground/80 mb-10">
          Find and book hotels & restaurants worldwide
        </p>

        {/* Search Form Component */}
        <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
          {({ values, errors, handleChange, setFieldValue, isSubmitting }) => {
            const isDisabled =
              (!values.name.trim() && !values.location.trim()) || isSubmitting || isPending;
            return (
              <div className="space-y-4">
                <Tabs
                  defaultValue="hotels"
                  aria-label="Search category"
                  onValueChange={(value) => setFieldValue("type", value as SearchType)}
                >
                  <TabsList className="bg-white/10 border border-white/15 rounded-full p-1 shadow-sm">
                    {[
                      { value: "hotels", label: "Hotels", icon: Hotel },
                      { value: "restaurants", label: "Restaurants", icon: Utensils },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="data-[state=active]:bg-white data-[state=active]:text-primary text-primary-foreground/80 rounded-full px-4"
                      >
                        <tab.icon className="mr-2 h-4 w-4" />
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <Form
                  className="text-black flex flex-col md:flex-row gap-4 bg-white/95 p-4 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto border border-white/40 transition focus-within:ring-2 focus-within:ring-primary/40"
                  aria-busy={isSubmitting || isPending}
                >
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="search-name" className="sr-only">
                      Search by name
                    </Label>
                    <Input
                      id="search-name"
                      name="name"
                      placeholder="Search by name"
                      value={values.name}
                      onChange={handleChange}
                      aria-label="Search by name"
                      autoComplete="off"
                      className="h-12 text-base bg-white/90"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="search-location" className="sr-only">
                      Search by location
                    </Label>
                    <Input
                      id="search-location"
                      name="location"
                      placeholder="Search by location"
                      value={values.location}
                      onChange={handleChange}
                      aria-label="Search by location"
                      autoComplete="off"
                      className="h-12 text-base bg-white/90"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-primary text-white w-full md:w-auto h-12 px-6 text-base font-semibold transition-transform duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    {isPending ? "Searching..." : "Search"}
                  </Button>
                </Form>
                <div aria-live="polite" className="min-h-[20px] text-center">
                  {isPending ? (
                    <span className="text-xs text-primary-foreground/80">
                      Searching for the best matches...
                    </span>
                  ) : errors.form ? (
                    <span className="text-xs text-red-100" role="alert">
                      {errors.form}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          }}
        </Formik>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
