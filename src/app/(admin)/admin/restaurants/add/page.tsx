import { RestaurantCreateUpdate } from "./restuarant-create-update.component";
import CommonLayout from "@/components/common/CommonLayout.component";

export default function AddRestaurant() {
  return (
    <CommonLayout
      title="Add Restaurant"
      description="Enter the details of the new hotel you want to add to your system."
    >
      <RestaurantCreateUpdate />
    </CommonLayout>
  );
}
