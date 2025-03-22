import { HotelCreateUpdate } from "./hotels-create-update.component";
import CommonLayout from "@/components/common/CommonLayout.component";

export default function AddHotel() {
  return (
    <CommonLayout
      title="Add Hotel"
      description="Enter the details of the new hotel you want to add to your system."
    >
      <HotelCreateUpdate />
    </CommonLayout>
  );
}
