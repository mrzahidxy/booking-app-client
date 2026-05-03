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
    const errors: Record<string, string> = {};
    if (!values.name.trim() && !values.location.trim()) {
      errors.name = "Enter a name or location to search.";
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
    <section className="relative overflow-hidden text-primary-foreground">
      <Image
        src="/images/main-banner.jpg"
        alt="Scenic travel destination"
        fill
        priority
        className="object-cover opacity-90"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/55 to-primary/45" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      <div className="relative z-10 container mx-auto px-4 pb-24 pt-16 sm:pb-28 sm:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4 max-w-3xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Trusted hotel and dining bookings
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Your perfect stay awaits
            </h2>
            <p className="text-base leading-7 text-primary-foreground/80 sm:text-lg">
              Find and book hotels & restaurants worldwide
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ values, errors, handleChange, setFieldValue, isSubmitting }) => {
              const isDisabled =
                (!values.name.trim() && !values.location.trim()) || isSubmitting || isPending;
              return (
                <div className="w-full space-y-4">
                  <Tabs
                    defaultValue="hotels"
                    aria-label="Search category"
                    onValueChange={(value) => setFieldValue("type", value as SearchType)}
                  >
                    <TabsList className="border border-white/15 bg-white/10 p-1 shadow-sm backdrop-blur">
                      {[
                        { value: "hotels", label: "Hotels", icon: Hotel },
                        { value: "restaurants", label: "Restaurants", icon: Utensils },
                      ].map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="rounded-full px-4 text-primary-foreground/80 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                        >
                          <tab.icon className="mr-2 h-4 w-4" />
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <Form
                    className="flex w-full max-w-4xl flex-col gap-4 rounded-3xl border border-white/25 bg-white/95 p-4 text-foreground shadow-2xl shadow-slate-950/20 transition focus-within:ring-2 focus-within:ring-primary/40 md:flex-row md:p-5"
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
                        className="h-12 bg-white/90 text-base"
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
                        className="h-12 bg-white/90 text-base"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-12 w-full px-6 text-base font-semibold md:w-auto"
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
                    ) : errors.name ? (
                      <span className="text-xs text-red-100" role="alert">
                        {errors.name}
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
