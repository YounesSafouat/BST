import { notFound } from "next/navigation"
import ClientDetailPageV1 from "@/components/cas-client/ClientDetailPageV1"
import ClientDetailPageV2 from "@/components/cas-client/ClientDetailPageV2"
import ClientDetailPageV3 from "@/components/cas-client/ClientDetailPageV3"
import ClientDetailPageV4 from "@/components/cas-client/ClientDetailPageV4"

export default async function ClientPage({ params }: { params: { slug: string } }) {

  return <ClientDetailPageV4 slug={params.slug} />
} 