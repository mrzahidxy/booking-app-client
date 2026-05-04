"use client"

import { Formik, type FormikHelpers } from "formik"
import { type UserProfileUpdate, UserProfileSchema, UserProfileInitialValues } from "./form.config"
import { fetchCurrentUser, updateCurrentUser, UpdateUserPayload } from "@/features/users/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/shared/hooks/use-toast"
import { useSession } from "next-auth/react"
import DefaultLoader from "@/components/common/DefaultLoacer.component"
import { ProfileEditForm } from "./profile-edit-form.component"


interface ProfileEditProps {
  onCancel: () => void
}

export const ProfileEdit = ({ onCancel }: ProfileEditProps) => {
  const { toast } = useToast()
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const userId = session?.user?.id

  // Fetch user profile data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => fetchCurrentUser(),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: true,
  })

  // Handle form submission
  const mutation = useMutation({
    mutationFn: async (values: UserProfileUpdate) => {
      const { id: _id, ...payload } = values
      // Clean payload by removing null values to match API requirements
      const cleanPayload: UpdateUserPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== null)
      )
      return await updateCurrentUser(cleanPayload)
    },
  })

  const handleSubmit = async (
    values: UserProfileUpdate,
    { setSubmitting }: FormikHelpers<UserProfileUpdate>
  ) => {
    try {
      await mutation.mutateAsync(values)
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] })
      onCancel() // Return to view mode
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return <DefaultLoader showImage={false} />
  }

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-destructive">Error loading profile: {error?.message}</p>
      </div>
    )
  }

  return (
    <Formik
      initialValues={
        data
          ? {
            id: data.id ?? null,
            name: data.name ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
          }
          : UserProfileInitialValues
      }
      validationSchema={UserProfileSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <ProfileEditForm onCancel={onCancel} />
    </Formik>
  )
}
