import { BookingList } from "@/components/features/workspace/booking/booking-list.component";
import { RequireWorkspace } from "@/components/features/workspace/RequireWorkspace";

export default function WorkspaceBookingPage() {
  return (
    <RequireWorkspace>
      <BookingList />
    </RequireWorkspace>
  );
}
