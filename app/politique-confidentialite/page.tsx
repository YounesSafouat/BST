/**
 * page.tsx (Privacy Policy)
 * 
 * Privacy policy page that displays the legal information and data protection
 * policies for BlackSwan Technology. This page provides transparency about
 * data collection, usage, and user rights in compliance with GDPR.
 * 
 * WHERE IT'S USED:
 * - Privacy policy route (/politique-confidentialite)
 * - Footer legal links
 * - GDPR compliance requirement
 * 
 * KEY FEATURES:
 * - Complete legal information for both French and Moroccan entities
 * - GDPR compliance documentation
 * - User rights and contact information
 * - Professional layout matching website design
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - BlackSwan Technology',
  description: 'Politique de confidentialité et protection des données personnelles de BlackSwan Technology, partenaire officiel Odoo et HubSpot.',
  robots: 'index, follow',
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[var(--color-main)]/10 to-[var(--color-secondary)]/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-main)] mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-600">
            Protection des données personnelles et respect de votre vie privée
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Article 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-main)] mb-6 border-b border-gray-200 pb-3">
              Article 1 – Éditeurs du site
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Le présent site est édité conjointement par les entités suivantes :
              </p>
              
              <p>
                <strong className="text-[var(--color-secondary)]">Blackswan Security</strong>, société par actions simplifiée à associé unique (SASU), au capital social de 1 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 921 407 045, dont le siège social est situé au 38 avenue de Wagram, 75008 Paris, France.<br />
                Adresse e-mail : <a href="mailto:contact@blackswantechnology.fr" className="text-[var(--color-main)] hover:underline">contact@blackswantechnology.fr</a><br />
                Numéro de TVA intracommunautaire : FR22921407045<br />
                Directeur de la publication : Rubens Valensi, Président de <strong className="text-[var(--color-secondary)]">Blackswan Security</strong>.
              </p>

              <p>
                <strong className="text-[var(--color-secondary)]">Rinalink</strong>, société par actions simplifiée à associé unique (SASU), au capital social de 10 000 dirhams, immatriculée au Registre du Commerce de Casablanca sous le numéro 641047 et identifiée à l'ICE sous le numéro 003520134000086, dont le siège social est situé 202, Boulevard Brahim Roudani, Angle Rue de Bruyère, 2e étage (Extension Maarif), Casablanca – Maroc.<br />
                Adresse e-mail : <a href="mailto:contact-ma@blackswantechnology.fr" className="text-[var(--color-main)] hover:underline">contact-ma@blackswantechnology.fr</a><br />
                Représentée légalement par son Président, Warren Ohnona.
              </p>

              <p>
                Les deux sociétés coéditrices exercent leurs activités respectives sous le nom commercial commun « <strong className="text-[var(--color-secondary)]">Blackswan Technology</strong> », marque utilisée pour désigner l'ensemble des services numériques et informatiques proposés via le présent site.
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-main)] mb-6 border-b border-gray-200 pb-3">
              Article 2 – Hébergeur
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p>
                Le site est hébergé par <strong>IONOS</strong>, dont les services d'hébergement sont fournis par 
                1&1 IONOS SE, société européenne basée en Allemagne.
              </p>
              <p className="mt-4">
                <strong>Site :</strong> <a href="https://www.ionos.fr" target="_blank" rel="noopener noreferrer" 
                className="text-[var(--color-main)] hover:underline">https://www.ionos.fr</a>
              </p>
            </div>
          </section>

          {/* Article 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-main)] mb-6 border-b border-gray-200 pb-3">
              Article 3 – Accès au site
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p>
                Le site est accessible en tout temps, 7j/7, 24h/24, sauf interruption programmée ou non, 
                notamment pour maintenance ou cas de force majeure.
              </p>
              <p className="mt-4">
                Les éditeurs ne sauraient être tenus responsables en cas d'interruption ou de suspension 
                d'accès au site, quelles qu'en soient la nature ou la durée.
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-main)] mb-6 border-b border-gray-200 pb-3">
              Article 4 – Collecte de données
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                Le site assure à l'utilisateur une collecte et un traitement des données personnelles dans le 
                respect de la réglementation applicable, notamment la loi française « Informatique et Libertés » 
                du 6 janvier 1978 modifiée, et le Règlement Général sur la Protection des Données (RGPD – UE 2016/679).
              </p>
              
              <div className="bg-[var(--color-main)]/10 p-6 rounded-lg">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-4">Vos droits</h3>
                <p className="mb-4">
                  Tout utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition 
                  sur les données personnelles le concernant. Il peut exercer ses droits :
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Par e-mail France :</strong> 
                    <a href="mailto:contact@blackswantechnology.fr" 
                       className="text-[var(--color-main)] hover:underline ml-2">
                      contact@blackswantechnology.fr
                    </a>
                  </li>
                  <li>
                    <strong>Par e-mail Maroc :</strong> 
                    <a href="mailto:contact-ma@blackswantechnology.fr" 
                       className="text-[var(--color-main)] hover:underline ml-2">
                      contact-ma@blackswantechnology.fr
                    </a>
                  </li>
                  <li>
                    <strong>Via le formulaire de contact</strong> disponible sur le site
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Article 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-main)] mb-6 border-b border-gray-200 pb-3">
              Article 5 – Propriété intellectuelle
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p>
                L'ensemble du contenu présent sur ce site (textes, images, logos, charte graphique, vidéos, etc.) 
                est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou 
                exploitation, totale ou partielle, sans autorisation expresse préalable des éditeurs, est 
                strictement interdite et pourra faire l'objet de poursuites judiciaires conformément aux 
                dispositions du Code de la propriété intellectuelle.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-[var(--color-secondary)]/5 p-8 rounded-xl">
            <h2 className="text-2xl font-semibold text-[var(--color-main)] mb-6">
              Nous contacter
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--color-secondary)] mb-3">France</h3>
                <p className="text-gray-700">
                  <strong>Email :</strong> contact@blackswantechnology.fr<br />
                  <strong>Adresse :</strong> 38 avenue de Wagram, 75008 Paris, France
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-secondary)] mb-3">Maroc</h3>
                <p className="text-gray-700">
                  <strong>Email :</strong> contact-ma@blackswantechnology.fr<br />
                  <strong>Adresse :</strong> 202, Boulevard Brahim Roudani, Casablanca, Maroc
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
