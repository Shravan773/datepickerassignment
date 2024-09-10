import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DatePicker from './DatePicker'

describe('DatePicker Integration Tests', () => {
  it('renders all main components', () => {
    render(<DatePicker />)
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument()
    expect(screen.getByLabelText('End Date (optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Recurrence')).toBeInTheDocument()
    expect(screen.getByLabelText('Every')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  it('changes recurrence type and shows appropriate options', () => {
    render(<DatePicker />)
    const recurrenceSelect = screen.getByLabelText('Recurrence')

    fireEvent.change(recurrenceSelect, { target: { value: 'weekly' } })
    expect(screen.getByText('Select Days')).toBeInTheDocument()

    fireEvent.change(recurrenceSelect, { target: { value: 'monthly' } })
    expect(screen.getByText('Nth Day of Month')).toBeInTheDocument()
  })

  it('toggles day selection for weekly recurrence', () => {
    render(<DatePicker />)
    fireEvent.change(screen.getByLabelText('Recurrence'), { target: { value: 'weekly' } })
    const mondayButton = screen.getByText('Mon')
    fireEvent.click(mondayButton)
    expect(mondayButton).toHaveClass('bg-blue-500')
  })

  it('updates preview when changing start date', () => {
    render(<DatePicker />)
    const startDateInput = screen.getByLabelText('Start Date')
    fireEvent.change(startDateInput, { target: { value: '2023-09-01' } })
    const previewDates = screen.getAllByText(/\d+/)
    expect(previewDates[0]).toHaveTextContent('1')
  })
})