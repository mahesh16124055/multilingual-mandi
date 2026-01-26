import { motion } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  Globe, 
  Heart,
  Zap,
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function ImpactSection({ selectedLanguage = 'en' }) {
  const impactContent = {
    en: {
      title: '🌾 How Multilingual Mandi Transforms Lives',
      subtitle: 'Breaking barriers, building bridges, empowering communities',
      problems: {
        title: '🚧 Problems We Address',
        items: [
          {
            icon: <Globe className="w-5 h-5" />,
            before: 'Language barriers',
            after: 'Direct multilingual negotiation in 7 Indian languages',
            description: 'Farmers and buyers speaking different languages, middlemen exploiting the gap'
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            before: 'Middlemen cuts',
            after: 'AI-driven fair price discovery and smart negotiation',
            description: 'Unfair pricing and lack of transparency in agricultural markets'
          },
          {
            icon: <Users className="w-5 h-5" />,
            before: 'Local-only markets',
            after: 'National marketplace connecting farmers and buyers across states',
            description: 'Limited market access beyond local mandis'
          }
        ]
      },
      benefits: {
        title: '👥 Who Benefits',
        farmers: {
          title: '🧑‍🌾 Farmers',
          points: ['Direct access to nationwide buyers', 'AI fair pricing guidance', 'Higher profits (30-50% increase)', 'Native language support']
        },
        buyers: {
          title: '🛒 Buyers & Retailers',
          points: ['Premium produce from across India', 'Better prices through direct sourcing', 'Quality ratings and farmer profiles', 'Reliable supply chains']
        },
        cooperatives: {
          title: '🤝 Cooperatives',
          points: ['Bulk selling advantages', 'Better negotiation rates', 'Easy multilingual interface', 'Community empowerment']
        }
      },
      impact: {
        title: '🌍 Broader Social Impact',
        items: [
          'Economic empowerment of rural communities',
          'Social inclusion through language equality',
          'Alignment with Viksit Bharat 2047 & Digital India',
          'Sustainable agricultural development'
        ]
      },
      story: {
        title: '💝 Real Story',
        content: 'Ravi, a tomato farmer in Karnataka, uses Kannada to negotiate directly with a restaurant in Bengaluru. With AI price guidance, he earns 30-40% more than selling to local middlemen.',
        author: 'Ravi Kumar, Tomato Farmer',
        location: 'Karnataka'
      }
    },
    hi: {
      title: '🌾 बहुभाषी मंडी जीवन कैसे बदलती है',
      subtitle: 'बाधाओं को तोड़ना, पुल बनाना, समुदायों को सशक्त बनाना',
      problems: {
        title: '🚧 हम जिन समस्याओं का समाधान करते हैं',
        items: [
          {
            icon: <Globe className="w-5 h-5" />,
            before: 'भाषा की बाधाएं',
            after: '7 भारतीय भाषाओं में प्रत्यक्ष बहुभाषी बातचीत',
            description: 'किसान और खरीदार अलग भाषाएं बोलते हैं, बिचौलिए इसका फायदा उठाते हैं'
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            before: 'बिचौलियों का कमीशन',
            after: 'AI-संचालित उचित मूल्य खोज और स्मार्ट बातचीत',
            description: 'कृषि बाजारों में अनुचित मूल्य निर्धारण और पारदर्शिता की कमी'
          },
          {
            icon: <Users className="w-5 h-5" />,
            before: 'केवल स्थानीय बाजार',
            after: 'राज्यों में किसानों और खरीदारों को जोड़ने वाला राष्ट्रीय बाजार',
            description: 'स्थानीय मंडियों से आगे सीमित बाजार पहुंच'
          }
        ]
      },
      benefits: {
        title: '👥 कौन लाभान्वित होता है',
        farmers: {
          title: '🧑‍🌾 किसान',
          points: ['राष्ट्रव्यापी खरीदारों तक प्रत्यक्ष पहुंच', 'AI उचित मूल्य मार्गदर्शन', 'अधिक लाभ (30-50% वृद्धि)', 'मातृभाषा समर्थन']
        },
        buyers: {
          title: '🛒 खरीदार और रिटेलर',
          points: ['भारत भर से प्रीमियम उत्पाद', 'प्रत्यक्ष सोर्सिंग के माध्यम से बेहतर कीमतें', 'गुणवत्ता रेटिंग और किसान प्रोफाइल', 'विश्वसनीय आपूर्ति श्रृंखला']
        },
        cooperatives: {
          title: '🤝 सहकारी समितियां',
          points: ['थोक बिक्री के फायदे', 'बेहतर बातचीत दरें', 'आसान बहुभाषी इंटरफेस', 'समुदायिक सशक्तिकरण']
        }
      },
      impact: {
        title: '🌍 व्यापक सामाजिक प्रभाव',
        items: [
          'ग्रामीण समुदायों का आर्थिक सशक्तिकरण',
          'भाषा समानता के माध्यम से सामाजिक समावेश',
          'विकसित भारत 2047 और डिजिटल इंडिया के साथ तालमेल',
          'टिकाऊ कृषि विकास'
        ]
      },
      story: {
        title: '💝 वास्तविक कहानी',
        content: 'कर्नाटक के टमाटर किसान रवि कन्नड़ में बेंगलुरु के एक रेस्टोरेंट के साथ सीधे बातचीत करते हैं। AI मूल्य मार्गदर्शन के साथ, वे स्थानीय बिचौलियों को बेचने की तुलना में 30-40% अधिक कमाते हैं।',
        author: 'रवि कुमार, टमाटर किसान',
        location: 'कर्नाटक'
      }
    }
  }

  const content = impactContent[selectedLanguage] || impactContent.en

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{content.title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.subtitle}</p>
      </div>

      {/* Problems We Address */}
      <div className="card-premium">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          {content.problems.title}
        </h3>
        <div className="space-y-4">
          {content.problems.items.map((problem, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center text-red-600">
                {problem.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-red-600 font-medium line-through">{problem.before}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-green-600 font-semibold">{problem.after}</span>
                </div>
                <p className="text-sm text-gray-600">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Who Benefits */}
      <div className="card-premium">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{content.benefits.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(content.benefits).filter(([key]) => key !== 'title').map(([key, benefit], index) => (
            <motion.div
              key={key}
              className="card hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-gray-900 mb-3">{benefit.title}</h4>
              <ul className="space-y-2">
                {benefit.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Broader Social Impact */}
      <div className="card-premium bg-gradient-to-r from-saffron-subtle to-green-subtle">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          {content.impact.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.impact.items.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-saffron to-orange-600 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-800 font-medium">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real Story */}
      <motion.div
        className="card-premium border-l-4 border-saffron bg-gradient-to-r from-orange-50 to-yellow-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-saffron to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-2">{content.story.title}</h4>
            <p className="text-gray-700 mb-3 leading-relaxed">{content.story.content}</p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold text-saffron">— {content.story.author}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{content.story.location}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <div className="text-center">
        <motion.div
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-saffron to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-5 h-5" />
          <span>{selectedLanguage === 'hi' ? 'आज ही शुरू करें' : 'Start Making Impact Today'}</span>
        </motion.div>
      </div>
    </div>
  )
}