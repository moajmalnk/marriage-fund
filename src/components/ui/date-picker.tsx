import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const datePickerRef = useRef<HTMLDivElement>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const daysInMonth = getDaysInMonth(currentMonth);

  return (
    <div className="relative" ref={datePickerRef}>
      {/* Date Input Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full h-10 sm:h-12 px-3 sm:px-4 border-2 rounded-lg transition-all duration-200 flex items-center justify-between text-left text-sm sm:text-base",
          "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
          "hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          error
            ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
            : "border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <span className={cn(
            selectedDate ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
            "truncate"
          )}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
        </div>
        <ChevronRight className={cn(
          "h-3 w-3 sm:h-4 sm:w-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 flex-shrink-0",
          isOpen && "rotate-90"
        )} />
      </button>

      {/* Date Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={() => date && handleDateSelect(date)}
                disabled={!date}
                className={cn(
                  "h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                  !date && "cursor-default",
                  date && isToday(date) && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                  date && isSelected(date) && "bg-blue-600 text-white hover:bg-blue-700",
                  date && !isToday(date) && !isSelected(date) && "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today);
                handleDateSelect(today);
              }}
              className="w-full py-2 px-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
