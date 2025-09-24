"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Send,
  Database,
  Download
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Loader from "@/components/home/Loader"
import LeadDetailsModal from "@/components/dashboard/LeadDetailsModal"
import BulkActions from "@/components/dashboard/BulkActions"

interface ContactSubmission {
  _id: string
  name: string
  firstname: string
  lastname: string
  email: string
  phone: string
  company: string
  message: string
  submissionStatus: 'partial' | 'complete'
  status: string
  sentToHubSpot: boolean
  hubspotContactId?: string
  hubspotSyncDate?: string
  brief_description?: string
  fieldsFilled: {
    name: boolean
    firstname: boolean
    lastname: boolean
    email: boolean
    phone: boolean
    company: boolean
    message: boolean
  }
  countryCode: string
  countryName: string
  source: string
  page: string
  createdAt: string
  updatedAt: string
}

interface LeadStats {
  total: number
  partial: number
  complete: number
  sentToHubSpot: number
  notInHubSpot: number
}

export default function LeadsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    partial: 0,
    complete: 0,
    sentToHubSpot: 0,
    notInHubSpot: 0
  })

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [hubspotFilter, setHubspotFilter] = useState<string>("all")
  const [submissionFilter, setSubmissionFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [submissions, searchTerm, statusFilter, hubspotFilter, submissionFilter, countryFilter])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/contact")
      const data = await response.json()
      setSubmissions(data)
      calculateStats(data)
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: ContactSubmission[]) => {
    const stats: LeadStats = {
      total: data.length,
      partial: data.filter(s => s.submissionStatus === 'partial').length,
      complete: data.filter(s => s.submissionStatus === 'complete').length,
      sentToHubSpot: data.filter(s => s.sentToHubSpot).length,
      notInHubSpot: data.filter(s => !s.sentToHubSpot).length
    }
    setStats(stats)
  }

  const applyFilters = () => {
    let filtered = submissions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter)
    }

    // HubSpot filter
    if (hubspotFilter !== "all") {
      if (hubspotFilter === "sent") {
        filtered = filtered.filter(s => s.sentToHubSpot)
      } else {
        filtered = filtered.filter(s => !s.sentToHubSpot)
      }
    }

    // Submission status filter
    if (submissionFilter !== "all") {
      filtered = filtered.filter(s => s.submissionStatus === submissionFilter)
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter(s => s.countryCode === countryFilter)
    }

    setFilteredSubmissions(filtered)
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
          submission._id === id ? { ...submission, status: newStatus } : submission
        )
      )
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const sendToHubSpot = async (submission: ContactSubmission) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: submission.email,
          firstname: submission.firstname,
          lastname: submission.lastname,
          phone: submission.phone,
          company: submission.company,
          message: submission.message,
          countryCode: submission.countryCode,
          countryName: submission.countryName,
          source: submission.source,
          page: submission.page,
          brief_description: submission.brief_description
        }),
      })

      if (response.ok) {
        // Refresh data
        fetchSubmissions()
      }
    } catch (error) {
      console.error("Error sending to HubSpot:", error)
    }
  }

  const openModal = (submission: ContactSubmission) => {
    setSelectedSubmission(submission)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSubmission(null)
  }

  const handleBulkStatusUpdate = async (ids: string[], newStatus: string) => {
    try {
      const promises = ids.map(id =>
        fetch(`/api/contact/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })
      )

      await Promise.all(promises)

      // Update local state
      setSubmissions((prev) =>
        prev.map((submission) =>
          ids.includes(submission._id)
            ? { ...submission, status: newStatus }
            : submission
        )
      )

      // Clear selection
      setSelectedSubmissions([])
    } catch (error) {
      console.error("Error updating bulk status:", error)
    }
  }

  const handleBulkSendToHubSpot = async (submissions: ContactSubmission[]) => {
    try {
      const promises = submissions.map(submission =>
        fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: submission.email,
            firstname: submission.firstname,
            lastname: submission.lastname,
            phone: submission.phone,
            company: submission.company,
            message: submission.message,
            countryCode: submission.countryCode,
            countryName: submission.countryName,
            source: submission.source,
            page: submission.page,
            brief_description: submission.brief_description
          }),
        })
      )

      await Promise.all(promises)

      // Refresh data
      fetchSubmissions()

      // Clear selection
      setSelectedSubmissions([])
    } catch (error) {
      console.error("Error sending bulk to HubSpot:", error)
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedSubmissions(prev =>
      prev.includes(id)
        ? prev.filter(subId => subId !== id)
        : [...prev, id]
    )
  }

  const clearSelection = () => {
    setSelectedSubmissions([])
  }

  const exportToCSV = async () => {
    try {
      // Build query parameters based on current filters
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(hubspotFilter !== 'all' && { hubspot: hubspotFilter }),
        ...(submissionFilter !== 'all' && { submission: submissionFilter }),
        ...(countryFilter !== 'all' && { country: countryFilter })
      });

      const response = await fetch(`/api/leads/export?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      // Get the CSV content
      const csvContent = await response.text();
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('CSV export successful');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Erreur lors de l\'export CSV');
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'in-progress': return <AlertCircle className="w-4 h-4 text-blue-500" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'archived': return <XCircle className="w-4 h-4 text-gray-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case 'partial':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Partiel</Badge>
      case 'complete':
        return <Badge variant="default" className="bg-green-100 text-green-800">Complet</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getHubSpotBadge = (sent: boolean, contactId?: string) => {
    if (sent && contactId) {
      return (
        <Badge variant="default" className="bg-[var(--color-main)]/10 text-[var(--color-main)] border-[var(--color-main)]/20">
          <Database className="w-3 h-3 mr-1" />
          Envoyé
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        Non envoyé
      </Badge>
    )
  }

  if (loading) {
    return <Loader />
  }

  // Show error state if no submissions and not loading
  if (submissions.length === 0 && !loading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-4 sm:py-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Leads</h1>
          <p className="text-gray-600 mt-2">
            Gérez tous vos contacts et leads avec intégration HubSpot
          </p>
        </div>

        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun lead trouvé</h3>
            <p className="text-gray-600 mb-4">
              Aucun contact n'a encore été soumis ou il y a eu un problème de chargement.
            </p>
            <Button onClick={fetchSubmissions} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const uniqueCountries = [...new Set(submissions.map(s => s.countryCode))].sort()

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Leads</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Gérez tous vos contacts et leads avec intégration HubSpot
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
            <div className="text-sm text-gray-600">Partiels</div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
            <div className="text-sm text-gray-600">Complets</div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[var(--color-main)]">{stats.sentToHubSpot}</div>
            <div className="text-sm text-gray-600">HubSpot</div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.notInHubSpot}</div>
            <div className="text-sm text-gray-600">À envoyer</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white rounded-xl shadow-lg border-0 mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Filter className="w-5 h-5 text-[var(--color-main)]" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]/20"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]/20">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hubspotFilter} onValueChange={setHubspotFilter}>
              <SelectTrigger className="border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]/20">
                <SelectValue placeholder="HubSpot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="sent">Envoyés</SelectItem>
                <SelectItem value="not-sent">Non envoyés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={submissionFilter} onValueChange={setSubmissionFilter}>
              <SelectTrigger className="border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]/20">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="partial">Partiels</SelectItem>
                <SelectItem value="complete">Complets</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]/20">
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {filteredSubmissions.length} leads affichés sur {submissions.length} total
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="border-[var(--color-main)] hover:bg-[var(--color-main)]/10 text-[var(--color-main)]"
            disabled={filteredSubmissions.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
          <Button
            onClick={fetchSubmissions}
            variant="outline"
            size="sm"
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedSubmissions={filteredSubmissions.filter(s => selectedSubmissions.includes(s._id))}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkSendToHubSpot={handleBulkSendToHubSpot}
        onClearSelection={clearSelection}
      />

      {/* Leads Table */}
      <Card className="bg-white rounded-xl shadow-lg border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="text-xs w-12">
                    <input
                      type="checkbox"
                      checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubmissions(filteredSubmissions.map(s => s._id))
                        } else {
                          setSelectedSubmissions([])
                        }
                      }}
                      className="rounded border-gray-300 focus:ring-[var(--color-main)]/20 focus:border-[var(--color-main)]"
                      aria-label="Sélectionner tous les leads"
                    />
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700">Contact</TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700 hidden lg:table-cell">Email</TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700 hidden lg:table-cell">Téléphone</TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700 hidden lg:table-cell">Entreprise</TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700">Type</TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700">Statut</TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700">HubSpot</TableHead>
                  <TableHead className="text-xs sm:text-sm text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission._id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="text-xs w-12">
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.includes(submission._id)}
                        onChange={() => toggleSelection(submission._id)}
                        className="rounded border-gray-300 focus:ring-[var(--color-main)]/20 focus:border-[var(--color-main)]"
                        aria-label={`Sélectionner le lead ${submission.firstname || submission.name || 'sans nom'}`}
                      />
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {format(new Date(submission.createdAt), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {submission.firstname && submission.lastname
                            ? `${submission.firstname} ${submission.lastname}`
                            : submission.name || "N/A"
                          }
                        </span>
                        <span className="text-gray-500 text-xs">
                          {submission.countryName} ({submission.countryCode})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[150px] text-gray-700">{submission.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700">{submission.phone || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[120px] text-gray-700">{submission.company || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getSubmissionStatusBadge(submission.submissionStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(submission.status)}
                        <span className="text-xs text-gray-700">{submission.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getHubSpotBadge(submission.sentToHubSpot, submission.hubspotContactId)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModal(submission)}
                          className="h-7 px-2 border-gray-200 hover:bg-gray-50 text-gray-700"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        {submission.hubspotContactId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://app-eu1.hubspot.com/contacts/${submission.hubspotContactId}/record/0-1/421747089632`, '_blank')}
                            className="h-7 px-2 border-gray-200 hover:bg-gray-50 text-gray-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                        {!submission.sentToHubSpot && submission.submissionStatus === 'complete' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendToHubSpot(submission)}
                            className="h-7 px-2 border-[var(--color-main)] hover:bg-[var(--color-main)]/10 text-[var(--color-main)]"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <Card className="bg-white rounded-xl shadow-lg border-0 mt-6">
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun lead trouvé</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || hubspotFilter !== "all" || submissionFilter !== "all" || countryFilter !== "all"
                ? "Essayez de modifier vos filtres de recherche"
                : "Aucun contact n'a encore été soumis"
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      {selectedSubmission && (
        <LeadDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          submission={selectedSubmission}
          onSendToHubSpot={sendToHubSpot}
        />
      )}
    </div>
  )
}
