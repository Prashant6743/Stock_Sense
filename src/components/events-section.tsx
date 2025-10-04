'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Bell, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'earnings' | 'ipo' | 'conference' | 'webinar' | 'announcement';
  company?: string;
  location?: string;
  isVirtual?: boolean;
  attendees?: number;
  isImportant?: boolean;
  isRegistered?: boolean;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Apple Q4 2024 Earnings Call',
    description: 'Apple Inc. will report fourth quarter 2024 financial results and host a conference call.',
    date: '2024-10-03',
    time: '5:00 PM EST',
    type: 'earnings',
    company: 'Apple Inc.',
    isVirtual: true,
    attendees: 15420,
    isImportant: true,
    isRegistered: true,
  },
  {
    id: '2',
    title: 'Federal Reserve Interest Rate Decision',
    description: 'The Federal Open Market Committee will announce its decision on interest rates.',
    date: '2024-10-04',
    time: '2:00 PM EST',
    type: 'announcement',
    location: 'Washington, D.C.',
    isImportant: true,
  },
  {
    id: '3',
    title: 'Tesla Investor Day 2024',
    description: 'Tesla presents its latest innovations and future roadmap to investors and stakeholders.',
    date: '2024-10-05',
    time: '4:00 PM EST',
    type: 'conference',
    company: 'Tesla Inc.',
    location: 'Austin, Texas',
    attendees: 8500,
    isImportant: true,
  },
  {
    id: '4',
    title: 'AI in Finance Webinar',
    description: 'Learn how artificial intelligence is transforming the financial services industry.',
    date: '2024-10-06',
    time: '1:00 PM EST',
    type: 'webinar',
    isVirtual: true,
    attendees: 2340,
  },
  {
    id: '5',
    title: 'Stripe IPO Announcement Expected',
    description: 'Industry sources suggest Stripe may announce its initial public offering plans.',
    date: '2024-10-07',
    time: 'TBA',
    type: 'ipo',
    company: 'Stripe Inc.',
    isImportant: true,
  },
];

const typeColors = {
  earnings: 'bg-green-500/20 text-green-400 border-green-500/30',
  ipo: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  conference: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  webinar: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  announcement: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const typeIcons = {
  earnings: '📊',
  ipo: '🚀',
  conference: '🏢',
  webinar: '💻',
  announcement: '📢',
};

export function EventsSection() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toDateString();
    const eventDate = new Date(dateString).toDateString();
    return today === eventDate;
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = new Date(dateString).toDateString();
    return tomorrow.toDateString() === eventDate;
  };

  const openGoogleCalendar = () => {
    // Open Google Calendar in a new tab
    window.open('https://calendar.google.com', '_blank');
  };

  const addToGoogleCalendar = (event: Event) => {
    // Format date and time for Google Calendar URL
    const startDate = new Date(`${event.date} ${event.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location || (event.isVirtual ? 'Virtual Event' : ''))}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const toggleNotification = (eventId: string) => {
    // Request notification permission if not granted
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification(eventId);
        }
      });
    } else if (Notification.permission === 'granted') {
      showNotification(eventId);
    } else {
      alert('Please enable notifications in your browser settings to receive event reminders.');
    }
  };

  const showNotification = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
      new Notification(`Stock Sense - ${event.title}`, {
        body: `${event.description}\nScheduled for: ${event.date} at ${event.time}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
        <Button 
          onClick={openGoogleCalendar}
          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Open Google Calendar
        </Button>
      </div>

      {/* Today's Events */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400">Today's Events</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockEvents.filter(event => isToday(event.date)).map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index} 
              onAddToCalendar={addToGoogleCalendar}
              onToggleNotification={toggleNotification}
            />
          ))}
          {mockEvents.filter(event => isToday(event.date)).length === 0 && (
            <p className="text-gray-500 col-span-2">No events scheduled for today.</p>
          )}
        </div>
      </div>

      {/* Tomorrow's Events */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-400">Tomorrow's Events</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockEvents.filter(event => isTomorrow(event.date)).map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index} 
              onAddToCalendar={addToGoogleCalendar}
              onToggleNotification={toggleNotification}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-400">This Week</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockEvents.filter(event => !isToday(event.date) && !isTomorrow(event.date)).map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index} 
              onAddToCalendar={addToGoogleCalendar}
              onToggleNotification={toggleNotification}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({ 
  event, 
  index, 
  onAddToCalendar, 
  onToggleNotification 
}: { 
  event: Event; 
  index: number; 
  onAddToCalendar: (event: Event) => void;
  onToggleNotification: (eventId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{typeIcons[event.type]}</span>
                <Badge className={`text-xs px-2 py-1 border ${typeColors[event.type]}`}>
                  {event.type.toUpperCase()}
                </Badge>
                {event.isImportant && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs px-2 py-1 border flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Important
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                {event.title}
              </CardTitle>
              {event.company && (
                <p className="text-sm text-gray-400 mt-1">{event.company}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleNotification(event.id)}
              className={`transition-colors hover:scale-110 ${
                event.isRegistered 
                  ? 'text-green-400 hover:text-green-300' 
                  : 'text-gray-400 hover:text-blue-400'
              }`}
              title="Enable notifications for this event"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="h-4 w-4 text-green-400" />
              <span>{event.time}</span>
            </div>
            {(event.location || event.isVirtual) && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
              </div>
            )}
            {event.attendees && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="h-4 w-4 text-orange-400" />
                <span>{event.attendees.toLocaleString()} attendees</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              className={`transition-all duration-200 ${
                event.isRegistered
                  ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                  : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
              }`}
              size="sm"
            >
              {event.isRegistered ? 'Registered' : 'Register'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToCalendar(event)}
              className="text-gray-400 hover:text-blue-400 transition-colors hover:scale-105 flex items-center gap-1"
              title="Add this event to Google Calendar"
            >
              <Calendar className="h-3 w-3" />
              Add to Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
