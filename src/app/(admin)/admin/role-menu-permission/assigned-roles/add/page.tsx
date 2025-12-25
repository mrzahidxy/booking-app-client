import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedRolesCreateUpdate } from "@/components/features/admin/role-menu-permission/assigned-roles/add/assigned-roles-create-update.component";

export default function AssignPermission() {
  return (
    <div>
      <CardHeader>
        <CardTitle>Role Permission Assignment</CardTitle>
        <CardDescription>
          Select a role and assign permissions to it
        </CardDescription>
      </CardHeader>
      <AssignedRolesCreateUpdate id="0" />
    </div>
  );
}
