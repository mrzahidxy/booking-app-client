import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedPermissionsCreateUpdate } from "@/components/features/admin/role-menu-permission/assigned-permissions/add/assigned-permissions-create-update.component";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

export default function AssignPermissionPage() {
  return (
    <RequirePlatformAdmin>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Assign permissions</CardTitle>
          <CardDescription>
            Select a role and choose the permissions it should carry.
          </CardDescription>
        </CardHeader>
        <AssignedPermissionsCreateUpdate id="0" />
      </Card>
    </RequirePlatformAdmin>
  );
}
