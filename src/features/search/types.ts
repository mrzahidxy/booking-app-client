export type SearchType = "hotels" | "restaurants";

export type SearchParams = {
  query: string;
  page?: number;
  limit?: number;
};

export type SearchFormValues = {
  name: string;
  location: string;
  type: SearchType;
};
