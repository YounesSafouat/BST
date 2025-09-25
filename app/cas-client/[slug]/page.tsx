import { notFound } from "next/navigation"
import ClientDetailPage from "@/components/cas-client/ClientDetailPage"

export default async function ClientPage({ params }: { params: { slug: string } }) {

  return <ClientDetailPage slug={params.slug} />
} 