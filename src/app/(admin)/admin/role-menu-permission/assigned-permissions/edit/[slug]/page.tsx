import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedPermissionsCreateUpdate } from "@/components/features/admin/role-menu-permission/assigned-permissions/add/assigned-permissions-create-update.component";
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
          <CardTitle>Role Permission Assignment</CardTitle>
          <CardDescription>
            Select a role and assign permissions to it
          </CardDescription>
        </CardHeader>
        <AssignedPermissionsCreateUpdate id={params.slug} />
      </div>
    </RequirePlatformAdmin>
  );
}
