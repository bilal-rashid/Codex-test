import { ReportDistribution, StaffMember } from "@/lib/types";

export const calculateDistribution = (totalTips: number, activeStaff: StaffMember[]): ReportDistribution[] => {
  if (!activeStaff.length) return [];
  const perStaffShare = totalTips / activeStaff.length;

  return activeStaff.map((member) => ({
    staffId: member.id,
    shareAmount: Number(perStaffShare.toFixed(2))
  }));
};
