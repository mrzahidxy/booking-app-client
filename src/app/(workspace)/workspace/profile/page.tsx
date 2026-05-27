import { RequireWorkspace } from "@/components/features/workspace/RequireWorkspace";
import { ProfileView } from "@/components/features/profile/profile-view.component";

const WorkspaceProfile = () => {
  return (
    <RequireWorkspace>
      <ProfileView mode="admin" />
    </RequireWorkspace>
  );
};

export default WorkspaceProfile;
