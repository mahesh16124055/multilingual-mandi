import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ImpactSection from '../../components/ImpactSection'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

describe('ImpactSection', () => {
  test('renders impact section with default English content', () => {
    render(<ImpactSection />)
    
    expect(screen.getByText('🌾 How Multilingual Mandi Transforms Lives')).toBeInTheDocument()
    expect(screen.getByText('🚧 Problems We Address')).toBeInTheDocument()
    expect(screen.getByText('👥 Who Benefits')).toBeInTheDocument()
    expect(screen.getByText('🌍 Broader Social Impact')).toBeInTheDocument()
    expect(screen.getByText('💝 Real Story')).toBeInTheDocument()
  })

  test('renders Hindi content when language is set to Hindi', () => {
    render(<ImpactSection selectedLanguage="hi" />)
    
    expect(screen.getByText('🌾 बहुभाषी मंडी जीवन कैसे बदलती है')).toBeInTheDocument()
    expect(screen.getByText('🚧 हम जिन समस्याओं का समाधान करते हैं')).toBeInTheDocument()
    expect(screen.getByText('👥 कौन लाभान्वित होता है')).toBeInTheDocument()
  })

  test('displays problems we address with before/after format', () => {
    render(<ImpactSection />)
    
    expect(screen.getByText('Language barriers')).toBeInTheDocument()
    expect(screen.getByText('Direct multilingual negotiation in 7 Indian languages')).toBeInTheDocument()
    expect(screen.getByText('Middlemen cuts')).toBeInTheDocument()
    expect(screen.getByText('AI-driven fair price discovery and smart negotiation')).toBeInTheDocument()
  })

  test('shows benefits for different user types', () => {
    render(<ImpactSection />)
    
    expect(screen.getByText('🧑‍🌾 Farmers')).toBeInTheDocument()
    expect(screen.getByText('🛒 Buyers & Retailers')).toBeInTheDocument()
    expect(screen.getByText('🤝 Cooperatives')).toBeInTheDocument()
    
    expect(screen.getByText('Direct access to nationwide buyers')).toBeInTheDocument()
    expect(screen.getByText('Premium produce from across India')).toBeInTheDocument()
    expect(screen.getByText('Bulk selling advantages')).toBeInTheDocument()
  })

  test('displays broader social impact items', () => {
    render(<ImpactSection />)
    
    expect(screen.getByText('Economic empowerment of rural communities')).toBeInTheDocument()
    expect(screen.getByText('Social inclusion through language equality')).toBeInTheDocument()
    expect(screen.getByText('Alignment with Viksit Bharat 2047 & Digital India')).toBeInTheDocument()
    expect(screen.getByText('Sustainable agricultural development')).toBeInTheDocument()
  })

  test('shows real story with farmer example', () => {
    render(<ImpactSection />)
    
    expect(screen.getByText(/Ravi, a tomato farmer in Karnataka/)).toBeInTheDocument()
    expect(screen.getByText('— Ravi Kumar, Tomato Farmer')).toBeInTheDocument()
    expect(screen.getByText('Karnataka')).toBeInTheDocument()
  })

  test('displays call to action button', () => {
    render(<ImpactSection />)
    
    expect(screen.getByText('Start Making Impact Today')).toBeInTheDocument()
  })

  test('shows Hindi call to action when language is Hindi', () => {
    render(<ImpactSection selectedLanguage="hi" />)
    
    expect(screen.getByText('आज ही शुरू करें')).toBeInTheDocument()
  })

  test('falls back to English when unsupported language is provided', () => {
    render(<ImpactSection selectedLanguage="unsupported" />)
    
    expect(screen.getByText('🌾 How Multilingual Mandi Transforms Lives')).toBeInTheDocument()
    expect(screen.getByText('Start Making Impact Today')).toBeInTheDocument()
  })
})