"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface YoastSEOProps {
     title: string;
     content: string;
     focusKeyword: string;
     metaDescription: string;
     slug: string;
}

interface SEOAssessment {
     identifier: string;
     score: 'good' | 'ok' | 'bad';
     text: string;
     category: 'seo' | 'readability';
     priority: 'high' | 'medium' | 'low';
}

export default function YoastSEO({ title, content, focusKeyword, metaDescription, slug }: YoastSEOProps) {
     const [seoScore, setSeoScore] = useState(0);
     const [readabilityScore, setReadabilityScore] = useState(0);
     const [assessments, setAssessments] = useState<SEOAssessment[]>([]);
     const [isAnalyzing, setIsAnalyzing] = useState(false);

     useEffect(() => {
          // Only analyze if we have at least title and content
          if (!title || !content) return;

          setIsAnalyzing(true);

          // Simulate Yoast analysis (replace with actual Yoast when package is installed)
          setTimeout(() => {
               analyzeContent();
               setIsAnalyzing(false);
          }, 300);
     }, [title, content, focusKeyword, metaDescription, slug]);

     const analyzeContent = () => {
          // Debug logging
          console.log('YoastSEO - Analyzing content:', {
               title: title?.substring(0, 50) + '...',
               contentLength: content?.length || 0,
               focusKeyword,
               metaDescriptionLength: metaDescription?.length || 0,
               slug
          });

          // This is a simulation of Yoast analysis
          // When you install @yoastseo/yoastseo, replace this with actual analysis

          const mockAssessments: SEOAssessment[] = [
               // SEO Assessments
               {
                    identifier: 'titleLength',
                    score: title.length >= 30 && title.length <= 60 ? 'good' : title.length < 30 ? 'bad' : 'ok',
                    text: title.length >= 30 && title.length <= 60
                         ? 'La longueur du titre est parfaite pour les moteurs de recherche.'
                         : title.length < 30
                              ? 'Le titre est trop court. Ajoutez plus de mots-clés.'
                              : 'Le titre est trop long. Réduisez-le pour de meilleurs résultats.',
                    category: 'seo',
                    priority: 'high'
               },
               {
                    identifier: 'metaDescription',
                    score: metaDescription.length >= 120 && metaDescription.length <= 160 ? 'good' : 'bad',
                    text: metaDescription.length >= 120 && metaDescription.length <= 160
                         ? 'La meta description a la bonne longueur.'
                         : 'La meta description doit faire entre 120 et 160 caractères.',
                    category: 'seo',
                    priority: 'high'
               },
               {
                    identifier: 'focusKeyword',
                    score: focusKeyword ? 'good' : 'bad',
                    text: focusKeyword
                         ? 'Mot-clé principal défini avec succès.'
                         : 'Définissez un mot-clé principal pour optimiser votre contenu.',
                    category: 'seo',
                    priority: 'high'
               },
               {
                    identifier: 'keywordInTitle',
                    score: title.toLowerCase().includes(focusKeyword.toLowerCase()) ? 'good' : 'bad',
                    text: title.toLowerCase().includes(focusKeyword.toLowerCase())
                         ? 'Le mot-clé principal est présent dans le titre.'
                         : 'Ajoutez le mot-clé principal dans le titre.',
                    category: 'seo',
                    priority: 'high'
               },
               {
                    identifier: 'keywordInMetaDescription',
                    score: metaDescription.toLowerCase().includes(focusKeyword.toLowerCase()) ? 'good' : 'ok',
                    text: metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())
                         ? 'Le mot-clé principal est présent dans la meta description.'
                         : 'Considérez ajouter le mot-clé principal dans la meta description.',
                    category: 'seo',
                    priority: 'medium'
               },
               {
                    identifier: 'contentLength',
                    score: content.length >= 300 ? 'good' : 'bad',
                    text: content.length >= 300
                         ? 'Le contenu a une longueur suffisante pour le SEO.'
                         : 'Le contenu est trop court. Ajoutez plus de contenu de qualité.',
                    category: 'seo',
                    priority: 'medium'
               },
               {
                    identifier: 'keywordDensity',
                    score: calculateKeywordDensity() >= 0.5 && calculateKeywordDensity() <= 2.5 ? 'good' : 'ok',
                    text: calculateKeywordDensity() >= 0.5 && calculateKeywordDensity() <= 2.5
                         ? 'La densité du mot-clé est optimale.'
                         : 'Ajustez la densité du mot-clé pour une meilleure optimisation.',
                    category: 'seo',
                    priority: 'medium'
               },

               // Readability Assessments
               {
                    identifier: 'sentenceLength',
                    score: calculateAverageSentenceLength() <= 20 ? 'good' : 'ok',
                    text: calculateAverageSentenceLength() <= 20
                         ? 'La longueur des phrases est appropriée pour la lecture.'
                         : 'Certaines phrases sont trop longues. Divisez-les pour améliorer la lisibilité.',
                    category: 'readability',
                    priority: 'medium'
               },
               {
                    identifier: 'paragraphLength',
                    score: calculateAverageParagraphLength() <= 150 ? 'good' : 'ok',
                    text: calculateAverageParagraphLength() <= 150
                         ? 'La longueur des paragraphes est appropriée.'
                         : 'Certains paragraphes sont trop longs. Divisez-les pour améliorer la lisibilité.',
                    category: 'readability',
                    priority: 'low'
               },
               {
                    identifier: 'subheadings',
                    score: countSubheadings() >= 2 ? 'good' : 'ok',
                    text: countSubheadings() >= 2
                         ? 'L\'utilisation de sous-titres améliore la structure et la lisibilité.'
                         : 'Ajoutez des sous-titres pour structurer votre contenu.',
                    category: 'readability',
                    priority: 'medium'
               }
          ];

          setAssessments(mockAssessments);

          // Calculate scores
          const seoAssessments = mockAssessments.filter(a => a.category === 'seo');
          const readabilityAssessments = mockAssessments.filter(a => a.category === 'readability');

          setSeoScore(calculateScore(seoAssessments));
          setReadabilityScore(calculateScore(readabilityAssessments));
     };

     const calculateKeywordDensity = () => {
          if (!focusKeyword || !content) return 0;
          const wordCount = content.toLowerCase().split(' ').length;
          const keywordMatches = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length;
          return Math.round((keywordMatches / wordCount) * 100 * 100) / 100;
     };

     const calculateAverageSentenceLength = () => {
          if (!content) return 0;
          const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
          const totalWords = sentences.reduce((acc, sentence) => acc + sentence.split(' ').length, 0);
          return Math.round(totalWords / sentences.length);
     };

     const calculateAverageParagraphLength = () => {
          if (!content) return 0;
          const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
          const totalWords = paragraphs.reduce((acc, paragraph) => acc + paragraph.split(' ').length, 0);
          return Math.round(totalWords / paragraphs.length);
     };

     const countSubheadings = () => {
          if (!content) return 0;
          const headingMatches = content.match(/^#{1,6}\s+.+$/gm) || [];
          return headingMatches.length;
     };

     const calculateScore = (assessments: SEOAssessment[]) => {
          if (assessments.length === 0) return 0;

          let totalScore = 0;
          assessments.forEach(assessment => {
               switch (assessment.score) {
                    case 'good':
                         totalScore += 100;
                         break;
                    case 'ok':
                         totalScore += 50;
                         break;
                    case 'bad':
                         totalScore += 0;
                         break;
               }
          });

          return Math.round(totalScore / assessments.length);
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
          return 'À améliorer';
     };

     const getScoreIcon = (score: number) => {
          if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
          if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
          return <XCircle className="w-5 h-5 text-red-600" />;
     };

     const getAssessmentIcon = (score: string) => {
          switch (score) {
               case 'good':
                    return <CheckCircle className="w-4 h-4 text-green-600" />;
               case 'ok':
                    return <AlertCircle className="w-4 h-4 text-yellow-600" />;
               case 'bad':
                    return <XCircle className="w-4 h-4 text-red-600" />;
               default:
                    return <Info className="w-4 h-4 text-blue-600" />;
          }
     };

     const getPriorityColor = (priority: string) => {
          switch (priority) {
               case 'high':
                    return 'bg-red-100 text-red-800 border-red-200';
               case 'medium':
                    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
               case 'low':
                    return 'bg-blue-100 text-blue-800 border-blue-200';
               default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
          }
     };

     if (isAnalyzing) {
          return (
               <Card>
                    <CardHeader><CardTitle>Analyse SEO Yoast</CardTitle></CardHeader>
                    <CardContent>
                         <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              <span className="ml-3 text-gray-600">Analyse en cours...</span>
                         </div>
                    </CardContent>
               </Card>
          );
     }

     return (
          <Card>
               <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                         <img
                              src="https://yoast.com/app/uploads/2015/09/Yoast_SEO_NavWP_Icon.png"
                              alt="Yoast SEO"
                              className="w-6 h-6"
                         />
                         Analyse SEO Yoast
                    </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">

                    {/* Scores Overview */}
                    <div className="grid grid-cols-2 gap-4">
                         <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-center mb-2">
                                   {getScoreIcon(seoScore)}
                              </div>
                              <div className={`text-3xl font-bold ${getScoreColor(seoScore)}`}>
                                   {seoScore}/100
                              </div>
                              <div className="text-sm text-gray-600">Score SEO</div>
                              <div className="text-xs text-gray-500">{getScoreLabel(seoScore)}</div>
                         </div>

                         <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-center mb-2">
                                   {getScoreIcon(readabilityScore)}
                              </div>
                              <div className={`text-3xl font-bold ${getScoreColor(readabilityScore)}`}>
                                   {readabilityScore}/100
                              </div>
                              <div className="text-sm text-gray-600">Lisibilité</div>
                              <div className="text-xs text-gray-500">{getScoreLabel(readabilityScore)}</div>
                         </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3">
                         <div>
                              <div className="flex justify-between text-sm mb-1">
                                   <span>SEO</span>
                                   <span>{seoScore}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                   <div
                                        className={`h-2 rounded-full transition-all duration-300 ${seoScore >= 80 ? 'bg-green-500' :
                                             seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                             }`}
                                        style={{ width: `${seoScore}%` }}
                                   ></div>
                              </div>
                         </div>

                         <div>
                              <div className="flex justify-between text-sm mb-1">
                                   <span>Lisibilité</span>
                                   <span>{readabilityScore}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                   <div
                                        className={`h-2 rounded-full transition-all duration-300 ${readabilityScore >= 80 ? 'bg-green-500' :
                                             readabilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                             }`}
                                        style={{ width: `${readabilityScore}%` }}
                                   ></div>
                              </div>
                         </div>
                    </div>

                    {/* Focus Keyword Info */}
                    {focusKeyword && (
                         <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                   <Info className="w-4 h-4 text-blue-600" />
                                   <span className="font-medium text-blue-900">Mot-clé principal</span>
                              </div>
                              <div className="text-sm text-blue-800">
                                   <strong>{focusKeyword}</strong> - Densité: {calculateKeywordDensity()}%
                              </div>
                         </div>
                    )}

                    {/* Detailed Assessments */}
                    <div className="space-y-3">
                         <h4 className="font-medium text-gray-900">Recommandations détaillées</h4>

                         {/* SEO Assessments */}
                         <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Optimisation SEO</h5>
                              <div className="space-y-2">
                                   {assessments
                                        .filter(a => a.category === 'seo')
                                        .map((assessment, index) => (
                                             <div key={index} className={`p-3 rounded-lg border ${assessment.score === 'good' ? 'bg-green-50 border-green-200' :
                                                  assessment.score === 'ok' ? 'bg-yellow-50 border-yellow-200' :
                                                       'bg-red-50 border-red-200'
                                                  }`}>
                                                  <div className="flex items-start gap-3">
                                                       {getAssessmentIcon(assessment.score)}
                                                       <div className="flex-1">
                                                            <div className="text-sm text-gray-900 mb-1">
                                                                 {assessment.text}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                 <Badge
                                                                      variant="outline"
                                                                      className={`text-xs ${getPriorityColor(assessment.priority)}`}
                                                                 >
                                                                      {assessment.priority === 'high' ? 'Priorité haute' :
                                                                           assessment.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                                                                 </Badge>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}
                              </div>
                         </div>

                         {/* Readability Assessments */}
                         <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Lisibilité</h5>
                              <div className="space-y-2">
                                   {assessments
                                        .filter(a => a.category === 'readability')
                                        .map((assessment, index) => (
                                             <div key={index} className={`p-3 rounded-lg border ${assessment.score === 'good' ? 'bg-green-50 border-green-200' :
                                                  assessment.score === 'ok' ? 'bg-yellow-50 border-yellow-200' :
                                                       'bg-red-50 border-red-200'
                                                  }`}>
                                                  <div className="flex items-start gap-3">
                                                       {getAssessmentIcon(assessment.score)}
                                                       <div className="flex-1">
                                                            <div className="text-sm text-gray-900 mb-1">
                                                                 {assessment.text}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                 <Badge
                                                                      variant="outline"
                                                                      className={`text-xs ${getPriorityColor(assessment.priority)}`}
                                                                 >
                                                                      {assessment.priority === 'high' ? 'Priorité haute' :
                                                                           assessment.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                                                                 </Badge>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}
                              </div>
                         </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200">
                         <div className="text-sm text-gray-600 mb-3">
                              Actions rapides pour améliorer votre SEO :
                         </div>
                         <div className="flex flex-wrap gap-2">
                              {seoScore < 80 && (
                                   <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        Optimiser le titre
                                   </Badge>
                              )}
                              {readabilityScore < 80 && (
                                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Améliorer la lisibilité
                                   </Badge>
                              )}
                              {!focusKeyword && (
                                   <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        Définir un mot-clé principal
                                   </Badge>
                              )}
                         </div>
                    </div>
               </CardContent>
          </Card>
     );
}
