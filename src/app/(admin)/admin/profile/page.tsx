import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";
import { ProfileView } from "@/components/features/profile/profile-view.component";

const Profile = () => {
  return (
    <RequirePlatformAdmin>
      <ProfileView mode="admin" />
    </RequirePlatformAdmin>
  );
};

export default Profile;
