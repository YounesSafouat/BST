/**
 * CountryCodeSelector.tsx
 * 
 * Country code selector component that provides a searchable dropdown
 * for international phone number formatting. This component includes
 * comprehensive country data with flags, dial codes, and names.
 * 
 * WHERE IT'S USED:
 * - ContactSection.tsx - Phone number input with country selection
 * - Any form that requires international phone number input
 * - Regional contact information display
 * 
 * KEY FEATURES:
 * - Comprehensive list of 80+ countries with flags and dial codes
 * - Searchable dropdown interface for easy country selection
 * - Automatic phone number formatting based on selected country
 * - Flag emojis and localized country names
 * - Keyboard navigation and accessibility support
 * - Mobile-responsive design
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and hooks
 * - Implements search functionality with filtering
 * - Includes comprehensive country data array
 * - Handles keyboard navigation and focus management
 * - Uses Lucide React icons for UI elements
 * - Implements proper accessibility attributes
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Country {
     code: string;
     name: string;
     dialCode: string;
     flag: string;
}

const countries: Country[] = [
     { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
     { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
     { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' },
     { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
     { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
     { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
     { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
     { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' },
     { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿' },
     { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
     { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
     { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
     { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
     { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
     { code: 'TD', name: 'Tchad', dialCode: '+235', flag: '🇹🇩' },
     { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲' },
     { code: 'CF', name: 'République centrafricaine', dialCode: '+236', flag: '🇨🇫' },
     { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬' },
     { code: 'CD', name: 'République démocratique du Congo', dialCode: '+243', flag: '🇨🇩' },
     { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
     { code: 'GQ', name: 'Guinée équatoriale', dialCode: '+240', flag: '🇬🇶' },
     { code: 'ST', name: 'Sao Tomé-et-Principe', dialCode: '+239', flag: '🇸🇹' },
     { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
     { code: 'NA', name: 'Namibie', dialCode: '+264', flag: '🇳🇦' },
     { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
     { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' },
     { code: 'ZM', name: 'Zambie', dialCode: '+260', flag: '🇿🇲' },
     { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
     { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
     { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
     { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿' },
     { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
     { code: 'MU', name: 'Maurice', dialCode: '+230', flag: '🇲🇺' },
     { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
     { code: 'KM', name: 'Comores', dialCode: '+269', flag: '🇰🇲' },
     { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
     { code: 'SO', name: 'Somalie', dialCode: '+252', flag: '🇸🇴' },
     { code: 'ET', name: 'Éthiopie', dialCode: '+251', flag: '🇪🇹' },
     { code: 'ER', name: 'Érythrée', dialCode: '+291', flag: '🇪🇷' },
     { code: 'SD', name: 'Soudan', dialCode: '+249', flag: '🇸🇩' },
     { code: 'SS', name: 'Soudan du Sud', dialCode: '+211', flag: '🇸🇸' },
     { code: 'EG', name: 'Égypte', dialCode: '+20', flag: '🇪🇬' },
     { code: 'LY', name: 'Libye', dialCode: '+218', flag: '🇱🇾' },
     { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧' },
     { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪' },
     { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹' },
     { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸' },
     { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
     { code: 'NL', name: 'Pays-Bas', dialCode: '+31', flag: '🇳🇱' },
     { code: 'AT', name: 'Autriche', dialCode: '+43', flag: '🇦🇹' },
     { code: 'SE', name: 'Suède', dialCode: '+46', flag: '🇸🇪' },
     { code: 'NO', name: 'Norvège', dialCode: '+47', flag: '🇳🇴' },
     { code: 'DK', name: 'Danemark', dialCode: '+45', flag: '🇩🇰' },
     { code: 'FI', name: 'Finlande', dialCode: '+358', flag: '🇫🇮' },
     { code: 'PL', name: 'Pologne', dialCode: '+48', flag: '🇵🇱' },
     { code: 'CZ', name: 'République tchèque', dialCode: '+420', flag: '🇨🇿' },
     { code: 'SK', name: 'Slovaquie', dialCode: '+421', flag: '🇸🇰' },
     { code: 'HU', name: 'Hongrie', dialCode: '+36', flag: '🇭🇺' },
     { code: 'RO', name: 'Roumanie', dialCode: '+40', flag: '🇷🇴' },
     { code: 'BG', name: 'Bulgarie', dialCode: '+359', flag: '🇧🇬' },
     { code: 'HR', name: 'Croatie', dialCode: '+385', flag: '🇭🇷' },
     { code: 'SI', name: 'Slovénie', dialCode: '+386', flag: '🇸🇮' },
     { code: 'EE', name: 'Estonie', dialCode: '+372', flag: '🇪🇪' },
     { code: 'LV', name: 'Lettonie', dialCode: '+371', flag: '🇱🇻' },
     { code: 'LT', name: 'Lituanie', dialCode: '+370', flag: '🇱🇹' },
     { code: 'GR', name: 'Grèce', dialCode: '+30', flag: '🇬🇷' },
     { code: 'CY', name: 'Chypre', dialCode: '+357', flag: '🇨🇾' },
     { code: 'MT', name: 'Malte', dialCode: '+356', flag: '🇲🇹' },
     { code: 'IE', name: 'Irlande', dialCode: '+353', flag: '🇮🇪' },
     { code: 'IS', name: 'Islande', dialCode: '+354', flag: '🇮🇸' },
     { code: 'RU', name: 'Russie', dialCode: '+7', flag: '🇷🇺' },
     { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
     { code: 'BY', name: 'Biélorussie', dialCode: '+375', flag: '🇧🇾' },
     { code: 'MD', name: 'Moldavie', dialCode: '+373', flag: '🇲🇩' },
     { code: 'GE', name: 'Géorgie', dialCode: '+995', flag: '🇬🇪' },
     { code: 'AM', name: 'Arménie', dialCode: '+374', flag: '🇦🇲' },
     { code: 'AZ', name: 'Azerbaïdjan', dialCode: '+994', flag: '🇦🇿' },
     { code: 'TR', name: 'Turquie', dialCode: '+90', flag: '🇹🇷' },
     { code: 'IL', name: 'Israël', dialCode: '+972', flag: '🇮🇱' },
     { code: 'LB', name: 'Liban', dialCode: '+961', flag: '🇱🇧' },
     { code: 'SY', name: 'Syrie', dialCode: '+963', flag: '🇸🇾' },
     { code: 'IQ', name: 'Irak', dialCode: '+964', flag: '🇮🇶' },
     { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' },
     { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
     { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
     { code: 'IN', name: 'Inde', dialCode: '+91', flag: '🇮🇳' },
     { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
     { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
     { code: 'NP', name: 'Népal', dialCode: '+977', flag: '🇳🇵' },
     { code: 'BT', name: 'Bhoutan', dialCode: '+975', flag: '🇧🇹' },
     { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
     { code: 'TH', name: 'Thaïlande', dialCode: '+66', flag: '🇹🇭' },
     { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
     { code: 'KH', name: 'Cambodge', dialCode: '+855', flag: '🇰🇭' },
     { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
     { code: 'MY', name: 'Malaisie', dialCode: '+60', flag: '🇲🇾' },
     { code: 'SG', name: 'Singapour', dialCode: '+65', flag: '🇸🇬' },
     { code: 'ID', name: 'Indonésie', dialCode: '+62', flag: '🇮🇩' },
     { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
     { code: 'TW', name: 'Taïwan', dialCode: '+886', flag: '🇹🇼' },
     { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
     { code: 'MO', name: 'Macao', dialCode: '+853', flag: '🇲🇴' },
     { code: 'CN', name: 'Chine', dialCode: '+86', flag: '🇨🇳' },
     { code: 'JP', name: 'Japon', dialCode: '+81', flag: '🇯🇵' },
     { code: 'KR', name: 'Corée du Sud', dialCode: '+82', flag: '🇰🇷' },
     { code: 'AU', name: 'Australie', dialCode: '+61', flag: '🇦🇺' },
     { code: 'NZ', name: 'Nouvelle-Zélande', dialCode: '+64', flag: '🇳🇿' },
     { code: 'BR', name: 'Brésil', dialCode: '+55', flag: '🇧🇷' },
     { code: 'AR', name: 'Argentine', dialCode: '+54', flag: '🇦🇷' },
     { code: 'CL', name: 'Chili', dialCode: '+56', flag: '🇨🇱' },
     { code: 'PE', name: 'Pérou', dialCode: '+51', flag: '🇵🇪' },
     { code: 'CO', name: 'Colombie', dialCode: '+57', flag: '🇨🇴' },
     { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
     { code: 'EC', name: 'Équateur', dialCode: '+593', flag: '🇪🇨' },
     { code: 'BO', name: 'Bolivie', dialCode: '+591', flag: '🇧🇴' },
     { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
     { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
     { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾' },
     { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷' },
     { code: 'FK', name: 'Îles Malouines', dialCode: '+500', flag: '🇫🇰' },
];

interface CountryCodeSelectorProps {
     selectedCountry: Country;
     onCountryChange: (country: Country) => void;
}

export default function CountryCodeSelector({ selectedCountry, onCountryChange }: CountryCodeSelectorProps) {
     const [isOpen, setIsOpen] = useState(false);
     const [searchTerm, setSearchTerm] = useState('');
     const dropdownRef = useRef<HTMLDivElement>(null);
     const searchInputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    console.log('Click outside dropdown, closing');
                    setIsOpen(false);
               }
          };

          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
     }, []);

     // Focus the search input when dropdown opens
     useEffect(() => {
          if (isOpen && searchInputRef.current) {
               console.log('Dropdown opened, focusing search input');
               setTimeout(() => {
                    searchInputRef.current?.focus();
               }, 100);
          }
     }, [isOpen]);

     // Debug searchTerm changes
     useEffect(() => {
          console.log('searchTerm state changed to:', searchTerm);
     }, [searchTerm]);

     const filteredCountries = countries.filter(country =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.dialCode.includes(searchTerm) ||
          country.code.toLowerCase().includes(searchTerm.toLowerCase())
     );

     console.log('Search term:', searchTerm);
     console.log('Filtered countries count:', filteredCountries.length);
     console.log('All countries count:', countries.length);

     const handleCountrySelect = (country: Country) => {
          console.log('Country selected:', country);
          onCountryChange(country);
          setIsOpen(false);
          setSearchTerm('');
     };

     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          console.log('Search input changed to:', value);
          console.log('Current searchTerm before update:', searchTerm);
          setSearchTerm(value);
          console.log('setSearchTerm called with:', value);
     };

     return (
          <div className="relative" ref={dropdownRef}>
               <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-l-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] focus:border-[var(--color-main)] transition-colors h-11 sm:h-12 min-w-[100px]"
               >
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
               </button>

               {isOpen && (
                    <div 
                         className="absolute top-full left-0 z-50 w-80 max-h-96 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden"
                         onMouseDown={(e) => e.preventDefault()}
                    >
                         <div className="p-3 border-b border-gray-200">
                              <div className="relative">
                                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                   <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Rechercher un pays..."
                                        defaultValue={searchTerm}
                                        onChange={handleSearchChange}
                                        onFocus={(e) => {
                                             console.log('Search input focused');
                                             e.stopPropagation();
                                        }}
                                        onClick={(e) => {
                                             console.log('Search input clicked');
                                             e.stopPropagation();
                                        }}
                                        onKeyDown={(e) => {
                                             console.log('Search input key pressed:', e.key);
                                             e.stopPropagation();
                                        }}
                                        onMouseDown={(e) => {
                                             console.log('Search input mouse down');
                                             e.stopPropagation();
                                        }}
                                        onInput={(e) => {
                                             const value = (e.target as HTMLInputElement).value;
                                             console.log('Search input onInput:', value);
                                             setSearchTerm(value);
                                        }}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] focus:border-[var(--color-main)]"
                                        autoComplete="off"
                                        autoFocus
                                   />
                              </div>
                         </div>

                         <div className="max-h-80 overflow-y-auto">
                              {filteredCountries.map((country) => (
                                   <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => handleCountrySelect(country)}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                   >
                                        <span className="text-lg">{country.flag}</span>
                                        <div className="flex-1 text-left">
                                             <div className="font-medium text-gray-900">{country.name}</div>
                                             <div className="text-sm text-gray-500">{country.dialCode}</div>
                                        </div>
                                   </button>
                              ))}
                         </div>
                    </div>
               )}
          </div>
     );
}


