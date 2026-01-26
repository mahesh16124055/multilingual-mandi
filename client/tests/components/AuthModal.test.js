import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthModal from '../../components/AuthModal'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, onClick, ...props }) => 
      <div onClick={onClick} {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, ...props }) => 
      <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

// Mock Supabase
const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    resetPasswordForEmail: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }))
      }))
    })),
    insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
  }))
}

jest.mock('../../pages/_app', () => ({
  useSupabase: () => ({ supabase: mockSupabase })
}))

// Mock PerfectFlag component
jest.mock('../../components/PerfectFlag', () => {
  return function MockPerfectFlag({ size }) {
    return <div data-testid="perfect-flag">Flag {size}</div>
  }
})

describe('AuthModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    selectedLanguage: 'en',
    initialMode: 'login',
    userType: 'vendor'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders login modal when open', () => {
    render(<AuthModal {...defaultProps} />)
    
    expect(screen.getByText('Vendor Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  test('renders signup modal when mode is signup', () => {
    render(<AuthModal {...defaultProps} initialMode="signup" />)
    
    expect(screen.getByText('Join as Vendor')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your phone number')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your city/location')).toBeInTheDocument()
    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  test('renders buyer modal when userType is buyer', () => {
    render(<AuthModal {...defaultProps} userType="buyer" />)
    
    expect(screen.getByText('Buyer Login')).toBeInTheDocument()
  })

  test('does not render when closed', () => {
    render(<AuthModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Vendor Login')).not.toBeInTheDocument()
  })

  test('switches between login and signup modes', async () => {
    render(<AuthModal {...defaultProps} />)
    
    // Initially in login mode
    expect(screen.getByText('Vendor Login')).toBeInTheDocument()
    
    // Click signup link
    fireEvent.click(screen.getByText('Sign up here'))
    
    await waitFor(() => {
      expect(screen.getByText('Join as Vendor')).toBeInTheDocument()
    })
    
    // Click login link
    fireEvent.click(screen.getByText('Sign in here'))
    
    await waitFor(() => {
      expect(screen.getByText('Vendor Login')).toBeInTheDocument()
    })
  })

  test('switches to forgot password mode', async () => {
    render(<AuthModal {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Forgot your password?'))
    
    await waitFor(() => {
      expect(screen.getByText('Reset Password')).toBeInTheDocument()
      expect(screen.getByText('Send Reset Email')).toBeInTheDocument()
    })
  })

  test('toggles password visibility', () => {
    render(<AuthModal {...defaultProps} />)
    
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const toggleButton = passwordInput.parentElement.querySelector('button')
    
    expect(passwordInput.type).toBe('password')
    
    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('text')
    
    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('password')
  })

  test('shows validation error when password is missing', async () => {
    render(<AuthModal {...defaultProps} />)
    
    // Fill email but leave password empty
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    })
    
    // The form should prevent submission due to required field validation
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    expect(passwordInput).toHaveAttribute('required')
  })

  test('shows all required fields in signup mode', () => {
    render(<AuthModal {...defaultProps} initialMode="signup" />)
    
    // Check that all required fields are present
    expect(screen.getByPlaceholderText('Enter your full name')).toHaveAttribute('required')
    expect(screen.getByPlaceholderText('Enter your email')).toHaveAttribute('required')
    expect(screen.getByPlaceholderText('Enter your password')).toHaveAttribute('required')
    expect(screen.getByPlaceholderText('Confirm your password')).toHaveAttribute('required')
    expect(screen.getByPlaceholderText('Enter your phone number')).toHaveAttribute('required')
    expect(screen.getByPlaceholderText('Enter your city/location')).toHaveAttribute('required')
  })

  test('validates password match on signup', async () => {
    render(<AuthModal {...defaultProps} initialMode="signup" />)
    
    // Fill in all required fields
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'different' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your phone number'), {
      target: { value: '1234567890' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your city/location'), {
      target: { value: 'Test City' }
    })
    
    const submitButton = screen.getByText('Create Account')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  test('validates minimum password length', async () => {
    render(<AuthModal {...defaultProps} initialMode="signup" />)
    
    // Fill in all required fields with short password
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: '123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: '123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your phone number'), {
      target: { value: '1234567890' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your city/location'), {
      target: { value: 'Test City' }
    })
    
    const submitButton = screen.getByText('Create Account')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  test('switches user type in signup mode', () => {
    render(<AuthModal {...defaultProps} initialMode="signup" />)
    
    // Initially vendor is selected
    expect(screen.getByText('Join as Vendor')).toBeInTheDocument()
    
    // Click buyer button
    const buyerButton = screen.getByText('Buyer')
    fireEvent.click(buyerButton)
    
    expect(screen.getByText('Join as Buyer')).toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(<AuthModal {...defaultProps} onClose={onClose} />)
    
    // Find the X button specifically by its SVG content
    const closeButton = screen.getByRole('button', { 
      name: (name, element) => {
        const svg = element.querySelector('svg')
        return svg && svg.classList.contains('lucide-x')
      }
    })
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  test('handles successful login', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'test@example.com' } },
      error: null
    })

    // Mock window.location.href
    delete window.location
    window.location = { href: '' }

    render(<AuthModal {...defaultProps} />)
    
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    })
    
    const submitButton = screen.getByText('Sign In')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  test('handles login error', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' }
    })

    render(<AuthModal {...defaultProps} />)
    
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpassword' }
    })
    
    const submitButton = screen.getByText('Sign In')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})