// Dashboard tab translations for all 7 languages
export const dashboardTabTranslations = {
  en: {
    dashboard: 'Dashboard',
    products: 'My Products',
    orders: 'Orders',
    chat: 'Chat',
    impact: 'Impact & Stories',
    analytics: 'Analytics',
    settings: 'Settings',
    browse: 'Browse Products',
    myOrders: 'My Orders',
    wishlist: 'Wishlist',
    priceCalculator: 'Price Calculator'
  },
  
  hi: {
    dashboard: 'डैशबोर्ड',
    products: 'मेरे उत्पाद',
    orders: 'ऑर्डर',
    chat: 'चैट',
    impact: 'प्रभाव और कहानियां',
    analytics: 'विश्लेषण',
    settings: 'सेटिंग्स',
    browse: 'उत्पाद खोजें',
    myOrders: 'मेरे ऑर्डर',
    wishlist: 'पसंदीदा',
    priceCalculator: 'मूल्य कैलकुलेटर'
  },
  
  ta: {
    dashboard: 'டாஷ்போர்டு',
    products: 'என் பொருட்கள்',
    orders: 'ஆர்டர்கள்',
    chat: 'அரட்டை',
    impact: 'தாக்கம் & கதைகள்',
    analytics: 'பகுப்பாய்வு',
    settings: 'அமைப்புகள்',
    browse: 'பொருட்களை உலாவு',
    myOrders: 'என் ஆர்டர்கள்',
    wishlist: 'விருப்பப்பட்டியல்',
    priceCalculator: 'விலை கணிப்பான்'
  },
  
  te: {
    dashboard: 'డాష్‌బోర్డ్',
    products: 'నా ఉత్పత్తులు',
    orders: 'ఆర్డర్లు',
    chat: 'చాట్',
    impact: 'ప్రభావం & కథలు',
    analytics: 'విశ్లేషణలు',
    settings: 'సెట్టింగులు',
    browse: 'ఉత్పత్తులను బ్రౌజ్ చేయండి',
    myOrders: 'నా ఆర్డర్లు',
    wishlist: 'విష్‌లిస్ట్',
    priceCalculator: 'ధర కాలిక్యులేటర్'
  },
  
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    products: 'ನನ್ನ ಉತ್ಪನ್ನಗಳು',
    orders: 'ಆರ್ಡರ್‌ಗಳು',
    chat: 'ಚಾಟ್',
    impact: 'ಪ್ರಭಾವ & ಕಥೆಗಳು',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    browse: 'ಉತ್ಪನ್ನಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
    myOrders: 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು',
    wishlist: 'ವಿಶ್‌ಲಿಸ್ಟ್',
    priceCalculator: 'ಬೆಲೆ ಕ್ಯಾಲ್ಕುಲೇಟರ್'
  },
  
  mr: {
    dashboard: 'डॅशबोर्ड',
    products: 'माझी उत्पादने',
    orders: 'ऑर्डर',
    chat: 'चॅट',
    impact: 'प्रभाव आणि कथा',
    analytics: 'विश्लेषण',
    settings: 'सेटिंग्ज',
    browse: 'उत्पादने ब्राउझ करा',
    myOrders: 'माझे ऑर्डर',
    wishlist: 'विशलिस्ट',
    priceCalculator: 'किंमत कॅल्क्युलेटर'
  },
  
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    products: 'আমার পণ্য',
    orders: 'অর্ডার',
    chat: 'চ্যাট',
    impact: 'প্রভাব ও গল্প',
    analytics: 'বিশ্লেষণ',
    settings: 'সেটিংস',
    browse: 'পণ্য ব্রাউজ করুন',
    myOrders: 'আমার অর্ডার',
    wishlist: 'উইশলিস্ট',
    priceCalculator: 'দাম ক্যালকুলেটর'
  }
}

// Helper function to get dashboard tab translation
export const getDashboardTranslation = (language, key) => {
  return dashboardTabTranslations[language]?.[key] || dashboardTabTranslations.en[key] || key
}