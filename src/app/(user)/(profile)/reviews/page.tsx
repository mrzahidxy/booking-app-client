"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchCurrentUser } from "@/features/users/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DefaultLoader from "@/components/common/DefaultLoacer.component";

type ReviewItem = {
  id: number;
  hotelId?: number | null;
  restaurantId?: number | null;
  rating: number;
  review: string;
  createdAt: string;
};

const ReviewsPage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-profile", userId, "reviews"],
    queryFn: () => fetchCurrentUser(),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: true,
  });

  if (isLoading) {
    return <DefaultLoader showImage={false} />;
  }

  if (isError) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <p className="text-red-500">Error loading reviews: {error?.message}</p>
      </div>
    );
  }

  const reviews = (data?.review ?? []) as ReviewItem[];

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Review History</h1>
        <p className="text-muted-foreground mt-1">
          Your feedback on hotels and restaurants.
        </p>
      </div>

      {reviews.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            You have not written any reviews yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => {
            const target =
              review.hotelId != null
                ? `Hotel #${review.hotelId}`
                : review.restaurantId != null
                  ? `Restaurant #${review.restaurantId}`
                  : "Experience";
            const date = new Date(review.createdAt).toLocaleDateString();

            return (
              <Card key={review.id} className="shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{target}</CardTitle>
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      {review.rating}/5
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Reviewed on {date}</p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 text-sm text-muted-foreground">
                  {review.review}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
