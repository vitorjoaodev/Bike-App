import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isBefore, isAfter, set } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TimeSlot {
  value: string;
  label: string;
  disabled: boolean;
}

type ScheduleBookingProps = {
  onScheduleConfirm: (date: Date, slot: string) => void;
  stationOpeningTime: string;
  stationClosingTime: string;
}

export default function ScheduleBooking({ onScheduleConfirm, stationOpeningTime, stationClosingTime }: ScheduleBookingProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Parse opening and closing hours
  const parseTimeString = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
    return { hours: hours || 0, minutes: minutes || 0 };
  };
  
  const openingTime = parseTimeString(stationOpeningTime);
  const closingTime = parseTimeString(stationClosingTime);
  
  // Generate time slots from opening to closing time in 30 minute intervals
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    if (!date) return [];
    
    const slots: TimeSlot[] = [];
    const now = new Date();
    const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
    
    let currentHour = openingTime.hours;
    let currentMinute = openingTime.minutes;
    
    while (
      currentHour < closingTime.hours || 
      (currentHour === closingTime.hours && currentMinute < closingTime.minutes)
    ) {
      const slotTime = set(date, { hours: currentHour, minutes: currentMinute });
      const timeString = format(slotTime, 'HH:mm');
      const formattedTime = format(slotTime, 'HH:mm');
      
      // Disable past times for today
      const disabled = isToday && isBefore(slotTime, now);
      
      slots.push({
        value: timeString,
        label: formattedTime,
        disabled
      });
      
      // Advance 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
    
    return slots;
  };

  const timeSlots = date ? generateTimeSlots(date) : [];
  
  // Disable days in the past and more than 7 days in the future
  const disabledDays = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekLater = addDays(today, 7);
    oneWeekLater.setHours(23, 59, 59, 999);
    
    return isBefore(day, today) || isAfter(day, oneWeekLater);
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedTimeSlot(null); // Reset time slot when date changes
    setCalendarOpen(false);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };
  
  const handleScheduleConfirm = () => {
    if (date && selectedTimeSlot) {
      const [hours, minutes] = selectedTimeSlot.split(':').map(num => parseInt(num, 10));
      const scheduledDate = set(date, { hours, minutes });
      onScheduleConfirm(scheduledDate, selectedTimeSlot);
    }
  };
  
  const formattedDate = date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : '';
  
  return (
    <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 fade-in">
      <h3 className="text-lg font-medium mb-4 text-secondary">Agendar aluguel</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Escolha uma data</label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <span className="material-icons mr-2">calendar_month</span>
              {formattedDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Escolha um horário</label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <Button
              key={slot.value}
              variant={selectedTimeSlot === slot.value ? "default" : "outline"}
              className={cn(
                selectedTimeSlot === slot.value ? "bg-secondary hover:bg-secondary" : "",
                "text-center"
              )}
              disabled={slot.disabled}
              onClick={() => handleTimeSelect(slot.value)}
            >
              {slot.label}
            </Button>
          ))}
        </div>
      </div>
      
      <Button 
        className="w-full btn-primary"
        disabled={!date || !selectedTimeSlot}
        onClick={handleScheduleConfirm}
      >
        <span className="material-icons mr-2">schedule</span>
        Agendar
      </Button>
    </div>
  );
}