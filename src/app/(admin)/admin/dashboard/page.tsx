import { StatsCards } from "./_components/stats-cards";
import { RevenueChart } from "./_components/revenue-chart";
import { RecentUsersTable } from "./_components/recent-users-table";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-rozha text-3xl text-[#181D27]">Dashboard</h2>
      <StatsCards />
      <RevenueChart />
      <RecentUsersTable />
    </div>
  );
}
