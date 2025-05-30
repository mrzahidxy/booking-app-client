"use client"

import { Form } from "formik"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormikInputField, FormikSubmitButton } from "@/components/form"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface ProfileEditFormProps {
  onCancel: () => void
}

export const ProfileEditForm = ({ onCancel }: ProfileEditFormProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Edit Profile Information
        </CardTitle>
      </CardHeader>

      <Form>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <FormikInputField
            name="name"
            inputFieldProps={{
              label: "Full Name",
              placeholder: "Enter your full name",
              inputClassName: "h-11",
            }}
          />

          {/* Email Field */}
          <FormikInputField
            name="email"
            inputFieldProps={{
              label: "Email Address",
              placeholder: "Enter your email address",
              inputClassName: "h-11",
              type: "email",
            }}
          />

          {/* Phone Field */}
          <FormikInputField
            name="phone"
            inputFieldProps={{
              label: "Phone Number",
              placeholder: "Enter your phone number (optional)",
              inputClassName: "h-11",
              type: "tel",
            }}
          />
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <FormikSubmitButton text="Update Profile" />
        </CardFooter>
      </Form>
    </Card>
  )
}
