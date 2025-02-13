'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarDays, Users } from 'lucide-react'
import { cn } from "@/lib/utils"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  room: {
    id: number
    roomType: string
    price: number
  }
}

export function BookingModal({ isOpen, onClose, room }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [bookingDate, setBookingDate] = useState<Date>()
  const [partySize, setPartySize] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleBooking = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const bookingData = {
        roomId: room.id,
        bookingDate: bookingDate,
        totalPrice: room.price,
        partySize: partySize,
        status: 'PENDING'
      }
      
      console.log('Booking data:', bookingData)
      onClose()
      setStep(1)
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book {room.roomType} Room</DialogTitle>
          <DialogDescription>
            Complete your booking details below
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {step === 1 ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="date">Select Date</Label>
                <div className="grid gap-2">
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !bookingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
                  </Button>
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={setBookingDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="party-size">Number of Guests</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPartySize(Math.max(1, partySize - 1))}
                  >
                    -
                  </Button>
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md">
                    <Users className="h-4 w-4" />
                    <span>{partySize}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPartySize(Math.min(4, partySize + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!bookingDate}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid gap-1">
                  <Label>Booking Summary</Label>
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Type</span>
                      <span className="font-medium">{room.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{bookingDate ? format(bookingDate, "PPP") : "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-medium">{partySize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per night</span>
                      <span className="font-medium">${room.price}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">${room.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleBooking}
                    disabled={loading}
                  >
                    {loading ? "Confirming..." : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

