import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  BarChart3,
  Plus,
  Edit,
  Eye,
  Star,
  Clock,
  MapPin,
  Truck
} from 'lucide-react'
import { getTranslatedProductName, getTranslatedStatus, getTranslatedUI } from '../utils/dashboardTranslations'

export default function VendorDashboard({ 
  selectedLanguage, 
  messages, 
  currentPrice, 
  userStats,
  onAddProduct,
  onEditProduct,
  onViewOrders 
}) {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Basmati Rice',
      quantity: '500 kg',
      price: '₹85/kg',
      status: 'Available',
      image: '🌾',
      rating: 4.8,
      orders: 23
    },
    {
      id: 2,
      name: 'Organic Wheat',
      quantity: '300 kg',
      price: '₹45/kg',
      status: 'Low Stock',
      image: '🌾',
      rating: 4.6,
      orders: 15
    },
    {
      id: 3,
      name: 'Fresh Tomatoes',
      quantity: '200 kg',
      price: '₹35/kg',
      status: 'Available',
      image: '🍅',
      rating: 4.9,
      orders: 31
    }
  ])

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD001',
      buyer: 'Rajesh Kumar',
      product: 'Premium Basmati Rice',
      quantity: '50 kg',
      amount: '₹4,250',
      status: 'Pending',
      time: '2 hours ago'
    },
    {
      id: 'ORD002',
      buyer: 'Priya Sharma',
      product: 'Organic Wheat',
      quantity: '25 kg',
      amount: '₹1,125',
      status: 'Confirmed',
      time: '4 hours ago'
    },
    {
      id: 'ORD003',
      buyer: 'Amit Singh',
      product: 'Fresh Tomatoes',
      quantity: '15 kg',
      amount: '₹525',
      status: 'Delivered',
      time: '1 day ago'
    }
  ])

  const vendorStats = [
    {
      title: selectedLanguage === 'hi' ? 'कुल उत्पाद' : 'Total Products',
      value: products.length,
      icon: <Package className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      change: '+2 this week'
    },
    {
      title: selectedLanguage === 'hi' ? 'सक्रिय ऑर्डर' : 'Active Orders',
      value: recentOrders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length,
      icon: <Clock className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      change: '+5 today'
    },
    {
      title: selectedLanguage === 'hi' ? 'कुल आय' : 'Total Revenue',
      value: '₹45,230',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      change: '+12% this month'
    },
    {
      title: selectedLanguage === 'hi' ? 'रेटिंग' : 'Rating',
      value: '4.8',
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      change: '+0.2 this month'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Vendor Welcome Section */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedLanguage === 'hi' ? '🧑‍🌾 विक्रेता डैशबोर्ड' : '🧑‍🌾 Vendor Dashboard'}
            </h2>
            <p className="text-gray-600">
              {selectedLanguage === 'hi' 
                ? 'अपने उत्पादों और ऑर्डर का प्रबंधन करें'
                : 'Manage your products and orders efficiently'
              }
            </p>
          </div>
          <button 
            onClick={onAddProduct}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            {getTranslatedUI('Add Product', selectedLanguage)}
          </button>
        </div>

        {/* Vendor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vendorStats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Management */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedLanguage === 'hi' ? '📦 मेरे उत्पाद' : '📦 My Products'}
            </h3>
            <button className="btn-outline text-sm">
              <Eye className="w-4 h-4 mr-2" />
              {getTranslatedUI('View All', selectedLanguage)}
            </button>
          </div>

          <div className="space-y-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{product.image}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {getTranslatedProductName(product.name, selectedLanguage)}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{product.quantity}</span>
                      <span className="font-semibold text-saffron">{product.price}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getTranslatedStatus(product.status, selectedLanguage)}
                  </span>
                  <button 
                    onClick={() => onEditProduct(product.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card-premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedLanguage === 'hi' ? '📋 हाल के ऑर्डर' : '📋 Recent Orders'}
            </h3>
            <button 
              onClick={onViewOrders}
              className="btn-outline text-sm"
            >
              <Truck className="w-4 h-4 mr-2" />
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
                    <span className="text-gray-600">{order.buyer}</span>
                  </div>
                  <div>
                    {getTranslatedProductName(order.product, selectedLanguage)} • {order.quantity}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{order.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 mb-1">{order.amount}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getTranslatedStatus(order.status, selectedLanguage)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-premium">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {selectedLanguage === 'hi' ? '⚡ त्वरित कार्य' : '⚡ Quick Actions'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: selectedLanguage === 'hi' ? 'स्टॉक अपडेट' : 'Update Stock',
              icon: <Package className="w-6 h-6" />,
              color: 'from-blue-500 to-blue-600'
            },
            {
              title: selectedLanguage === 'hi' ? 'मूल्य सेट करें' : 'Set Prices',
              icon: <DollarSign className="w-6 h-6" />,
              color: 'from-green-500 to-green-600'
            },
            {
              title: selectedLanguage === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track Orders',
              icon: <Truck className="w-6 h-6" />,
              color: 'from-orange-500 to-orange-600'
            },
            {
              title: selectedLanguage === 'hi' ? 'रिपोर्ट देखें' : 'View Reports',
              icon: <BarChart3 className="w-6 h-6" />,
              color: 'from-purple-500 to-purple-600'
            }
          ].map((action, index) => (
            <motion.button
              key={index}
              className="card hover:shadow-lg transition-all duration-300 text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>
                {action.icon}
              </div>
              <p className="font-medium text-gray-900">{action.title}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}