import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedRolesCreateUpdate } from "@/components/features/admin/role-menu-permission/assigned-roles/add/assigned-roles-create-update.component";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

export default function AssignPermission({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <RequirePlatformAdmin>
      <div>
        <CardHeader>
          <CardTitle>Platform Role Assignment</CardTitle>
          <CardDescription>
            Update the selected user&apos;s platform role. Tenant owner and staff membership are managed separately.
          </CardDescription>
        </CardHeader>
        <AssignedRolesCreateUpdate id={params.slug} />
      </div>
    </RequirePlatformAdmin>
  );
}
