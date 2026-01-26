-- Multilingual Mandi Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    user_type VARCHAR(20) CHECK (user_type IN ('vendor', 'buyer')) NOT NULL,
    preferred_language VARCHAR(5) DEFAULT 'en',
    location VARCHAR(100),
    phone VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id VARCHAR(100) NOT NULL, -- Socket ID for anonymous users
    receiver_id VARCHAR(100),
    message TEXT NOT NULL,
    language VARCHAR(5) DEFAULT 'en',
    translated_message TEXT,
    sender_type VARCHAR(20) CHECK (sender_type IN ('vendor', 'buyer')),
    room_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id VARCHAR(100),
    buyer_id VARCHAR(100),
    crop VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    quality_grade VARCHAR(20),
    location VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')) DEFAULT 'pending',
    negotiation_history JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price_history table
CREATE TABLE IF NOT EXISTS public.price_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    crop VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quality_grade VARCHAR(20),
    volume INTEGER,
    source VARCHAR(50) DEFAULT 'user_reported',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_name VARCHAR(100) UNIQUE NOT NULL,
    participants JSONB NOT NULL DEFAULT '[]',
    language VARCHAR(5) DEFAULT 'en',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create translations_cache table
CREATE TABLE IF NOT EXISTS public.translations_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    from_language VARCHAR(5) NOT NULL,
    to_language VARCHAR(5) NOT NULL,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(original_text, from_language, to_language)
);

-- Create market_data table
CREATE TABLE IF NOT EXISTS public.market_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    crop VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    avg_price DECIMAL(10,2) NOT NULL,
    volume INTEGER,
    quality_grade VARCHAR(20),
    trend VARCHAR(20) CHECK (trend IN ('rising', 'stable', 'falling')),
    date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'aggregated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(crop, location, date, quality_grade)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    socket_id VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id),
    user_type VARCHAR(20),
    language VARCHAR(5) DEFAULT 'en',
    location VARCHAR(100),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);

CREATE INDEX IF NOT EXISTS idx_deals_vendor_id ON public.deals(vendor_id);
CREATE INDEX IF NOT EXISTS idx_deals_buyer_id ON public.deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_price_history_crop ON public.price_history(crop);
CREATE INDEX IF NOT EXISTS idx_price_history_location ON public.price_history(location);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON public.price_history(recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_market_data_crop_location ON public.market_data(crop, location);
CREATE INDEX IF NOT EXISTS idx_market_data_date ON public.market_data(date DESC);

CREATE INDEX IF NOT EXISTS idx_user_sessions_socket_id ON public.user_sessions(socket_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Messages: Users can see messages in their rooms
CREATE POLICY "Users can view messages" ON public.messages
    FOR SELECT USING (true); -- Allow all for demo, restrict in production

CREATE POLICY "Users can insert messages" ON public.messages
    FOR INSERT WITH CHECK (true); -- Allow all for demo

-- Deals: Users can see deals they're involved in
CREATE POLICY "Users can view own deals" ON public.deals
    FOR SELECT USING (true); -- Allow all for demo

CREATE POLICY "Users can create deals" ON public.deals
    FOR INSERT WITH CHECK (true); -- Allow all for demo

CREATE POLICY "Users can update own deals" ON public.deals
    FOR UPDATE USING (true); -- Allow all for demo

-- Price history: Read-only for all users
CREATE POLICY "Anyone can view price history" ON public.price_history
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert price history" ON public.price_history
    FOR INSERT WITH CHECK (true);

-- Market data: Read-only for all users
CREATE POLICY "Anyone can view market data" ON public.market_data
    FOR SELECT USING (true);

-- Chat rooms: Users can see active rooms
CREATE POLICY "Users can view active chat rooms" ON public.chat_rooms
    FOR SELECT USING (active = true);

-- Translations cache: Read-only for all
CREATE POLICY "Anyone can view translations" ON public.translations_cache
    FOR SELECT USING (true);

CREATE POLICY "System can insert translations" ON public.translations_cache
    FOR INSERT WITH CHECK (true);

-- User sessions: Users can see active sessions
CREATE POLICY "Users can view active sessions" ON public.user_sessions
    FOR SELECT USING (active = true);

CREATE POLICY "System can manage sessions" ON public.user_sessions
    FOR ALL USING (true);

-- Insert sample data
INSERT INTO public.market_data (crop, location, min_price, max_price, avg_price, volume, quality_grade, trend, date) VALUES
('rice', 'hyderabad', 23.00, 27.00, 25.00, 1000, 'grade-a', 'stable', CURRENT_DATE),
('wheat', 'hyderabad', 20.00, 24.00, 22.00, 800, 'grade-a', 'rising', CURRENT_DATE),
('tomato', 'hyderabad', 25.00, 35.00, 30.00, 500, 'grade-a', 'falling', CURRENT_DATE),
('onion', 'hyderabad', 15.00, 21.00, 18.00, 1200, 'grade-a', 'stable', CURRENT_DATE),
('potato', 'hyderabad', 12.00, 18.00, 15.00, 900, 'grade-a', 'rising', CURRENT_DATE),

('rice', 'delhi', 28.00, 32.00, 30.00, 800, 'grade-a', 'stable', CURRENT_DATE),
('wheat', 'delhi', 24.00, 28.00, 26.00, 600, 'grade-a', 'rising', CURRENT_DATE),
('tomato', 'delhi', 35.00, 45.00, 40.00, 400, 'grade-a', 'falling', CURRENT_DATE),
('onion', 'delhi', 20.00, 26.00, 23.00, 1000, 'grade-a', 'stable', CURRENT_DATE),
('potato', 'delhi', 16.00, 22.00, 19.00, 700, 'grade-a', 'rising', CURRENT_DATE),

('rice', 'mumbai', 30.00, 35.00, 32.50, 600, 'grade-a', 'stable', CURRENT_DATE),
('wheat', 'mumbai', 26.00, 30.00, 28.00, 500, 'grade-a', 'rising', CURRENT_DATE),
('tomato', 'mumbai', 38.00, 48.00, 43.00, 300, 'grade-a', 'falling', CURRENT_DATE),
('onion', 'mumbai', 22.00, 28.00, 25.00, 800, 'grade-a', 'stable', CURRENT_DATE),
('potato', 'mumbai', 18.00, 24.00, 21.00, 600, 'grade-a', 'rising', CURRENT_DATE);

-- Insert sample price history (last 30 days)
DO $$
DECLARE
    crop_name TEXT;
    location_name TEXT;
    base_price DECIMAL;
    i INTEGER;
    price_variation DECIMAL;
BEGIN
    FOR crop_name, location_name, base_price IN 
        SELECT 'rice', 'hyderabad', 25.00
        UNION SELECT 'wheat', 'hyderabad', 22.00
        UNION SELECT 'tomato', 'hyderabad', 30.00
        UNION SELECT 'rice', 'delhi', 30.00
        UNION SELECT 'wheat', 'delhi', 26.00
    LOOP
        FOR i IN 1..30 LOOP
            price_variation := base_price * (0.9 + random() * 0.2); -- ±10% variation
            INSERT INTO public.price_history (crop, location, price, quality_grade, volume, recorded_at)
            VALUES (
                crop_name,
                location_name,
                ROUND(price_variation, 2),
                'grade-a',
                (500 + random() * 1000)::INTEGER,
                CURRENT_DATE - INTERVAL '1 day' * i
            );
        END LOOP;
    END LOOP;
END $$;

-- Create functions for real-time features
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify connected clients about new message
    PERFORM pg_notify('new_message', json_build_object(
        'id', NEW.id,
        'sender_id', NEW.sender_id,
        'message', NEW.message,
        'language', NEW.language,
        'sender_type', NEW.sender_type,
        'room_id', NEW.room_id,
        'created_at', NEW.created_at
    )::text);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new messages
CREATE TRIGGER on_message_created
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

-- Create function to update last activity
CREATE OR REPLACE FUNCTION public.update_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_rooms 
    SET last_activity = NOW() 
    WHERE room_name = NEW.room_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update room activity
CREATE TRIGGER on_message_update_activity
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_last_activity();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create view for active deals with user info
CREATE OR REPLACE VIEW public.active_deals_view AS
SELECT 
    d.*,
    vp.location as vendor_location,
    vp.preferred_language as vendor_language,
    bp.location as buyer_location,
    bp.preferred_language as buyer_language
FROM public.deals d
LEFT JOIN public.user_profiles vp ON d.vendor_id::uuid = vp.id
LEFT JOIN public.user_profiles bp ON d.buyer_id::uuid = bp.id
WHERE d.status IN ('pending', 'accepted');

-- Create view for market trends
CREATE OR REPLACE VIEW public.market_trends_view AS
SELECT 
    crop,
    location,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price,
    COUNT(*) as data_points,
    DATE_TRUNC('day', recorded_at) as date
FROM public.price_history
WHERE recorded_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY crop, location, DATE_TRUNC('day', recorded_at)
ORDER BY date DESC;

COMMENT ON TABLE public.user_profiles IS 'Extended user profiles for vendors and buyers';
COMMENT ON TABLE public.messages IS 'Chat messages with translation support';
COMMENT ON TABLE public.deals IS 'Trading deals between vendors and buyers';
COMMENT ON TABLE public.price_history IS 'Historical price data for crops';
COMMENT ON TABLE public.market_data IS 'Current market data and trends';
COMMENT ON TABLE public.chat_rooms IS 'Chat rooms for different language groups';
COMMENT ON TABLE public.translations_cache IS 'Cached translations for performance';
COMMENT ON TABLE public.user_sessions IS 'Active user sessions via WebSocket';