"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/home/Navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JobBanner } from "@/components/shared/JobBanner";
import { formatPostcode } from "@/lib/postcodes";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  XMarkIcon
} from "@heroicons/react/20/solid";
import { supabase } from "@/lib/supabaseClient";

type CompanyRow = {
  CompanyName: string;
  "RegAddress.PostCode": string | null;
  constituency_name: string;
  region_name: string | null;
  IncorporationDate: string | null;
  latitude: number | null;
  longitude: number | null;
};



function formatIncorporationDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

function constituencyFromSlug(slug: string): string {
  // Simple conversion: replace hyphens with spaces and capitalize words
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function DirectoryPage() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyRow[]>([]);
  const [displayedCompanies, setDisplayedCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "location">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [constituencies, setConstituencies] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [isInitializing, setIsInitializing] = useState(true);

  // Get constituency from URL params - run after companies are loaded
  useEffect(() => {
    if (companies.length > 0 && constituencies.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const constituencyParam = urlParams.get('constituency');
      if (constituencyParam) {
        const constituencyName = constituencyFromSlug(constituencyParam);
        
        // Try exact match first
        let matchedConstituency = constituencies.find(c => c === constituencyName);
        
        // If no exact match, try case-insensitive match
        if (!matchedConstituency) {
          matchedConstituency = constituencies.find(c => 
            c.toLowerCase() === constituencyName.toLowerCase()
          );
        }
        
        // If still no match, try fuzzy matching (contains)
        if (!matchedConstituency) {
          matchedConstituency = constituencies.find(c => 
            c.toLowerCase().includes(constituencyName.toLowerCase()) ||
            constituencyName.toLowerCase().includes(c.toLowerCase())
          );
        }
        
        if (matchedConstituency) {
          setSelectedConstituency(matchedConstituency);
          setShowFilters(true); // Show filters when coming from constituency page
        } else {
          console.warn(`Could not find constituency match for: "${constituencyName}" (from slug: "${constituencyParam}")`);
        }
      }
      
      // Set filtered companies after processing URL parameter (or show all if no parameter)
      setFilteredCompanies(companies);
      
      // Mark initialization as complete
      setIsInitializing(false);
    }
  }, [companies, constituencies]);

  // Fetch companies data
  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        console.time('[directory] fetchCompanies')
        const { data, error } = await supabase
          .from('roofing_companies_enriched')
          .select('CompanyName, "RegAddress.PostCode", constituency_name, region_name, IncorporationDate, latitude, longitude')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .order('CompanyName', { ascending: true });
        console.timeEnd('[directory] fetchCompanies')

        if (error) throw error;

        const companiesData = (data ?? []) as CompanyRow[];
        console.log('[directory] companies loaded', companiesData.length);
        setCompanies(companiesData);
        // Don't set filtered companies yet - wait for initialization

        // Extract unique constituencies and regions
        const uniqueConstituencies = [...new Set(companiesData.map(c => c.constituency_name))].sort();
        const uniqueRegions = [...new Set(companiesData.map(c => c.region_name).filter(Boolean))].sort();
        
        setConstituencies(uniqueConstituencies);
        setRegions(uniqueRegions);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...companies];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        (company.CompanyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.constituency_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company["RegAddress.PostCode"] && company["RegAddress.PostCode"].toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Constituency filter
    if (selectedConstituency) {
      filtered = filtered.filter(company => (company.constituency_name || "") === selectedConstituency);
    }

    // Region filter
    if (selectedRegion) {
      filtered = filtered.filter(company => (company.region_name || "") === selectedRegion);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = (a.CompanyName || "").localeCompare(b.CompanyName || "");
          break;
        case "date":
          const dateA = a.IncorporationDate ? new Date(a.IncorporationDate).getTime() : 0;
          const dateB = b.IncorporationDate ? new Date(b.IncorporationDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case "location":
          comparison = (a.constituency_name || "").localeCompare(b.constituency_name || "");
          break;
        default:
          comparison = 0;
      }
      
      // Apply sort direction
      return sortDirection === "desc" ? -comparison : comparison;
    });

    setFilteredCompanies(filtered);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [companies, searchTerm, selectedConstituency, selectedRegion, sortBy, sortDirection]);

  // Update displayed companies based on current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedCompanies(filteredCompanies.slice(startIndex, endIndex));
  }, [filteredCompanies, currentPage, itemsPerPage]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedConstituency("");
    setSelectedRegion("");
    setSortBy("name");
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedConstituency || selectedRegion || sortBy !== "name" || sortDirection !== "asc";

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
        <Navigation />
        <div className="flex-1 p-4">
          <div className="bg-white rounded-[16px] p-6 sm:p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <Navigation />
      <div className="flex-1 p-4">
        <div className="bg-white rounded-[16px] p-6 sm:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto space-y-6">
            <Breadcrumbs
              items={[
                { label: 'Directory' },
              ]}
            />
            
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] text-gray-900">
                Roofing Companies Directory
              </h1>
              <p className="text-gray-600">
                Browse verified roofing companies across the UK. Find professionals in your area.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies, locations, or postcodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FunnelIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Filters</span>
                  {hasActiveFilters && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Filter Results</h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Division Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPinIcon className="w-4 h-4 inline mr-1" />
                        Division
                        {selectedRegion && (
                          <span className="text-xs text-gray-500 ml-1">(clears region)</span>
                        )}
                      </label>
                      <select
                        value={selectedConstituency}
                        onChange={(e) => {
                          setSelectedConstituency(e.target.value);
                          if (e.target.value) {
                            setSelectedRegion(""); // Clear region when division is selected
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All divisions</option>
                        {constituencies.map(constituency => (
                          <option key={constituency} value={constituency}>
                            {constituency}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Region Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                        Region
                        {selectedConstituency && (
                          <span className="text-xs text-gray-500 ml-1">(clears division)</span>
                        )}
                      </label>
                      <select
                        value={selectedRegion}
                        onChange={(e) => {
                          setSelectedRegion(e.target.value);
                          if (e.target.value) {
                            setSelectedConstituency(""); // Clear division when region is selected
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All regions</option>
                        {regions.map(region => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Sort by
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as "name" | "date" | "location")}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="name">Company Name</option>
                          <option value="date">Incorporation Date</option>
                          <option value="location">Division</option>
                        </select>
                        <select
                          value={sortDirection}
                          onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="asc">A-Z</option>
                          <option value="desc">Z-A</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length.toLocaleString()} companies
                {hasActiveFilters && " (filtered)"}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-300">
              {displayedCompanies.map((company) => {
                const firstLetter = company.CompanyName.charAt(0).toUpperCase();
                const establishmentYear = company.IncorporationDate ? 
                  new Date(company.IncorporationDate).getFullYear() : 
                  new Date().getFullYear() - Math.floor(Math.random() * 15) - 2;

                return (
                  <div key={company.CompanyName} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200 group">
                    <div className="space-y-4">
                      {/* Header with logo placeholder and company name */}
                      <div className="flex items-start space-x-4">
                        {/* Logo placeholder */}
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-lg">{firstLetter}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                            {company.CompanyName}
                          </h3>
                          <div className="space-y-1 mt-2">
                            <p className="text-gray-700 text-sm flex items-center">
                              <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
                              {formatPostcode(company["RegAddress.PostCode"])}
                            </p>
                            <p className="text-gray-600 text-sm">
                              <span className="text-gray-500"></span> {company.constituency_name}
                            </p>
                            {company.region_name && (
                              <p className="text-gray-500 text-xs">{company.region_name}</p>
                            )}
                            {company.IncorporationDate && (
                              <p className="text-gray-500 text-xs flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                Est. {establishmentYear}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 space-y-3">
                        <button className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 group-hover:shadow-md">
                          Get Free Quote
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          Response Within 24hrs
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* No Results */}
            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find more results.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <JobBanner tradeName="Roofing" />
        </div>
      </div>
    </div>
  );
}
