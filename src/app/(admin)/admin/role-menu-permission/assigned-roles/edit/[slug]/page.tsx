import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedRolesCreateUpdate } from "../../add/assigned-roles-create-update.component";

export default function AssignPermission({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Role Permission Assignment</CardTitle>
        <CardDescription>
          Select a role and assign permissions to it
        </CardDescription>
      </CardHeader>
      <AssignedRolesCreateUpdate id={params.slug} />
    </div>
  );
}
