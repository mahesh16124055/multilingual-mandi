import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  MapPin,
  Filter,
  Star,
  Clock,
  Truck,
  CreditCard,
  Eye,
  Plus
} from 'lucide-react'
import { getTranslatedProductName, getTranslatedStatus, getTranslatedCategory, getTranslatedUI } from '../utils/dashboardTranslations'

export default function BuyerDashboard({ 
  selectedLanguage, 
  messages, 
  currentPrice, 
  userStats,
  onSearchProducts,
  onViewCart,
  onViewOrders 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [quantities, setQuantities] = useState({}) // Track quantities for each product
  const [hoveredProduct, setHoveredProduct] = useState(null) // Track which product is being hovered
  
  const [availableProducts, setAvailableProducts] = useState([
    {
      id: 1,
      name: 'Premium Basmati Rice',
      vendor: 'Ramesh Farms',
      vendorHi: 'रमेश फार्म्स',
      price: '₹85/kg',
      originalPrice: '₹95/kg',
      rating: 4.8,
      reviews: 156,
      image: '🌾',
      location: 'Punjab',
      inStock: true,
      discount: '11% off',
      category: 'grains'
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      vendor: 'Green Valley',
      vendorHi: 'ग्रीन वैली',
      price: '₹35/kg',
      originalPrice: '₹40/kg',
      rating: 4.9,
      reviews: 89,
      image: '🍅',
      location: 'Maharashtra',
      inStock: true,
      discount: '12% off',
      category: 'vegetables'
    },
    {
      id: 3,
      name: 'Fresh Onions',
      vendor: 'Kisan Cooperative',
      vendorHi: 'किसान सहकारी',
      price: '₹25/kg',
      originalPrice: '₹30/kg',
      rating: 4.6,
      reviews: 234,
      image: '🧅',
      location: 'Rajasthan',
      inStock: true,
      discount: '17% off',
      category: 'vegetables'
    },
    {
      id: 4,
      name: 'Organic Wheat',
      vendor: 'Organic Farms Ltd',
      vendorHi: 'ऑर्गेनिक फार्म्स लिमिटेड',
      price: '₹45/kg',
      originalPrice: '₹50/kg',
      rating: 4.7,
      reviews: 67,
      image: '🌾',
      location: 'Haryana',
      inStock: false,
      discount: '10% off',
      category: 'grains'
    }
  ])

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD001',
      vendor: 'Ramesh Farms',
      product: 'Premium Basmati Rice',
      quantity: '25 kg',
      amount: '₹2,125',
      status: 'Delivered',
      time: '2 days ago',
      rating: 5
    },
    {
      id: 'ORD002',
      vendor: 'Green Valley',
      product: 'Fresh Tomatoes',
      quantity: '10 kg',
      amount: '₹350',
      status: 'In Transit',
      time: '1 day ago',
      rating: null
    },
    {
      id: 'ORD003',
      vendor: 'Local Vendor',
      product: 'Fresh Potatoes',
      quantity: '15 kg',
      amount: '₹450',
      status: 'Processing',
      time: '3 hours ago',
      rating: null
    }
  ])

  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Premium Almonds', price: '₹650/kg' },
    { id: 2, name: 'Organic Honey', price: '₹280/500g' },
    { id: 3, name: 'Fresh Mangoes', price: '₹120/kg' }
  ])

  const categories = [
    { id: 'all', name: getTranslatedCategory('All', selectedLanguage), icon: '🛒' },
    { id: 'vegetables', name: getTranslatedCategory('Vegetables', selectedLanguage), icon: '🥬' },
    { id: 'fruits', name: getTranslatedCategory('Fruits', selectedLanguage), icon: '🍎' },
    { id: 'grains', name: getTranslatedCategory('Grains', selectedLanguage), icon: '🌾' },
    { id: 'dairy', name: getTranslatedCategory('Dairy', selectedLanguage), icon: '🥛' }
  ]

  const buyerStats = [
    {
      title: selectedLanguage === 'hi' ? 'कुल ऑर्डर' : 'Total Orders',
      value: recentOrders.length + 15,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      change: '+3 this week'
    },
    {
      title: selectedLanguage === 'hi' ? 'पसंदीदा' : 'Wishlist',
      value: wishlist.length,
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600',
      change: '+2 items'
    },
    {
      title: selectedLanguage === 'hi' ? 'कुल खर्च' : 'Total Spent',
      value: '₹12,450',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      change: '+8% this month'
    },
    {
      title: selectedLanguage === 'hi' ? 'बचत' : 'Savings',
      value: '₹1,230',
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      change: 'From discounts'
    }
  ]

  const filteredProducts = availableProducts.filter(product => {
    const translatedName = getTranslatedProductName(product.name, selectedLanguage)
    const matchesSearch = translatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }))
  }

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1
    console.log(`Adding ${quantity} units of ${product.name} to cart`)
    // Here you would typically call an API or update global state
    // For now, we'll just show a visual feedback
    alert(`Added ${quantity} kg of ${product.name} to cart!`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Buyer Welcome Section */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedLanguage === 'hi' ? '🛒 खरीदार डैशबोर्ड' : '🛒 Buyer Dashboard'}
            </h2>
            <p className="text-gray-600">
              {selectedLanguage === 'hi' 
                ? 'सर्वोत्तम उत्पाद खोजें और ऑर्डर करें'
                : 'Discover and order the best products from local vendors'
              }
            </p>
          </div>
          <button 
            onClick={onViewCart}
            className="btn-secondary"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {getTranslatedUI('View Cart', selectedLanguage)}
          </button>
        </div>

        {/* Buyer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {buyerStats.map((stat, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search and Categories */}
      <div className="card-premium">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={getTranslatedUI('Search products...', selectedLanguage)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern pl-10"
            />
          </div>
          <button 
            onClick={onSearchProducts}
            className="btn-primary"
          >
            <Filter className="w-5 h-5 mr-2" />
            {selectedLanguage === 'hi' ? 'फिल्टर' : 'Filters'}
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-saffron text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Available Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="card hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="text-4xl mb-3">{product.image}</div>
                {product.discount && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {product.discount}
                  </span>
                )}
                {!product.inStock && (
                  <span className="absolute top-0 left-0 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                    {getTranslatedStatus('Out of Stock', selectedLanguage)}
                  </span>
                )}
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">
                {getTranslatedProductName(product.name, selectedLanguage)}
              </h4>
              
              <p className="text-sm text-gray-600 mb-2">
                {selectedLanguage === 'hi' ? product.vendorHi : product.vendor}
              </p>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                  )}
                </div>
                
                {/* Quantity controls - simple and always visible */}
                {product.inStock && (
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">
                      {quantities[product.id] || 1}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              
              {/* Cart buttons - simple and always visible */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleAddToCart(product)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    product.inStock
                      ? 'bg-orange-400 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{getTranslatedUI('Add to Cart', selectedLanguage)}</span>
                </button>
                
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all duration-200">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-pink-500 transition-colors" />
                </button>
              </div>
              
              {/* Remove the overlay effect */}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedLanguage === 'hi' ? '📦 हाल के ऑर्डर' : '📦 Recent Orders'}
            </h3>
            <button 
              onClick={onViewOrders}
              className="btn-outline text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              {selectedLanguage === 'hi' ? 'सभी ऑर्डर' : 'All Orders'}
            </button>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">#{order.id}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">{order.vendor}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getTranslatedProductName(order.product, selectedLanguage)} • {order.quantity}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{order.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 mb-1">{order.amount}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getTranslatedStatus(order.status, selectedLanguage)}
                  </span>
                  {order.rating && (
                    <div className="flex items-center justify-end mt-1">
                      {[...Array(order.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Wishlist */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedLanguage === 'hi' ? '❤️ पसंदीदा' : '❤️ Wishlist'}
            </h3>
            <button className="btn-outline text-sm">
              <Plus className="w-4 h-4 mr-2" />
              {selectedLanguage === 'hi' ? 'जोड़ें' : 'Add More'}
            </button>
          </div>

          <div className="space-y-3">
            {wishlist.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{getTranslatedProductName(item.name, selectedLanguage)}</p>
                  <p className="text-sm text-saffron font-bold">{item.price}</p>
                </div>
                <button className="bg-gradient-to-r from-saffron to-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105">
                  <ShoppingCart className="w-4 h-4" />
                  <span>{getTranslatedUI('Add to Cart', selectedLanguage)}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}