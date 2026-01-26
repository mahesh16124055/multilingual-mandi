import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PriceCalculator from '../../components/PriceCalculator'

// Mock the price calculation
const mockOnPriceUpdate = jest.fn()

describe('PriceCalculator', () => {
  beforeEach(() => {
    mockOnPriceUpdate.mockClear()
  })

  test('renders price calculator with default values', () => {
    render(
      <PriceCalculator 
        userType="vendor" 
        language="en" 
        onPriceUpdate={mockOnPriceUpdate} 
      />
    )
    
    expect(screen.getByText('Price Calculator')).toBeInTheDocument()
    expect(screen.getByText('Select Crop')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Quality Grade')).toBeInTheDocument()
  })

  test('calculates price when crop is selected', async () => {
    render(
      <PriceCalculator 
        userType="vendor" 
        language="en" 
        onPriceUpdate={mockOnPriceUpdate} 
      />
    )
    
    const cropSelect = screen.getByDisplayValue('Rice')
    fireEvent.change(cropSelect, { target: { value: 'Wheat' } })
    
    await waitFor(() => {
      expect(mockOnPriceUpdate).toHaveBeenCalled()
    })
  })

  test('updates quantity and recalculates price', async () => {
    render(
      <PriceCalculator 
        userType="vendor" 
        language="en" 
        onPriceUpdate={mockOnPriceUpdate} 
      />
    )
    
    const quantityInput = screen.getByDisplayValue('100')
    fireEvent.change(quantityInput, { target: { value: '200' } })
    
    await waitFor(() => {
      expect(mockOnPriceUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 200
        })
      )
    })
  })

  test('displays price in Hindi when language is set to Hindi', () => {
    render(
      <PriceCalculator 
        userType="vendor" 
        language="hi" 
        onPriceUpdate={mockOnPriceUpdate} 
      />
    )
    
    expect(screen.getByText('मूल्य कैलकुलेटर')).toBeInTheDocument()
    expect(screen.getByText('फसल चुनें')).toBeInTheDocument()
  })

  test('handles invalid quantity input gracefully', () => {
    render(
      <PriceCalculator 
        userType="vendor" 
        language="en" 
        onPriceUpdate={mockOnPriceUpdate} 
      />
    )
    
    const quantityInput = screen.getByDisplayValue('100')
    fireEvent.change(quantityInput, { target: { value: '-10' } })
    
    // Should not crash and should handle negative values
    expect(quantityInput).toBeInTheDocument()
  })
})