"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Send,
  RefreshCw,
  Archive,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle
} from "lucide-react"

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

interface BulkActionsProps {
  selectedSubmissions: ContactSubmission[]
  onBulkStatusUpdate: (ids: string[], newStatus: string) => Promise<void>
  onBulkSendToHubSpot: (submissions: ContactSubmission[]) => Promise<void>
  onClearSelection: () => void
}

export default function BulkActions({
  selectedSubmissions,
  onBulkStatusUpdate,
  onBulkSendToHubSpot,
  onClearSelection
}: BulkActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleBulkStatusUpdate = async () => {
    if (!selectedStatus || selectedSubmissions.length === 0) return

    setIsUpdating(true)
    try {
      const ids = selectedSubmissions.map(s => s._id)
      await onBulkStatusUpdate(ids, selectedStatus)
      setSelectedStatus("")
    } catch (error) {
      console.error("Error updating bulk status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBulkSendToHubSpot = async () => {
    if (selectedSubmissions.length === 0) return

    setIsSending(true)
    try {
      const completeSubmissions = selectedSubmissions.filter(s =>
        s.submissionStatus === 'complete' && !s.sentToHubSpot
      )

      if (completeSubmissions.length === 0) {
        alert("Aucun lead complet non envoyé à HubSpot sélectionné")
        return
      }

      await onBulkSendToHubSpot(completeSubmissions)
    } catch (error) {
      console.error("Error sending bulk to HubSpot:", error)
    } finally {
      setIsSending(false)
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'in-progress': return 'En cours'
      case 'completed': return 'Terminé'
      case 'archived': return 'Archivé'
      default: return status
    }
  }

  if (selectedSubmissions.length === 0) return null

  const completeSubmissions = selectedSubmissions.filter(s =>
    s.submissionStatus === 'complete' && !s.sentToHubSpot
  )
  const partialSubmissions = selectedSubmissions.filter(s =>
    s.submissionStatus === 'partial'
  )
  const alreadyInHubSpot = selectedSubmissions.filter(s => s.sentToHubSpot)

  return (
    <div className="bg-white rounded-xl shadow-lg border-0 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="default" className="bg-[var(--color-main)]/10 text-[var(--color-main)] border-[var(--color-main)]/20">
            {selectedSubmissions.length} leads sélectionnés
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-[var(--color-main)] hover:text-[var(--color-main)]/80 hover:bg-[var(--color-main)]/5"
          >
            Effacer la sélection
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {completeSubmissions.length} complets, {partialSubmissions.length} partiels, {alreadyInHubSpot.length} déjà dans HubSpot
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bulk Status Update */}
        <div className="flex items-center gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full border-gray-200 focus:border-[var(--color-main)] focus:ring-[var(--color-main)]/20">
              <SelectValue placeholder="Mettre à jour le statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">
                <div className="flex items-center gap-2">
                  {getStatusIcon('pending')}
                  {getStatusLabel('pending')}
                </div>
              </SelectItem>
              <SelectItem value="in-progress">
                <div className="flex items-center gap-2">
                  {getStatusIcon('in-progress')}
                  {getStatusLabel('in-progress')}
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center gap-2">
                  {getStatusIcon('completed')}
                  {getStatusLabel('completed')}
                </div>
              </SelectItem>
              <SelectItem value="archived">
                <div className="flex items-center gap-2">
                  {getStatusIcon('archived')}
                  {getStatusLabel('archived')}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleBulkStatusUpdate}
            disabled={!selectedStatus || isUpdating}
            size="sm"
            className="whitespace-nowrap bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white"
          >
            {isUpdating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Mettre à jour
          </Button>
        </div>

        {/* Bulk Send to HubSpot */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleBulkSendToHubSpot}
            disabled={completeSubmissions.length === 0 || isSending}
            variant="outline"
            size="sm"
            className="whitespace-nowrap border-[var(--color-main)] hover:bg-[var(--color-main)]/10 text-[var(--color-main)]"
          >
            {isSending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Envoyer {completeSubmissions.length} à HubSpot
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkStatusUpdate(selectedSubmissions.map(s => s._id), 'archived')}
            className="whitespace-nowrap border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            <Archive className="w-4 h-4 mr-2" />
            Archiver tous
          </Button>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <strong>Résumé de la sélection:</strong>
          <ul className="mt-2 space-y-1">
            {completeSubmissions.length > 0 && (
              <li>• {completeSubmissions.length} leads complets prêts pour HubSpot</li>
            )}
            {partialSubmissions.length > 0 && (
              <li>• {partialSubmissions.length} leads partiels (attendre la complétion)</li>
            )}
            {alreadyInHubSpot.length > 0 && (
              <li>• {alreadyInHubSpot.length} leads déjà synchronisés avec HubSpot</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

