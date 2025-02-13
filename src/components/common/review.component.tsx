"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DefaultLoader from "../common/DefaultLoacer.component";
import queryClient from "@/app/config/queryClient";
import { ReviewList } from "./review-list.component";

interface ReviewFormProps {
  id: number;
  type: "hotel" | "restaurant";
}

// API call function
const submitReview = async (data: {
  userId: number;
  id: number;
  type: "hotel" | "restaurant";
  rating: number;
  review: string;
}) => {
  try {
    const response = await privateRequest.post("/reviews", {
      userId: data.userId,
      rating: data.rating,
      review: data.review,
      [data.type + "Id"]: data.id,
    });

    if (!response || response.status !== 200) {
      throw new Error("Failed to submit review");
    }

    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
  }
};

export function Review({ id, type }: ReviewFormProps) {
  const { data } = useSession();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      setRating(0);
      setReview("");
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
    },
    onError: () => {
      alert("Failed to submit review. Please try again.");
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      userId: +data?.user.id,
      id: id,
      type,
      rating,
      review,
    });
  };

  return (
    <div className="space-y-4">
      {/* Sample Review */}
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={cn(
                      "p-1",
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    )}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here..."
                className="mt-1"
                required
              />
            </div>
            {mutation.isError && (
              <p className="text-red-500 text-sm">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : "Failed to submit review. Please try again."}
              </p>
            )}
            <Button
              type="submit"
              disabled={mutation.isPaused || rating === 0 || !review.trim()}
            >
              {mutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ReviewList id={id} type={type} />
    </div>
  );
}
