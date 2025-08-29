"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  X,
  ExternalLink,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Mail,
  Phone,
  Building2,
  User,
  MapPin,
  Calendar,
  Database,
  Eye,
  MessageSquare
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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

interface LeadDetailsModalProps {
  submission: ContactSubmission | null
  isOpen: boolean
  onClose: () => void
  onSendToHubSpot: (submission: ContactSubmission) => void
}

export default function LeadDetailsModal({
  submission,
  isOpen,
  onClose,
  onSendToHubSpot
}: LeadDetailsModalProps) {
  if (!isOpen || !submission) return null

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
        <Badge variant="default" className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Database className="w-3 h-3" />
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

  const getFieldStatusIcon = (filled: boolean) => {
    return filled ?
      <CheckCircle className="w-4 h-4 text-green-500" /> :
      <XCircle className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Détails du Lead</h2>
            <p className="text-gray-600 mt-1">
              {submission.firstname && submission.lastname
                ? `${submission.firstname} ${submission.lastname}`
                : submission.name || "Contact sans nom"
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {submission.hubspotContactId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://app-eu1.hubspot.com/contacts/${submission.hubspotContactId}/record/0-1/421747089632`, '_blank')}
                className="flex items-center gap-2 border-[var(--color-main)] hover:bg-[var(--color-main)]/10 text-[var(--color-main)]"
              >
                <ExternalLink className="w-4 h-4" />
                Voir dans HubSpot
              </Button>
            )}
            {!submission.sentToHubSpot && submission.submissionStatus === 'complete' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onSendToHubSpot(submission)}
                className="flex items-center gap-2 bg-[var(--color-main)] hover:bg-[var(--color-main)]/90 text-white"
              >
                <Send className="w-4 h-4" />
                Envoyer à HubSpot
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white rounded-xl shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[var(--color-main)]" />
                  Statut Base
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getSubmissionStatusBadge(submission.submissionStatus)}
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[var(--color-main)]" />
                  Statut Commercial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <span className="text-sm">{submission.status}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[var(--color-main)]" />
                  HubSpot
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getHubSpotBadge(submission.sentToHubSpot, submission.hubspotContactId)}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="bg-white rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <User className="w-5 h-5 text-[var(--color-main)]" />
                Informations de Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Nom complet:</span>
                    <span className="text-sm text-gray-600">
                      {submission.firstname && submission.lastname
                        ? `${submission.firstname} ${submission.lastname}`
                        : submission.name || "Non renseigné"
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm text-gray-600">{submission.email || "Non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Téléphone:</span>
                    <span className="text-sm text-gray-600">{submission.phone || "Non renseigné"}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Entreprise:</span>
                    <span className="text-sm text-gray-600">{submission.company || "Non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Pays:</span>
                    <span className="text-sm text-gray-600">
                      {submission.countryName} ({submission.countryCode})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Créé le:</span>
                    <span className="text-sm text-gray-600">
                      {format(new Date(submission.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          {submission.message && (
            <Card className="bg-white rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <MessageSquare className="w-5 h-5 text-[var(--color-main)]" />
                  Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{submission.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Fields Filled Status */}
          <Card className="bg-white rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Champs Remplis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(submission.fieldsFilled).map(([field, filled]) => (
                  <div key={field} className="flex items-center gap-2">
                    {getFieldStatusIcon(filled)}
                    <span className="text-sm capitalize">{field}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Behavior Tracking */}
          {submission.brief_description && (
            <Card className="bg-white rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Eye className="w-5 h-5 text-[var(--color-main)]" />
                  Analyse du Comportement Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {submission.brief_description}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* HubSpot Integration Details */}
          {submission.sentToHubSpot && (
            <Card className="bg-white rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Database className="w-5 h-5 text-[var(--color-main)]" />
                  Détails HubSpot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Contact ID:</span>
                    <span className="text-sm text-gray-600 font-mono">{submission.hubspotContactId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Synchronisé le:</span>
                    <span className="text-sm text-gray-600">
                      {submission.hubspotSyncDate
                        ? format(new Date(submission.hubspotSyncDate), "dd MMM yyyy 'à' HH:mm", { locale: fr })
                        : "Date inconnue"
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Source:</span>
                    <span className="text-sm text-gray-600">{submission.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Page:</span>
                    <span className="text-sm text-gray-600">{submission.page}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card className="bg-white rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Horodatages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">Créé:</span>
                  <span className="text-sm text-gray-600">
                    {format(new Date(submission.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">Modifié:</span>
                  <span className="text-sm text-gray-600">
                    {format(new Date(submission.updatedAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
