"use client"

import type React from 'react'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Hospital, MapPin, Phone, Mail, Loader2, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomDesign } from "@/components/bottom-design"

// Country data
const countries = ['Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 
  'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Barbados', 
  'Belarus', 'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Bulgaria', 
  'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 
  'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 
  'Côte d\x19Ivoire', 'Democratic Republic of the Congo', 'Denmark', 'Dominican Republic', 'Ecuador', 
  'Egypt', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'French Guiana', 
  'French Polynesia', 'Gabon', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Greenland', 'Grenada', 
  'Guadeloupe', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Haiti', 'Holy See', 'Honduras', 'Hong Kong', 
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 
  'Lesotho', 'Liberia', 'Libya', 'Lithuania', 'Madagascar', 'Malawi', 'Malaysia', 'Mali', 'Malta', 'Martinique', 
  'Mexico', 'Mongolia', 'Morocco', 'Mozambique', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Niger', 
  'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Peru', 'Philippines', 
  'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Republic of the Congo', 'Reunion', 'Romania', 'Russia', 'Rwanda', 
  'Saudi Arabia', 'Senegal', 'Serbia', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tanzania', 'Thailand', 'The Gambia', 
  'Timor-Leste', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey (Türkiye)', 'USA', 'Uganda', 'Ukraine', 'United Arab Emirates', 
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Zambia', 'Zimbabwe']

// US States data
const usStates = [
  "All States",
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
]

// Interface for specialist data from backend
interface Specialist {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  hospital: string;
  specialty: string;
  research_interests: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  scores: {
    search_score: number;
    relevancy_score: number;
    topic_confidence: number;
  };
  topic_cluster: number;
  npi: string;
}

// Fallback static data
const fallbackSpecialists: Specialist[] = [
  {
    id: "1",
    name: "Anne-Catherine Bachoud-Levi",
    first_name: "Anne-Catherine",
    last_name: "Bachoud-Levi",
    hospital: "Assistance Publique - Hôpitaux de Paris",
    specialty: "Huntington's Disease",
    research_interests: "Neurodegenerative diseases, clinical trials",
    location: {
      city: "Créteil",
      state: "",
      country: "France"
    },
    contact: {
      email: "s.chen@medcenter.com",
      phone: "(555) 123-4567",
      website: ""
    },
    scores: {
      search_score: 10,
      relevancy_score: 0.85,
      topic_confidence: 0.9
    },
    topic_cluster: 1,
    npi: ""
  },
  {
    id: "2",
    name: "Helen Thackray",
    first_name: "Helen",
    last_name: "Thackray",
    hospital: "GlycoMimetics Incorporated",
    specialty: "Neurology",
    research_interests: "Rare neurological disorders",
    location: {
      city: "Oakland",
      state: "California",
      country: "United States"
    },
    contact: {
      email: "m.rodriguez@unihospital.com",
      phone: "(555) 987-6543",
      website: ""
    },
    scores: {
      search_score: 8,
      relevancy_score: 0.75,
      topic_confidence: 0.8
    },
    topic_cluster: 2,
    npi: ""
  },
  {
    id: "3",
    name: "André M Cantin",
    first_name: "André",
    last_name: "Cantin",
    hospital: "Centre de recherche du Centre hospitalier universitaire de Sherbrooke",
    specialty: "Cystic Fibrosis",
    research_interests: "Pulmonary medicine, genetic disorders",
    location: {
      city: "Sherbrooke",
      state: "Quebec",
      country: "Canada"
    },
    contact: {
      email: "a.cantin@usherbrooke.ca",
      phone: "(555) 987-6543",
      website: ""
    },
    scores: {
      search_score: 9,
      relevancy_score: 0.88,
      topic_confidence: 0.92
    },
    topic_cluster: 3,
    npi: ""
  },
]

export default function SearchResultsPage() {
    const [query, setQuery] = useState("");
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Location filter states
    const [selectedCountry, setSelectedCountry] = useState("All Countries")
    const [selectedState, setSelectedState] = useState("All States")
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
    const [locationSearchTerm, setLocationSearchTerm] = useState("")
    const [activeLocationTab, setActiveLocationTab] = useState<'country' | 'state'>('country')


    // Filter countries based on search term
    const filteredCountries = countries.filter(country =>
      country.toLowerCase().includes(locationSearchTerm.toLowerCase())
    )

    // Filter states based on search term
    const filteredStates = usStates.filter(state =>
      state.toLowerCase().includes(locationSearchTerm.toLowerCase())
    )

    // Get display text for location filter
    const getLocationDisplayText = () => {
      if (selectedCountry === "All Countries") {
        return "All Locations"
      }
      if (selectedCountry === "United States" && selectedState !== "All States") {
        return `${selectedState}, US`
      }
      return selectedCountry
    }

    const handleCountrySelect = (country: string) => {
      setSelectedCountry(country)
      setLocationSearchTerm("")
      
      // Reset state selection if country changes
      if (country !== "United States") {
        setSelectedState("All States")
        setIsLocationDropdownOpen(false)
      } else {
        // Switch to state tab if US is selected
        setActiveLocationTab('state')
      }
      
      // Don't auto-search - let user click search button
    }

    const handleStateSelect = (state: string) => {
      setSelectedState(state)
      setIsLocationDropdownOpen(false)
      setLocationSearchTerm("")
      
      // Don't auto-search - let user click search button
    }

    const clearLocationFilter = () => {
      setSelectedCountry("All Countries")
      setSelectedState("All States")
      
      // Don't auto-search - let user click search button
    }

    const buildApiUrl = (searchQuery: string) => {
      const params = new URLSearchParams()
      params.set('q', searchQuery)
      
      if (selectedCountry !== "All Countries") {
        params.set('country', selectedCountry)
      }
      
      if (selectedCountry === "United States" && selectedState !== "All States") {
        params.set('state', selectedState)
      }
      
      return `http://localhost:8000/api/specialists/search?${params.toString()}`
    }

    const buildSearchUrl = (searchQuery: string) => {
      const params = new URLSearchParams()
      params.set('q', searchQuery)
      
      if (selectedCountry !== "All Countries") {
        params.set('country', selectedCountry)
      }
      
      if (selectedCountry === "United States" && selectedState !== "All States") {
        params.set('state', selectedState)
      }
      
      return `/specialists?${params.toString()}`
    }

    // Get initial query from URL
    useEffect(() => {
      const urlQuery = searchParams.get('q');
      if (urlQuery) {
        setQuery(urlQuery);
        performSearch(urlQuery);
      }
    }, [searchParams]);

    const performSearch = async (searchQuery: string) => {
      if (!searchQuery.trim()) return;
      
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      try {
        const response = await fetch(`http://localhost:8000/api/specialists/search?q=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setSpecialists(data.results);
        } else {
          throw new Error(data.error || 'Search failed');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while searching');
        // Fallback to static data
        setSpecialists(fallbackSpecialists);
      } finally {
        setLoading(false);
      }
    };

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        // Update URL
        router.push(`/specialists?q=${encodeURIComponent(trimmedQuery)}`);
        performSearch(trimmedQuery);
      }
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
      {/* Header with Logo */}
      <header className="w-full px-6 py-6 flex justify-between items-center border-b border-border">
        <div className="text-2xl font-semibold text-foreground tracking-tight">MedConnect</div>
        <a href="/">
          <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-100"> 
            Back to Home
          </Button>
        </a>
      </header>

      {/* Search Section */}
      <div className="w-full px-6 py-8 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-balance">Find Medical Specialists</h1>

          {/* Enhanced Search Bar with Location Filter */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <div className="relative flex items-center bg-card border-2 border-border rounded-lg focus-within:border-primary transition-colors">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground z-10" />
              
              {/* Main search input */}
              <Input
                type="text"
                placeholder="Search by condition..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-base bg-transparent border-0 focus:ring-0 flex-1"
              />
              
              {/* Location filter button integrated in search bar */}
              <div className="flex items-center border-l border-border px-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                    setActiveLocationTab('country')
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">{getLocationDisplayText()}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Clear location filter */}
                {selectedCountry !== "All Countries" && (
                  <button
                    type="button"
                    onClick={clearLocationFilter}
                    className="ml-1 p-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Search button */}
              <Button
                type="submit"
                disabled={loading}
                className="ml-2 mr-2 h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Location dropdown */}
            {isLocationDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-border rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
                {/* Tab headers */}
                <div className="flex border-b border-border">
                  <button
                    type="button"
                    onClick={() => setActiveLocationTab('country')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeLocationTab === 'country' 
                        ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    Country
                  </button>
                  {selectedCountry === "United States" && (
                    <button
                      type="button"
                      onClick={() => setActiveLocationTab('state')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeLocationTab === 'state' 
                          ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      State
                    </button>
                  )}
                </div>

                {/* Search input */}
                <div className="p-3 border-b border-border">
                  <Input
                    type="text"
                    placeholder={`Search ${activeLocationTab === 'country' ? 'countries' : 'states'}...`}
                    value={locationSearchTerm}
                    onChange={(e) => setLocationSearchTerm(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Options list */}
                <div className="max-h-48 overflow-y-auto">
                  {activeLocationTab === 'country' ? (
                    <>
                      {filteredCountries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none transition-colors ${
                            selectedCountry === country ? 'bg-primary/10 text-primary font-medium' : ''
                          }`}
                        >
                          {country}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {filteredStates.map((state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => handleStateSelect(state)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none transition-colors ${
                            selectedState === state ? 'bg-primary/10 text-primary font-medium' : ''
                          }`}
                        >
                          {state}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </form>

          <div className="text-sm text-muted-foreground">
            {loading ? 'Searching...' : hasSearched ? `Showing ${specialists.length} rare disease specialists` : 'Enter a search term to find specialists'}
            {error && <div className="text-red-500 mt-2">Error: {error}</div>}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <div className="text-muted-foreground">Searching specialists...</div>
            </div>
          )}
          
          {!loading && specialists.map((specialist) => (
            <Card key={specialist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="py-1 px-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Main Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{specialist.name}</h3>
                        <Badge variant="secondary" className="mt-2">
                          {specialist.specialty}
                        </Badge>
                        {specialist.research_interests && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Research: {specialist.research_interests}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Location */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {[specialist.location?.city, specialist.location?.state, specialist.location?.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hospital className="h-4 w-5" />
                      <span>
                        {specialist.hospital || 'N/A'}
                      </span>
                    </div>
                    
                    {/* Contact and Availability */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-border">
                      <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        {specialist.contact?.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{specialist.contact.phone}</span>
                          </div>
                        )}
                        {specialist.contact?.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{specialist.contact.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {specialist.contact?.email && (
                          <a href={`mailto:${specialist.contact.email}`}>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Contact
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && hasSearched && specialists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">No specialists found matching your search.</div>
              <Button
                variant="outline"
                className="mt-4 bg-white text-black hover:bg-gray-100"
                onClick={() => {
                  setQuery("");
                  setSpecialists([]);
                  setHasSearched(false);
                  setSelectedCountry("All Countries");
                  setSelectedState("All States");
                  router.push('/specialists');
                }}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Design Element */}
      <BottomDesign />
    </main>
    )}