import { CreateGame } from "@/components/CreateLottery/CreateLottery";
import { Layout } from "@/components/Layout/Layout";
import { LotteryDashboard } from "@/components/LotteryDashboard/LotteryDashboard";

export default function LotteriesPage() {
  return (
    <Layout>
      <CreateGame />
      <LotteryDashboard />
    </Layout>
  );
}
