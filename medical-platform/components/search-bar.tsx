"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Location filter states
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [selectedState, setSelectedState] = useState("All States")
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [locationSearchTerm, setLocationSearchTerm] = useState("")
  const [activeLocationTab, setActiveLocationTab] = useState<'country' | 'state'>('country')
  
  const router = useRouter()

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
  }

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    setIsLocationDropdownOpen(false)
    setLocationSearchTerm("")
  }

  const clearLocationFilter = () => {
    setSelectedCountry("All Countries")
    setSelectedState("All States")
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(buildApiUrl(query))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        router.push(buildSearchUrl(query))
      } else {
        throw new Error(data.error || 'Search failed')
      }
    } catch (err: any) {
      console.error('Search error:', err)
      setError(err?.message ?? 'An error occurred while searching')
      router.push(buildSearchUrl(query))
    } finally {
      setLoading(false)
    }
  }

  const handleQuickSearch = async (searchTerm: string) => {
    setQuery(searchTerm)
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(buildApiUrl(searchTerm))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        router.push(buildSearchUrl(searchTerm))
      } else {
        throw new Error(data.error || 'Search failed')
      }
    } catch (err: any) {
      console.error('Quick search error:', err)
      setError(err?.message ?? 'An error occurred while searching')
      router.push(buildSearchUrl(searchTerm))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
          Connect with Medical Specialists
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
          Find and connect with the right specialists for your patients. Start searching by condition.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center bg-card border-2 border-border rounded-lg focus-within:border-primary transition-colors">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground z-10" />
          
          {/* Main search input */}
          <Input
            type="text"
            placeholder="Search by condition..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 h-14 text-lg bg-transparent border-0 focus:ring-0 flex-1"
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
            className="ml-2 mr-2 h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
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

      {error && (
        <div className="text-center text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
        <span>Common searches:</span>
        <button 
          className="text-primary hover:underline"
          onClick={() => handleQuickSearch("Cystic Fibrosis")}
        >
          Cystic Fibrosis
        </button>
        <span>•</span>
        <button 
          className="text-primary hover:underline"
          onClick={() => handleQuickSearch("Fabry")}
        >
          Fabry
        </button>
        <span>•</span>
        <button 
          className="text-primary hover:underline"
          onClick={() => handleQuickSearch("Sickle Cell")}
        >
          Sickle Cell
        </button>
        <span>•</span>
        <button 
          className="text-primary hover:underline"
          onClick={() => handleQuickSearch("Muscular Dystrophy")}
        >
          Muscular Dystrophy
        </button>
      </div>
    </div>
  )
}