import CommonLayout from "@/components/common/CommonLayout.component";
import { RestaurantCreateUpdate } from "../../add/restuarant-create-update.component";

export default function UpdateHotel({
  params,
}: {
  params: { slug: string };
}) {
  return (
       <CommonLayout
         title="Update Hotel"
         description="Enter the details of the new hotel you want to add to your system."
       >
         <RestaurantCreateUpdate id={params.slug} />
       </CommonLayout>
  );
}
