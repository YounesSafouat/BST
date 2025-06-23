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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages de Contact</h1>
        <p className="text-gray-600 mt-2">
          Gérez les messages reçus via le formulaire de contact
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  {format(new Date(submission.createdAt), "dd MMM yyyy", {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.phone || "-"}</TableCell>
                <TableCell>{submission.company || "-"}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {submission.message}
                </TableCell>
                <TableCell>
                  <Select
                    value={submission.status}
                    onValueChange={(value) => updateStatus(submission.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
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
  )
} 