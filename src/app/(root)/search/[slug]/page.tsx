import { Suspense } from "react";
import SearchComponent from "../Search.conponent";


const SearchPage = ({ params }: { params: { slug: string } }) => {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <SearchComponent type={params.slug} />
    </Suspense>
  );
};

export default SearchPage;
