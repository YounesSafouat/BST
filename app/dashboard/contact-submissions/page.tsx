"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Loader from "@/components/home/Loader"

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/contact")
      const data = await response.json()
      setSubmissions(data)
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      // Update local state
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === id ? { ...submission, status: newStatus } : submission
        )
      )
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages de Contact</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Gérez les messages reçus via le formulaire de contact
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Date</TableHead>
                <TableHead className="text-xs sm:text-sm">Nom</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Email</TableHead>
                <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Téléphone</TableHead>
                <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Entreprise</TableHead>
                <TableHead className="text-xs sm:text-sm">Message</TableHead>
                <TableHead className="text-xs sm:text-sm">Statut</TableHead>
                <TableHead className="text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="text-xs sm:text-sm">
                    {format(new Date(submission.createdAt), "dd MMM yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">{submission.name}</span>
                      <span className="text-gray-500 text-xs sm:hidden">{submission.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                    <span className="truncate block max-w-[150px]">{submission.email}</span>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                    {submission.phone || "-"}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                    {submission.company || "-"}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm max-w-[120px] sm:max-w-xs truncate">
                    {submission.message}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={submission.status}
                      onValueChange={(value) => updateStatus(submission.id, value)}
                    >
                      <SelectTrigger className="w-[100px] sm:w-[140px] text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nouveau</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Add view details functionality
                      }}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                    >
                      Voir détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
} 