import { Suspense } from "react";
import SearchComponent from "@/components/features/search/Search.conponent";
import type { SearchType } from "@/features/search/types";


const SearchPage = ({ params }: { params: { slug: string } }) => {
  const type: SearchType = params.slug === "restaurants" ? "restaurants" : "hotels";
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <SearchComponent type={type} />
    </Suspense>
  );
};

export default SearchPage;
