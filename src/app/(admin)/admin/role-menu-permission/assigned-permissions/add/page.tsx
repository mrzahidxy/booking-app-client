import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedPermissionsCreateUpdate } from "./assigned-permissions-create-update.component";

export default function AssignPermission() {
  return (
    <div>
      <CardHeader>
        <CardTitle>Role Permission Assignment</CardTitle>
        <CardDescription>
          Select a role and assign permissions to it
        </CardDescription>
      </CardHeader>
      <AssignedPermissionsCreateUpdate id="0" />
    </div>
  );
}
