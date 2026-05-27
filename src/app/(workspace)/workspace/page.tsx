import { RequireWorkspace } from "@/components/features/workspace/RequireWorkspace";
import { WorkspaceDashboard as WorkspaceDashboardView } from "@/components/features/workspace/WorkspaceDashboard.component";

const WorkspaceDashboardPage = () => {
  return (
    <RequireWorkspace>
      <WorkspaceDashboardView />
    </RequireWorkspace>
  );
};

export default WorkspaceDashboardPage;
