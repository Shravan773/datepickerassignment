"use client"

import React from 'react'
import { create } from 'zustand'
import { addDays, format, startOfWeek, addWeeks, addMonths, startOfMonth, addYears, isWithinInterval } from 'date-fns'

type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly'

const useDatePickerStore = create((set) => ({
  startDate: new Date(),
  endDate: null,
  recurrenceType: 'daily',
  interval: 1,
  selectedDays: [],
  nthWeek: 1,
  nthDay: 0,
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setRecurrenceType: (type) => set({ recurrenceType: type }),
  setInterval: (interval) => set({ interval }),
  toggleDay: (day) => set((state) => ({
    selectedDays: state.selectedDays.includes(day)
      ? state.selectedDays.filter((d) => d !== day)
      : [...state.selectedDays, day],
  })),
  setNthWeek: (week) => set({ nthWeek: week }),
  setNthDay: (day) => set({ nthDay: day }),
}))

const DatePicker = () => {
  const {
    startDate, endDate, recurrenceType, interval, selectedDays, nthWeek, nthDay,
    setStartDate, setEndDate, setRecurrenceType, setInterval, toggleDay, setNthWeek, setNthDay,
  } = useDatePickerStore()

  const previewDates = React.useMemo(() => {
    const dates = []
    let currentDate = startDate
    const endDateTime = endDate ? endDate.getTime() : addYears(startDate, 1).getTime()

    while (dates.length < 10 && currentDate.getTime() <= endDateTime) {
      if (recurrenceType === 'daily') {
        dates.push(currentDate)
        currentDate = addDays(currentDate, interval)
      } else if (recurrenceType === 'weekly') {
        const weekStart = startOfWeek(currentDate)
        selectedDays.forEach((day) => {
          const date = addDays(weekStart, day)
          if (isWithinInterval(date, { start: currentDate, end: new Date(endDateTime) })) {
            dates.push(date)
          }
        })
        currentDate = addWeeks(currentDate, interval)
      } else if (recurrenceType === 'monthly') {
        const monthStart = startOfMonth(currentDate)
        let targetDate = addWeeks(monthStart, nthWeek - 1)
        targetDate = addDays(targetDate, nthDay)
        if (targetDate.getMonth() === monthStart.getMonth() && targetDate.getTime() <= endDateTime) {
          dates.push(targetDate)
        }
        currentDate = addMonths(monthStart, interval)
      } else if (recurrenceType === 'yearly') {
        if (currentDate.getTime() <= endDateTime) {
          dates.push(currentDate)
        }
        currentDate = addYears(currentDate, interval)
      }
    }

    return dates
  }, [startDate, endDate, recurrenceType, interval, selectedDays, nthWeek, nthDay])

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Recurring Date Picker</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">End Date (optional)</label>
          <input
            type="date"
            value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Recurrence</label>
          <select
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Every</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min={1}
            className="w-full p-2 border rounded"
          />
        </div>

        {recurrenceType === 'weekly' && (
          <div>
            <label className="block mb-1">Select Days</label>
            <div className="flex space-x-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <button
                  key={day}
                  onClick={() => toggleDay(index)}
                  className={`p-2 rounded ${selectedDays.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {recurrenceType === 'monthly' && (
          <div>
            <label className="block mb-1">Nth Day of Month</label>
            <div className="flex space-x-2">
              <select
                value={nthWeek}
                onChange={(e) => setNthWeek(parseInt(e.target.value))}
                className="p-2 border rounded"
              >
                {[1, 2, 3, 4].map((week) => (
                  <option key={week} value={week}>
                    {`${week}th`}
                  </option>
                ))}
              </select>
              <select
                value={nthDay}
                onChange={(e) => setNthDay(parseInt(e.target.value))}
                className="p-2 border rounded"
              >
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                  (day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-bold mb-2">Preview</h3>
          <div className="grid grid-cols-7 gap-1">
            {previewDates.map((date, index) => (
              <div key={index} className="text-center p-1 bg-gray-100 rounded">
                {format(date, 'd')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatePicker