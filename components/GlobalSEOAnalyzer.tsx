"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, Info, TrendingUp, Globe, Search, BarChart3 } from 'lucide-react';

interface GlobalSEOData {
     page: string;
     language: string;
     title: string;
     description: string;
     keywords: string;
     ogTitle?: string;
     ogDescription?: string;
     ogImage?: string;
     canonical?: string;
     isActive: boolean;
}

interface GlobalSEOAnalysis {
     overallScore: number;
     pageCount: number;
     activePages: number;
     issues: {
          critical: number;
          warning: number;
          info: number;
     };
     recommendations: string[];
     pageAnalysis: Array<{
          page: string;
          score: number;
          issues: string[];
     }>;
}

interface Props {
     seoData: GlobalSEOData[];
}

export default function GlobalSEOAnalyzer({ seoData }: Props) {
     const [analysis, setAnalysis] = useState<GlobalSEOAnalysis | null>(null);
     const [isAnalyzing, setIsAnalyzing] = useState(false);

     useEffect(() => {
          if (seoData.length > 0) {
               analyzeGlobalSEO();
          }
     }, [seoData]);

     const analyzeGlobalSEO = () => {
          setIsAnalyzing(true);

          setTimeout(() => {
               const pageAnalysis = seoData.map(seo => {
                    const issues: string[] = [];
                    let score = 100;

                    // Title analysis
                    if (!seo.title || seo.title.length < 30) {
                         issues.push('Titre trop court ou manquant');
                         score -= 20;
                    } else if (seo.title.length > 60) {
                         issues.push('Titre trop long');
                         score -= 10;
                    }

                    // Description analysis
                    if (!seo.description || seo.description.length < 120) {
                         issues.push('Description trop courte ou manquante');
                         score -= 20;
                    } else if (seo.description.length > 160) {
                         issues.push('Description trop longue');
                         score -= 10;
                    }

                    // Keywords analysis
                    if (!seo.keywords || seo.keywords.trim() === '') {
                         issues.push('Mots-clés manquants');
                         score -= 15;
                    }

                    // Open Graph analysis
                    if (!seo.ogTitle) {
                         issues.push('Titre Open Graph manquant');
                         score -= 5;
                    }
                    if (!seo.ogDescription) {
                         issues.push('Description Open Graph manquante');
                         score -= 5;
                    }
                    if (!seo.ogImage) {
                         issues.push('Image Open Graph manquante');
                         score -= 5;
                    }

                    // Canonical URL
                    if (!seo.canonical) {
                         issues.push('URL canonique manquante');
                         score -= 5;
                    }

                    // Active status
                    if (!seo.isActive) {
                         issues.push('Page inactive');
                         score -= 10;
                    }

                    return {
                         page: seo.page,
                         score: Math.max(0, score),
                         issues
                    };
               });

               const overallScore = Math.round(
                    pageAnalysis.reduce((acc, page) => acc + page.score, 0) / pageAnalysis.length
               );

               const criticalIssues = pageAnalysis.filter(page => page.score < 50).length;
               const warningIssues = pageAnalysis.filter(page => page.score >= 50 && page.score < 80).length;
               const infoIssues = pageAnalysis.filter(page => page.score >= 80).length;

               const recommendations = generateRecommendations(pageAnalysis, seoData);

               setAnalysis({
                    overallScore,
                    pageCount: seoData.length,
                    activePages: seoData.filter(seo => seo.isActive).length,
                    issues: {
                         critical: criticalIssues,
                         warning: warningIssues,
                         info: infoIssues
                    },
                    recommendations,
                    pageAnalysis
               });

               setIsAnalyzing(false);
          }, 1000);
     };

     const generateRecommendations = (pageAnalysis: any[], seoData: GlobalSEOData[]): string[] => {
          const recommendations: string[] = [];

          // Check for common issues
          const pagesWithoutTitles = seoData.filter(seo => !seo.title || seo.title.trim() === '');
          if (pagesWithoutTitles.length > 0) {
               recommendations.push(`${pagesWithoutTitles.length} page(s) sans titre SEO`);
          }

          const pagesWithoutDescriptions = seoData.filter(seo => !seo.description || seo.description.trim() === '');
          if (pagesWithoutDescriptions.length > 0) {
               recommendations.push(`${pagesWithoutDescriptions.length} page(s) sans description SEO`);
          }

          const pagesWithoutKeywords = seoData.filter(seo => !seo.keywords || seo.keywords.trim() === '');
          if (pagesWithoutKeywords.length > 0) {
               recommendations.push(`${pagesWithoutKeywords.length} page(s) sans mots-clés`);
          }

          const inactivePages = seoData.filter(seo => !seo.isActive);
          if (inactivePages.length > 0) {
               recommendations.push(`${inactivePages.length} page(s) inactive(s)`);
          }

          // Check for missing Open Graph data
          const pagesWithoutOG = seoData.filter(seo => !seo.ogTitle || !seo.ogDescription || !seo.ogImage);
          if (pagesWithoutOG.length > 0) {
               recommendations.push(`${pagesWithoutOG.length} page(s) avec Open Graph incomplet`);
          }

          return recommendations;
     };

     const getScoreColor = (score: number) => {
          if (score >= 80) return 'text-green-600';
          if (score >= 60) return 'text-yellow-600';
          return 'text-red-600';
     };

     const getScoreLabel = (score: number) => {
          if (score >= 80) return 'Excellent';
          if (score >= 60) return 'Bon';
          if (score >= 40) return 'Moyen';
          return 'Critique';
     };

     const getScoreIcon = (score: number) => {
          if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
          if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
          return <XCircle className="w-5 h-5 text-red-600" />;
     };

     if (isAnalyzing) {
          return (
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <BarChart3 className="w-5 h-5" />
                              Analyse SEO Globale
                         </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              <span className="ml-3 text-gray-600">Analyse en cours...</span>
                         </div>
                    </CardContent>
               </Card>
          );
     }

     if (!analysis) {
          return (
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <BarChart3 className="w-5 h-5" />
                              Analyse SEO Globale
                         </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="text-center py-8 text-gray-500">
                              Aucune donnée SEO à analyser
                         </div>
                    </CardContent>
               </Card>
          );
     }

     return (
          <Card>
               <CardHeader className="py-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                         <Globe className="w-4 h-4" />
                         Analyse SEO Globale du Site
                    </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">

                    {/* Compact Score and Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         {/* Overall Score - Compact */}
                         <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-center mb-1">
                                   {getScoreIcon(analysis.overallScore)}
                              </div>
                              <div className={`text-xl font-bold ${getScoreColor(analysis.overallScore)} mb-1`}>
                                   {analysis.overallScore}/100
                              </div>
                              <div className="text-xs text-gray-700">{getScoreLabel(analysis.overallScore)}</div>
                         </div>

                         {/* Progress Bar - Compact */}
                         <div className="flex flex-col justify-center p-3 bg-gray-50 rounded-lg border">
                              <div className="flex justify-between text-xs mb-2">
                                   <span>Score global</span>
                                   <span>{analysis.overallScore}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                   <div
                                        className={`h-2 rounded-full transition-all duration-300 ${analysis.overallScore >= 80 ? 'bg-green-500' :
                                             analysis.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                             }`}
                                        style={{ width: `${analysis.overallScore}%` }}
                                   ></div>
                              </div>
                         </div>

                         {/* Quick Stats - Compact */}
                         <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border">
                              <div className="text-center">
                                   <div className="text-sm font-bold text-blue-600">{analysis.pageCount}</div>
                                   <div className="text-xs text-gray-600">Pages</div>
                              </div>
                              <div className="text-center">
                                   <div className="text-sm font-bold text-green-600">{analysis.activePages}</div>
                                   <div className="text-xs text-gray-600">Actives</div>
                              </div>
                              <div className="text-center">
                                   <div className="text-sm font-bold text-red-600">{analysis.issues.critical}</div>
                                   <div className="text-xs text-gray-600">Critiques</div>
                              </div>
                              <div className="text-center">
                                   <div className="text-sm font-bold text-yellow-600">{analysis.issues.warning}</div>
                                   <div className="text-xs text-gray-600">Warnings</div>
                              </div>
                         </div>
                    </div>

                    {/* Compact Issues Summary - Horizontal Layout */}
                    <div className="space-y-2">
                         <h4 className="font-medium text-gray-900 text-xs">Résumé des problèmes</h4>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {analysis.issues.critical > 0 && (
                                   <div className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-200">
                                        <XCircle className="w-4 h-4 text-red-600" />
                                        <div className="min-w-0">
                                             <div className="font-medium text-red-900 text-xs">{analysis.issues.critical} critique(s)</div>
                                             <div className="text-xs text-red-700 truncate">Attention immédiate</div>
                                        </div>
                                   </div>
                              )}

                              {analysis.issues.warning > 0 && (
                                   <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                                        <div className="min-w-0">
                                             <div className="font-medium text-yellow-900 text-xs">{analysis.issues.warning} warning(s)</div>
                                             <div className="text-xs text-yellow-700 truncate">À améliorer</div>
                                        </div>
                                   </div>
                              )}

                              {analysis.issues.info > 0 && (
                                   <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <div className="min-w-0">
                                             <div className="font-medium text-green-900 text-xs">{analysis.issues.info} optimisée(s)</div>
                                             <div className="text-xs text-green-700 truncate">Bon travail !</div>
                                        </div>
                                   </div>
                              )}
                         </div>
                    </div>

                    {/* Compact Page Analysis - Table Style */}
                    <div className="space-y-2">
                         <h4 className="font-medium text-gray-900 text-xs">Analyse par page</h4>
                         <div className="max-h-32 overflow-y-auto">
                              <div className="grid gap-1">
                                   {analysis.pageAnalysis.map((page, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs">
                                             <div className="flex items-center gap-2 min-w-0">
                                                  <span className="font-medium text-gray-900 capitalize truncate">{page.page}</span>
                                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                                       {page.issues.length}
                                                  </Badge>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                  <div className={`font-bold ${getScoreColor(page.score)}`}>
                                                       {page.score}/100
                                                  </div>
                                                  {getScoreIcon(page.score)}
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>

                    {/* Compact Action Button */}
                    <div className="pt-2 border-t border-gray-200">
                         <Button
                              onClick={analyzeGlobalSEO}
                              className="w-full bg-blue-600 hover:bg-blue-700 h-7 text-xs"
                         >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Actualiser l'analyse
                         </Button>
                    </div>
               </CardContent>
          </Card>
     );
}
