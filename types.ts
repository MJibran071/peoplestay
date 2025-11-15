export type View = 'dashboard' | 'messaging' | 'pricing' | 'leads' | 'tasks' | 'settings' | 'automations' | 'calendar';

export interface Booking {
  id: string;
  guestName: string;
  property: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  avatarUrl: string;
}

export interface MessageThread {
  id: string;
  guestName: string;
  property: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatarUrl: string;
  messages: {
    id: string;
    sender: 'guest' | 'host';
    text: string;
    timestamp: string;
  }[];
}

export interface Property {
  id:string;
  name: string;
  address: string;
  currentPrice: number;
  occupancy: number;
  imageUrl: string;
}

export interface Lead {
  id: string;
  name: string;
  source: 'Web' | 'Social Media' | 'Referral';
  inquiryDate: string;
  status: 'New' | 'Contacted' | 'Converted';
  email: string;
}

export interface Task {
  id: string;
  title: string;
  property: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  assignee: string;
}

export interface Notification {
  id: string;
  type: 'booking' | 'message' | 'task';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
}

export type TriggerType = 'new_booking' | 'guest_checkout' | 'new_lead' | 'guest_checkin' | 'guest_review_received';
export type ActionType = 'create_task' | 'send_message' | 'update_booking_status' | 'send_email' | 'notify_team';


export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  action: ActionType;
  enabled: boolean;
  lastTriggered: string | null;
}