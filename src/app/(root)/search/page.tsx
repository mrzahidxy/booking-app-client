import { Suspense } from "react";
import SearchComponent from "./Search.conponent";

const SearchPage = () => {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <SearchComponent />
    </Suspense>
  );
};

export default SearchPage;
