"use client";

import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import DefaultLoader from "./DefaultLoacer.component";

interface ReviewListProps {
  id: number;
  type: "hotel" | "restaurant";
}

// Function to fetch data from the API
const fetchData = async (
  type: "hotel" | "restaurant",
  page: number,
  limit: number,
  id: number
) => {
  const response = await privateRequest.get(
    `/reviews?page=${page}&limit=${limit}?&${type}Id=${id}`
  );

  if (!response || response.status !== 200) {
    throw new Error(`Failed to fetch reviews for ${type}`);
  }

  return response.data;
};

export function ReviewList({ id, type }: ReviewListProps) {
  // Fetch data using react-query
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchData(type, 1, 10, id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Display loading state
  if (isLoading)
    return (
      <div className="">
        <DefaultLoader showImage={false} />
      </div>
    );

  // Display error state
  if (isError) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="space-y-4">
      {/* Existing review */}

      <div className="space-y-4">
        {reviews?.data?.data?.map((review: any) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
                  {review.rating}
                </Badge>
                <span className="text-sm font-medium">{review.user.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{review.review}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
