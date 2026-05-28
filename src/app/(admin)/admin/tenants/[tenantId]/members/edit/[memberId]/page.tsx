import { redirect } from "next/navigation";

export default function EditTenantMemberPage({
  params,
}: {
  params: { memberId: string };
}) {
  redirect(`/workspace/team/edit/${params.memberId}`);
}
