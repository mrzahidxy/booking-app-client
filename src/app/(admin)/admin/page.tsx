import { AdminDashboard as AdminDashboardView } from "@/components/features/admin/AdminDashboard.component";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

const AdminDashboard = () => {
  return (
    <RequirePlatformAdmin>
      <AdminDashboardView />
    </RequirePlatformAdmin>
  );
};

export default AdminDashboard;
