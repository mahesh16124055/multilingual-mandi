import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LanguageSelector from '../../components/LanguageSelector'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }) => <button {...props}>{children}</button>,
    div: ({ children, initial, animate, exit, transition, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

describe('LanguageSelector', () => {
  const mockOnLanguageChange = jest.fn()

  beforeEach(() => {
    mockOnLanguageChange.mockClear()
  })

  test('renders with default English selection', () => {
    render(
      <LanguageSelector 
        selectedLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )
    
    expect(screen.getByText('English')).toBeInTheDocument()
    // English should not show any flag (no UK flag)
    expect(screen.queryByText('🇬🇧')).not.toBeInTheDocument()
  })

  test('renders with Hindi selection', () => {
    render(
      <LanguageSelector 
        selectedLanguage="hi" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )
    
    expect(screen.getByText('हिंदी')).toBeInTheDocument()
    expect(screen.getByText('🇮🇳')).toBeInTheDocument()
  })

  test('opens dropdown when clicked', async () => {
    render(
      <LanguageSelector 
        selectedLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Select Language / भाषा चुनें')).toBeInTheDocument()
    })
  })

  test('shows all available languages in dropdown', async () => {
    render(
      <LanguageSelector 
        selectedLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Select Language / भाषा चुनें')).toBeInTheDocument()
      expect(screen.getAllByText('English')).toHaveLength(3) // Button, dropdown title, dropdown subtitle
      expect(screen.getByText('हिंदी')).toBeInTheDocument()
      expect(screen.getByText('தமிழ்')).toBeInTheDocument()
      expect(screen.getByText('తెలుగు')).toBeInTheDocument()
      expect(screen.getByText('ಕನ್ನಡ')).toBeInTheDocument()
      expect(screen.getByText('मराठी')).toBeInTheDocument()
      expect(screen.getByText('বাংলা')).toBeInTheDocument()
    })
  })

  test('calls onLanguageChange when language is selected', async () => {
    render(
      <LanguageSelector 
        selectedLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      const hindiOptions = screen.getAllByText('हिंदी')
      // Click the one in the dropdown (not the button)
      fireEvent.click(hindiOptions[hindiOptions.length - 1])
    })
    
    expect(mockOnLanguageChange).toHaveBeenCalledWith('hi')
  })

  test('shows check mark for selected language', async () => {
    render(
      <LanguageSelector 
        selectedLanguage="hi" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      // Find the dropdown button with the selected styling
      const dropdownButtons = screen.getAllByRole('button')
      const selectedButton = dropdownButtons.find(btn => 
        btn.classList.contains('bg-gradient-to-r') && 
        btn.classList.contains('from-saffron-subtle')
      )
      
      expect(selectedButton).toBeInTheDocument()
      expect(selectedButton).toHaveClass('bg-gradient-to-r', 'from-saffron-subtle', 'to-green-subtle')
      
      // Check if check icon SVG is present
      const checkIcon = selectedButton.querySelector('svg.text-saffron')
      expect(checkIcon).toBeInTheDocument()
    })
  })

  test('handles invalid language code gracefully', () => {
    render(
      <LanguageSelector 
        selectedLanguage="invalid" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )
    
    // Should fallback to English
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  test('has proper accessibility attributes', () => {
    render(
      <LanguageSelector 
        selectedLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
  })
})