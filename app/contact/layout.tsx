import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header scrollY={0} isLoaded={true} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
} 