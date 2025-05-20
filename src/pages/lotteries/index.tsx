import { Layout } from "@/components/Layout/Layout";
import * as LotteryList from "@/components/LotteryList/LotteryList";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export default function AllLotteriesPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <Layout>
      <LotteryList.default {...props} />
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await LotteryList.getServerSideProps(context);
}
