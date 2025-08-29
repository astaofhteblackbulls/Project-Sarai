import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Star, ArrowRight, Play, Heart } from 'lucide-react';
import { SkeletonDestination } from './SkeletonLoader';
import { subscribeToDestinations } from '../api/destinations';
import SearchAndFilter, { SearchFilters } from './SearchAndFilter';
import type { Destination } from '../api/destinations';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';

const defaultDestinations: Destination[] = [];

interface DestinationsProps {
  onVRExperience: (destination: Destination) => void;
}

const Destinations: React.FC<DestinationsProps> = ({ onVRExperience }) => {
  console.log('Destinations: component rendered');
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>(defaultDestinations);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(defaultDestinations);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    location: '',
    minRating: 0,
    priceRange: { min: 0, max: 10000 },
    vrAvailable: null,
    duration: ''
  });
  
  const { currentUser } = useAuth();
  const { checkIfDestinationFavorited, toggleDestinationFavorite } = useFavorites();
  
  const handleToggleFavorite = async (destinationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (!currentUser) {
      // Could show login modal here
      alert('Please sign in to add favorites');
      return;
    }
    
    try {
      await toggleDestinationFavorite(destinationId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Failed to update favorites. Please try again.');
    }
  };

  useEffect(() => {
    console.log('Destinations: subscribe useEffect triggered');
    setIsLoading(true);
    const unsubscribe = subscribeToDestinations(
      (newDestinations) => {
        console.log('Destinations: new destinations received', { count: newDestinations.length });
        setDestinations(newDestinations);
        setIsLoading(false);
      },
      (err) => {
        console.error('Destinations: error in subscription', err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => {
      console.log('Destinations: cleaning up subscription');
      unsubscribe();
    };
  }, []);

  // Filter destinations based on search filters
  useEffect(() => {
    console.log('Destinations: filter useEffect triggered', { destinationsCount: destinations.length, filters });
    if (!destinations.length) {
      setFilteredDestinations([]);
      return;
    }

    let filtered = destinations.filter(destination => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          destination.name.toLowerCase().includes(searchLower) ||
          destination.location.toLowerCase().includes(searchLower) ||
          destination.description.toLowerCase().includes(searchLower) ||
          destination.highlights.some(h => h.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location && destination.location !== filters.location) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && destination.rating < filters.minRating) {
        return false;
      }

      // VR filter
      if (filters.vrAvailable !== null && destination.vrAvailable !== filters.vrAvailable) {
        return false;
      }

      // Duration filter
      if (filters.duration && destination.duration !== filters.duration) {
        return false;
      }

      return true;
    });

    console.log('Destinations: filtered destinations', { count: filtered.length });
    setFilteredDestinations(filtered);
  }, [destinations, filters]);

  // Get unique locations for filter options
  const getUniqueLocations = () => {
    return [...new Set(destinations.map(d => d.location))].sort();
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  // Removed fullscreen video functionality - now redirects to VR modal

  return (
    <section id="destinations" className="py-20 relative overflow-hidden">
      {/* Vintage India Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Vintage Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8B4513 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #A0522D 1px, transparent 1px),
                           radial-gradient(circle at 50% 50%, #CD853F 0.5px, transparent 0.5px)`,
          backgroundSize: '50px 50px, 80px 80px, 30px 30px'
        }}></div>
        
        {/* Detailed India Map with States */}
        <svg
          viewBox="0 0 800 600"
          className="absolute inset-0 w-full h-full opacity-15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="vintageMapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B4513" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#A0522D" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#CD853F" stopOpacity="0.4" />
            </linearGradient>
            <filter id="vintage" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
            </filter>
          </defs>
          
          {/* Main India Outline */}
          <path
            d="M280 80 C320 70, 360 75, 400 85 L440 95 C480 105, 520 120, 550 140 L580 160 C600 180, 610 205, 605 230 L600 255 C595 285, 585 315, 570 340 L555 365 C540 385, 520 400, 495 410 L470 420 C445 425, 420 422, 395 415 L370 408 C345 400, 325 385, 310 365 L295 345 C285 325, 282 302, 285 280 L288 258 C292 235, 300 212, 312 192 L324 172 C336 152, 350 135, 365 122 L380 109 C395 96, 410 87, 425 82 L450 77 C475 72, 500 70, 525 72 L550 74"
            fill="url(#vintageMapGradient)"
            stroke="#8B4513"
            strokeWidth="1"
            filter="url(#vintage)"
          />
          
          {/* Jammu & Kashmir */}
          <path d="M320 85 L340 80 L355 85 L365 95 L360 105 L345 110 L325 105 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="342" y="95" fontSize="8" fill="#8B4513" fontFamily="serif">Jammu & Kashmir</text>
          
          {/* Himachal Pradesh */}
          <path d="M340 110 L365 105 L380 115 L375 125 L350 130 L340 120 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="357" y="120" fontSize="7" fill="#8B4513" fontFamily="serif">Himachal Pradesh</text>
          
          {/* Punjab */}
          <path d="M325 125 L350 120 L365 130 L360 140 L335 145 L325 135 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="342" y="135" fontSize="7" fill="#8B4513" fontFamily="serif">Punjab</text>
          
          {/* Haryana */}
          <path d="M360 140 L380 135 L390 145 L385 155 L365 160 L360 150 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="372" y="150" fontSize="7" fill="#8B4513" fontFamily="serif">Haryana</text>
          
          {/* Delhi */}
          <circle cx="385" cy="150" r="3" fill="#CD853F" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="390" y="155" fontSize="7" fill="#8B4513" fontFamily="serif" fontWeight="bold">Delhi</text>
          
          {/* Uttar Pradesh */}
          <path d="M390 160 L450 155 L465 175 L460 195 L420 200 L390 185 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="425" y="180" fontSize="8" fill="#8B4513" fontFamily="serif">Uttar Pradesh</text>
          
          {/* Rajasthan */}
          <path d="M320 160 L390 155 L395 185 L385 215 L355 230 L325 215 L315 185 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="355" y="190" fontSize="8" fill="#8B4513" fontFamily="serif">Rajasthan</text>
          
          {/* Gujarat */}
          <path d="M285 220 L325 215 L335 245 L320 270 L290 275 L275 250 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="305" y="245" fontSize="8" fill="#8B4513" fontFamily="serif">Gujarat</text>
          
          {/* Maharashtra */}
          <path d="M335 250 L395 245 L410 275 L395 305 L355 310 L335 285 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="370" y="280" fontSize="8" fill="#8B4513" fontFamily="serif">Maharashtra</text>
          
          {/* Madhya Pradesh */}
          <path d="M395 200 L460 195 L475 225 L465 255 L420 260 L395 230 Z"
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="435" y="230" fontSize="8" fill="#8B4513" fontFamily="serif">Madhya Pradesh</text>
          
          {/* Bihar */}
          <path d="M465 175 L510 170 L520 185 L515 200 L480 205 L465 190 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="490" y="185" fontSize="7" fill="#8B4513" fontFamily="serif">Bihar</text>
          
          {/* West Bengal */}
          <path d="M520 185 L550 180 L560 210 L545 225 L520 220 L515 200 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="535" y="205" fontSize="7" fill="#8B4513" fontFamily="serif">West Bengal</text>
          
          {/* Odisha */}
          <path d="M515 225 L545 220 L555 250 L540 270 L515 265 L510 245 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="530" y="245" fontSize="7" fill="#8B4513" fontFamily="serif">Odisha</text>
          
          {/* Chhattisgarh */}
          <path d="M465 255 L510 250 L520 275 L505 295 L470 300 L465 280 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="485" y="275" fontSize="7" fill="#8B4513" fontFamily="serif">Chhattisgarh</text>
          
          {/* Andhra Pradesh */}
          <path d="M410 310 L465 305 L480 335 L465 365 L425 370 L410 340 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="440" y="340" fontSize="7" fill="#8B4513" fontFamily="serif">Andhra Pradesh</text>
          
          {/* Telangana */}
          <path d="M420 305 L455 300 L465 320 L455 340 L425 345 L420 325 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="440" y="325" fontSize="7" fill="#8B4513" fontFamily="serif">Telangana</text>
          
          {/* Karnataka */}
          <path d="M355 340 L410 335 L425 365 L395 385 L365 380 L355 360 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="385" y="360" fontSize="8" fill="#8B4513" fontFamily="serif">Karnataka</text>
          
          {/* Kerala */}
          <path d="M340 380 L365 375 L375 405 L365 435 L345 440 L335 410 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="355" y="410" fontSize="8" fill="#8B4513" fontFamily="serif">Kerala</text>
          
          {/* Tamil Nadu */}
          <path d="M375 405 L425 400 L440 430 L425 460 L385 465 L375 435 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="405" y="435" fontSize="8" fill="#8B4513" fontFamily="serif">Tamil Nadu</text>
          
          {/* Goa */}
          <path d="M320 320 L340 315 L345 330 L340 345 L325 350 L320 335 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="332" y="335" fontSize="6" fill="#8B4513" fontFamily="serif">Goa</text>
          
          {/* Assam */}
          <path d="M560 160 L590 155 L600 175 L590 190 L565 195 L560 180 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="580" y="175" fontSize="7" fill="#8B4513" fontFamily="serif">Assam</text>
          
          {/* Arunachal Pradesh */}
          <path d="M590 140 L620 135 L630 155 L620 170 L595 175 L590 155 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="610" y="155" fontSize="6" fill="#8B4513" fontFamily="serif">Arunachal Pradesh</text>
          
          {/* Nagaland */}
          <path d="M600 175 L620 170 L625 185 L620 200 L605 205 L600 190 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="612" y="185" fontSize="6" fill="#8B4513" fontFamily="serif">Nagaland</text>
          
          {/* Manipur */}
          <path d="M605 205 L620 200 L625 215 L620 230 L610 235 L605 220 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="615" y="220" fontSize="6" fill="#8B4513" fontFamily="serif">Manipur</text>
          
          {/* Mizoram */}
          <path d="M610 235 L620 230 L625 245 L620 260 L615 265 L610 250 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="617" y="250" fontSize="6" fill="#8B4513" fontFamily="serif">Mizoram</text>
          
          {/* Tripura */}
          <path d="M580 220 L595 215 L600 230 L595 245 L585 250 L580 235 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="590" y="235" fontSize="6" fill="#8B4513" fontFamily="serif">Tripura</text>
          
          {/* Meghalaya */}
          <path d="M570 195 L590 190 L595 205 L590 220 L575 225 L570 210 Z"
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="582" y="210" fontSize="6" fill="#8B4513" fontFamily="serif">Meghalaya</text>
          
          {/* Jharkhand */}
          <path d="M480 205 L515 200 L525 220 L515 240 L485 245 L480 225 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="500" y="225" fontSize="7" fill="#8B4513" fontFamily="serif">Jharkhand</text>
          
          {/* Uttarakhand */}
          <path d="M390 135 L420 130 L430 145 L425 160 L400 165 L390 150 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="410" y="150" fontSize="7" fill="#8B4513" fontFamily="serif">Uttarakhand</text>
          
          {/* Sikkim */}
          <path d="M545 165 L555 160 L560 170 L555 180 L550 185 L545 175 Z" 
                fill="#DEB887" stroke="#8B4513" strokeWidth="0.5"/>
          <text x="552" y="175" fontSize="5" fill="#8B4513" fontFamily="serif">Sikkim</text>
          
          {/* Decorative Compass */}
          <g transform="translate(650, 450)">
            <circle cx="0" cy="0" r="25" fill="none" stroke="#8B4513" strokeWidth="1"/>
            <path d="M0,-20 L5,-5 L0,0 L-5,-5 Z" fill="#8B4513"/>
            <text x="0" y="-30" fontSize="8" fill="#8B4513" textAnchor="middle" fontFamily="serif">N</text>
          </g>
          
          {/* Vintage Border */}
          <rect x="10" y="10" width="780" height="580" fill="none" stroke="#8B4513" strokeWidth="2" strokeDasharray="5,5" opacity="0.6"/>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative text-center mb-12">
          <h2 className="text-responsive-lg font-serif font-bold text-gray-900 mb-4">
            {t('destinations.title')} <span className="text-orange-500">Incredible</span> Destinations
          </h2>
          <p className="text-responsive-sm text-gray-600 max-w-3xl mx-auto mb-8">
            {t('destinations.subtitle')}
          </p>
        </div>

        {/* Search and Filter Component */}
        <div className="mb-12">
          <SearchAndFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            locations={getUniqueLocations()}
            isLoading={isLoading}
          />
        </div>

        {/* Destinations Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {isLoading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonDestination key={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-lg">Error loading destinations.</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
          ) : filteredDestinations.length > 0 ? (
            // Show filtered destinations
            filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100 hover:border-orange-300"
                onMouseEnter={() => setHoveredCard(destination.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Container */}
                <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Video Preview Button - Opens VR Modal */}
                  <button
                    onClick={() => onVRExperience(destination)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20"
                  >
                    <div className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                  </button>

                  {/* VR Badge */}
                  {destination.vrAvailable && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      360° VR
                    </div>
                  )}

                  {/* Rating and Favorite */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{destination.rating}</span>
                    </div>
                    
                    {/* Favorite Button */}
                    {currentUser && (
                      <button
                        onClick={(e) => handleToggleFavorite(destination.id, e)}
                        className={`bg-white/90 backdrop-blur-sm p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                          checkIfDestinationFavorited(destination.id)
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title={checkIfDestinationFavorited(destination.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-4 h-4 transition-all duration-300 ${
                          checkIfDestinationFavorited(destination.id) ? 'fill-current' : ''
                        }`} />
                      </button>
                    )}
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{destination.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {destination.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-3 mb-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{destination.visitors}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {destination.highlights.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="text-xs sm:text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onVRExperience(destination)}
                    className={`w-full flex items-center justify-center space-x-2 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                      hoveredCard === destination.id
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{t('destinations.viewVR')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : destinations.length > 0 ? (
            // Show 'no results' state when destinations exist but filters return no results
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No destinations found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search criteria or filters to see more results.
                </p>
                <button
                  onClick={() => handleFiltersChange({
                    searchTerm: '',
                    location: '',
                    minRating: 0,
                    priceRange: { min: 0, max: 10000 },
                    vrAvailable: null,
                    duration: ''
                  })}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            // Show empty state when no destinations exist at all
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No destinations available yet.</p>
              <p className="text-gray-400 text-sm mt-2">Add destinations through the admin panel to get started.</p>
            </div>
          )}
        </div>
      </div>

    </section>
  );
};

export default Destinations;
export type { Destination };