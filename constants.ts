import type { Booking, MessageThread, Property, Lead, Task, Notification, Platform, Automation, TriggerType, ActionType } from './types';
import { BedDouble, MessageSquare, Slack, CalendarDays, CreditCard, MapPin } from 'lucide-react';

export const mockBookings: Booking[] = [
  { id: '1', guestName: 'Alice Johnson', property: 'Sunny Beach House', checkIn: '2024-08-15', checkOut: '2024-08-20', status: 'Confirmed', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: '2', guestName: 'Bob Williams', property: 'Mountain View Cabin', checkIn: '2024-08-18', checkOut: '2024-08-25', status: 'Confirmed', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { id: '3', guestName: 'Charlie Brown', property: 'Downtown Loft', checkIn: '2024-09-01', checkOut: '2024-09-05', status: 'Pending', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
];

export const mockMessageThreads: MessageThread[] = [
  { 
    id: '1', 
    guestName: 'Diana Prince', 
    property: 'Lakeside Cottage', 
    lastMessage: 'Can we check in a bit earlier?', 
    timestamp: '2h ago', 
    unread: true, 
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    messages: [
        {id: 'm1', sender: 'guest', text: 'Hi there! We are so excited for our stay. I was wondering, is there any chance we could check in a bit earlier, maybe around 1 PM?', timestamp: '2h ago'},
    ]
  },
  { 
    id: '2', 
    guestName: 'Ethan Hunt', 
    property: 'Ski Chalet', 
    lastMessage: 'Everything was wonderful, thank you!', 
    timestamp: '1d ago', 
    unread: false, 
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
    messages: [
        {id: 'm1', sender: 'host', text: 'We hope you enjoyed your stay!', timestamp: '1d ago'},
        {id: 'm2', sender: 'guest', text: 'Everything was wonderful, thank you!', timestamp: '1d ago'},
    ]
  },
];

export const mockProperties: Property[] = [
  { id: '1', name: 'Sunny Beach House', address: '123 Ocean Ave, Miami, FL', currentPrice: 450, occupancy: 85, imageUrl: 'https://picsum.photos/seed/beach/400/300' },
  { id: '2', name: 'Mountain View Cabin', address: '456 Pine Rd, Aspen, CO', currentPrice: 320, occupancy: 60, imageUrl: 'https://picsum.photos/seed/mountain/400/300' },
  { id: '3', name: 'Downtown Loft', address: '789 Main St, New York, NY', currentPrice: 280, occupancy: 95, imageUrl: 'https://picsum.photos/seed/city/400/300' },
  { id: '4', name: 'Lakeside Cottage', address: '101 Water Way, Lake Tahoe, CA', currentPrice: 375, occupancy: 70, imageUrl: 'https://picsum.photos/seed/lake/400/300' },
];

export const mockLeads: Lead[] = [
  { id: '1', name: 'Fiona Gallagher', source: 'Web', inquiryDate: '2024-08-10', status: 'New', email: 'fiona.g@example.com' },
  { id: '2', name: 'George Michael', source: 'Social Media', inquiryDate: '2024-08-09', status: 'Contacted', email: 'george.m@example.com' },
  { id: '3', name: 'Hannah Montana', source: 'Referral', inquiryDate: '2024-08-05', status: 'Converted', email: 'hannah.m@example.com' },
];

export const mockTasks: Task[] = [
  { id: '1', title: 'Clean after checkout', property: 'Sunny Beach House', dueDate: '2024-08-20', status: 'To Do', assignee: 'Cleaning Crew A' },
  { id: '2', title: 'Fix leaky faucet', property: 'Mountain View Cabin', dueDate: '2024-08-19', status: 'In Progress', assignee: 'Maintenance Team' },
  { id: '3', title: 'Restock supplies', property: 'Downtown Loft', dueDate: '2024-08-22', status: 'To Do', assignee: 'Housekeeping' },
  { id: '4', title: ' mow lawn', property: 'Lakeside Cottage', dueDate: '2024-08-21', status: 'Done', assignee: 'Groundskeeping' },
];

export const mockNotifications: Notification[] = [
    { id: '1', type: 'booking', message: 'New booking from Charlie Brown for Downtown Loft.', timestamp: '15m ago', read: false },
    { id: '2', type: 'message', message: 'Diana Prince sent a new message regarding Lakeside Cottage.', timestamp: '2h ago', read: false },
    { id: '3', type: 'task', message: 'Task "Fix leaky faucet" is overdue.', timestamp: '1d ago', read: true },
    { id: '4', type: 'booking', message: 'Bob Williams checked into Mountain View Cabin.', timestamp: '2d ago', read: true },
];

export const mockPlatforms: Platform[] = [
  { id: 'airbnb', name: 'Airbnb', description: 'Sync listings and bookings.', icon: BedDouble, connected: true },
  { id: 'lodgify', name: 'Lodgify', description: 'Manage direct bookings.', icon: BedDouble, connected: true },
  { id: 'bookingcom', name: 'Booking.com', description: 'Reach a global audience.', icon: BedDouble, connected: false },
  { id: 'vrbo', name: 'Vrbo', description: 'Connect with family travelers.', icon: BedDouble, connected: false },
  { id: 'whatsapp', name: 'WhatsApp', description: 'Direct guest messaging.', icon: MessageSquare, connected: false },
  { id: 'slack', name: 'Slack', description: 'Internal team notifications.', icon: Slack, connected: true },
  { id: 'gcal', name: 'Google Calendar', description: 'Sync your booking calendar.', icon: CalendarDays, connected: false },
  { id: 'gmaps', name: 'Google Maps', description: 'Enhance listings with maps.', icon: MapPin, connected: false },
  { id: 'stripe', name: 'Stripe', description: 'Process payments seamlessly.', icon: CreditCard, connected: true },
];

export const triggerDetails: { [key in TriggerType]: { name: string, description: string } } = {
    new_booking: { name: 'New Booking', description: 'When a booking is confirmed' },
    guest_checkout: { name: 'Guest Checkout', description: 'On the day a guest checks out' },
    new_lead: { name: 'New Lead', description: 'When a new lead is captured' },
    guest_checkin: { name: 'Guest Check-in', description: 'When a guest successfully checks in' },
    guest_review_received: { name: 'Guest Review Received', description: 'When a new guest review is submitted' },
};

export const actionDetails: { [key in ActionType]: { name: string, description: string } } = {
    create_task: { name: 'Create Task', description: 'Create a new task for your team' },
    send_message: { name: 'Send Message', description: 'Send an automated message to a guest' },
    update_booking_status: { name: 'Update Status', description: 'Change the status of a booking' },
    send_email: { name: 'Send Email', description: 'Send a custom email to the guest' },
    notify_team: { name: 'Notify Team', description: 'Send a notification to your team' },
};

export const mockAutomations: Automation[] = [
  { 
    id: '1', 
    name: 'Schedule Post-Checkout Cleaning',
    description: 'When a guest checks out, automatically create a task for the cleaning crew.',
    trigger: 'guest_checkout',
    action: 'create_task',
    enabled: true,
    lastTriggered: '2024-08-20',
  },
  { 
    id: '2', 
    name: 'Send Welcome Message',
    description: 'When a new booking is confirmed, schedule a welcome message to be sent 24 hours before check-in.',
    trigger: 'new_booking',
    action: 'send_message',
    enabled: true,
    lastTriggered: '2024-08-17',
  },
  { 
    id: '3', 
    name: 'Follow Up on New Leads',
    description: 'If a new lead hasn\'t been contacted in 48 hours, create a reminder task.',
    trigger: 'new_lead',
    action: 'create_task',
    enabled: false,
    lastTriggered: null,
  },
  { 
    id: '4', 
    name: 'Send Post-Stay Thank You',
    description: 'When a guest checks out, send a thank you email and a request for a review.',
    trigger: 'guest_checkout',
    action: 'send_email',
    enabled: true,
    lastTriggered: '2024-08-19',
  },
  { 
    id: '5', 
    name: 'Notify Team of New Review',
    description: 'When a new guest review is received, send a notification to the #reviews Slack channel.',
    trigger: 'guest_review_received',
    action: 'notify_team',
    enabled: true,
    lastTriggered: '2024-08-18',
  },
  {
    id: '6',
    name: 'Update Booking to "In-House"',
    description: 'When a guest checks in, automatically update their booking status to "In-House".',
    trigger: 'guest_checkin',
    action: 'update_booking_status',
    enabled: true,
    lastTriggered: '2024-08-18'
  }
];