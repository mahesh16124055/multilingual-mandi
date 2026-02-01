import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, MapPin, Calendar, Star } from 'lucide-react'

// Default crops - can be extended via API
const getDefaultCrops = () => [
  { name: 'Rice', hindi: 'चावल', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_RICE) || 25 },
  { name: 'Wheat', hindi: 'गेहूं', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_WHEAT) || 22 },
  { name: 'Tomato', hindi: 'टमाटर', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_TOMATO) || 30 },
  { name: 'Onion', hindi: 'प्याज', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_ONION) || 18 },
  { name: 'Potato', hindi: 'आलू', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_POTATO) || 15 },
  { name: 'Sugarcane', hindi: 'गन्ना', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_SUGARCANE) || 35 },
  { name: 'Cotton', hindi: 'कपास', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_COTTON) || 45 },
  { name: 'Soybean', hindi: 'सोयाबीन', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_SOYBEAN) || 40 },
  { name: 'Maize', hindi: 'मक्का', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_MAIZE) || 20 },
  { name: 'Bajra', hindi: 'बाजरा', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_BAJRA) || 18 },
  { name: 'Jowar', hindi: 'ज्वार', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_JOWAR) || 19 },
  { name: 'Groundnut', hindi: 'मूंगफली', basePrice: parseInt(process.env.NEXT_PUBLIC_BASE_PRICE_GROUNDNUT) || 55 },
]

// Default locations - can be extended via API
const getDefaultLocations = () => [
  { name: 'Delhi', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_DELHI) || 1.2 },
  { name: 'Mumbai', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_MUMBAI) || 1.3 },
  { name: 'Bangalore', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_BANGALORE) || 1.1 },
  { name: 'Hyderabad', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_HYDERABAD) || 1.0 },
  { name: 'Chennai', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_CHENNAI) || 1.1 },
  { name: 'Kolkata', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_KOLKATA) || 0.9 },
  { name: 'Pune', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_PUNE) || 1.15 },
  { name: 'Ahmedabad', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_AHMEDABAD) || 1.05 },
  { name: 'Jaipur', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_JAIPUR) || 1.0 },
  { name: 'Lucknow', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_LUCKNOW) || 0.95 },
  { name: 'Bhopal', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_BHOPAL) || 0.9 },
  { name: 'Patna', multiplier: parseFloat(process.env.NEXT_PUBLIC_LOCATION_MULTIPLIER_PATNA) || 0.85 },
]

// Default quality grades - can be extended via API
const getDefaultQualityGrades = () => [
  { name: 'Premium', multiplier: parseFloat(process.env.NEXT_PUBLIC_QUALITY_MULTIPLIER_PREMIUM) || 1.3, description: 'Top quality, export grade' },
  { name: 'Grade A', multiplier: parseFloat(process.env.NEXT_PUBLIC_QUALITY_MULTIPLIER_GRADE_A) || 1.1, description: 'High quality, minimal defects' },
  { name: 'Grade B', multiplier: parseFloat(process.env.NEXT_PUBLIC_QUALITY_MULTIPLIER_GRADE_B) || 1.0, description: 'Standard quality' },
  { name: 'Grade C', multiplier: parseFloat(process.env.NEXT_PUBLIC_QUALITY_MULTIPLIER_GRADE_C) || 0.85, description: 'Lower grade, some defects' },
  { name: 'Export', multiplier: parseFloat(process.env.NEXT_PUBLIC_QUALITY_MULTIPLIER_EXPORT) || 1.4, description: 'Export quality, premium grade' },
  { name: 'Organic', multiplier: parseFloat(process.env.NEXT_PUBLIC_QUALITY_MULTIPLIER_ORGANIC) || 1.25, description: 'Certified organic produce' },
]

export default function PriceCalculator({ userType, language, onPriceUpdate }) {
  // Initialize with default data - can be replaced with API data
  const [crops] = useState(getDefaultCrops())
  const [locations] = useState(getDefaultLocations())
  const [qualityGrades] = useState(getDefaultQualityGrades())
  
  const [selectedCrop, setSelectedCrop] = useState(crops[0])
  const [selectedLocation, setSelectedLocation] = useState(locations[3]) // Hyderabad default
  const [selectedQuality, setSelectedQuality] = useState(qualityGrades[1]) // Grade A default
  const [quantity, setQuantity] = useState(100)
  const [calculatedPrice, setCalculatedPrice] = useState(null)
  const [priceRange, setPriceRange] = useState(null)
  const [marketTrend, setMarketTrend] = useState('stable')

  useEffect(() => {
    calculatePrice()
  }, [selectedCrop, selectedLocation, selectedQuality, quantity])

  const calculatePrice = () => {
    // Base calculation
    const basePrice = selectedCrop.basePrice
    const locationAdjusted = basePrice * selectedLocation.multiplier
    const qualityAdjusted = locationAdjusted * selectedQuality.multiplier
    
    // Add some randomness for market fluctuation
    const marketFluctuation = 0.9 + (Math.random() * 0.2) // ±10%
    const finalPrice = Math.round(qualityAdjusted * marketFluctuation)
    
    // Calculate price range
    const minPrice = Math.round(finalPrice * 0.95)
    const maxPrice = Math.round(finalPrice * 1.05)
    
    // Determine market trend
    const trends = ['rising', 'stable', 'falling']
    const randomTrend = trends[Math.floor(Math.random() * trends.length)]
    
    setCalculatedPrice(finalPrice)
    setPriceRange({ min: minPrice, max: maxPrice })
    setMarketTrend(randomTrend)
    
    // Update parent component
    if (onPriceUpdate) {
      onPriceUpdate({
        item: selectedCrop.name,
        price: finalPrice,
        quantity: quantity,
        location: selectedLocation.name,
        quality: selectedQuality.name,
        trend: randomTrend
      })
    }
  }

  const getTrendIcon = () => {
    switch (marketTrend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'falling':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendText = () => {
    switch (marketTrend) {
      case 'rising':
        return language === 'hi' ? 'बढ़ रहा है' : 'Rising'
      case 'falling':
        return language === 'hi' ? 'गिर रहा है' : 'Falling'
      default:
        return language === 'hi' ? 'स्थिर' : 'Stable'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="w-5 h-5 text-saffron-500" />
        <h3 className="font-semibold text-bharat-navy-800">
          {language === 'hi' ? 'मूल्य कैलकुलेटर' : 'Price Calculator'}
        </h3>
      </div>

      {/* Crop Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'hi' ? 'फसल चुनें' : 'Select Crop'}
        </label>
        <select
          value={selectedCrop.name}
          onChange={(e) => setSelectedCrop(crops.find(crop => crop.name === e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
        >
          {crops.map((crop) => (
            <option key={crop.name} value={crop.name}>
              {language === 'hi' ? crop.hindi : crop.name}
            </option>
          ))}
        </select>
      </div>

      {/* Location Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          {language === 'hi' ? 'स्थान' : 'Location'}
        </label>
        <select
          value={selectedLocation.name}
          onChange={(e) => setSelectedLocation(locations.find(loc => loc.name === e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
        >
          {locations.map((location) => (
            <option key={location.name} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quality Grade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Star className="w-4 h-4 inline mr-1" />
          {language === 'hi' ? 'गुणवत्ता ग्रेड' : 'Quality Grade'}
        </label>
        <select
          value={selectedQuality.name}
          onChange={(e) => setSelectedQuality(qualityGrades.find(grade => grade.name === e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
        >
          {qualityGrades.map((grade) => (
            <option key={grade.name} value={grade.name}>
              {grade.name} - {grade.description}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'hi' ? 'मात्रा (किलो)' : 'Quantity (kg)'}
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
        />
      </div>

      {/* Price Display */}
      {calculatedPrice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-saffron-50 to-bharat-green-50 p-4 rounded-lg border border-saffron-200"
        >
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-saffron-600">
              ₹{calculatedPrice}/kg
            </div>
            <div className="text-sm text-gray-600">
              {language === 'hi' ? 'उचित मूल्य सीमा' : 'Fair Price Range'}: ₹{priceRange.min} - ₹{priceRange.max}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {language === 'hi' ? 'कुल मूल्य' : 'Total Value'}:
              </span>
              <span className="font-bold text-bharat-green-600">
                ₹{(calculatedPrice * quantity).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {language === 'hi' ? 'बाजार की प्रवृत्ति' : 'Market Trend'}:
              </span>
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={`font-medium ${
                  marketTrend === 'rising' ? 'text-green-600' : 
                  marketTrend === 'falling' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {getTrendText()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-white/50 rounded text-xs text-gray-600">
            <Calendar className="w-3 h-3 inline mr-1" />
            {language === 'hi' 
              ? `आधार: ${selectedLocation.name} मंडी दरें + ${selectedQuality.name} प्रीमियम`
              : `Based on: ${selectedLocation.name} mandi rates + ${selectedQuality.name} premium`
            }
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}