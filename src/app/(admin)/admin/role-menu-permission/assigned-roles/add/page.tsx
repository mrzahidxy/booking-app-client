import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedRolesCreateUpdate } from "@/components/features/admin/role-menu-permission/assigned-roles/add/assigned-roles-create-update.component";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

export default function AssignRolePage() {
  return (
    <RequirePlatformAdmin>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Assign platform role</CardTitle>
          <CardDescription>
            Select a user and assign a platform role. Tenant owner and staff membership are managed from tenant members.
          </CardDescription>
        </CardHeader>
        <AssignedRolesCreateUpdate id="0" />
      </Card>
    </RequirePlatformAdmin>
  );
}
