export type UserRole = 'entrepreneur' | 'investor';
export type MeetingStatus = 'pending' | 'accepted' | 'declined';

export interface Meeting {
  id: string;
  title: string;
  start: string;
  end?: string | null;
  allDay?: boolean;
  status: MeetingStatus;
  // links to participants
  entrepreneurId?: string;
  investorId?: string;
  createdById?: string;
  notes?: string;
  
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  isOnline?: boolean;
  createdAt: string;
  twoFactorEnabled?: boolean;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startupName: string;
  pitchSummary: string;
  fundingNeeded: string;
  industry: string;
  location: string;
  foundedYear: number;
  teamSize: number;
}

export interface Investor extends User {
  role: 'investor';
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  pending2FA?: boolean;
  verifyOtp?: (code: string) => Promise<void>;
  resendOtp?: () => void;
}

// ---- Payments / Wallet ----
export type Currency = 'USD' | 'PKR';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'FUNDING';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;          
  currency: Currency;
  senderId?: string;       
  receiverId?: string;     
  note?: string;           
  status: TransactionStatus;
  createdAt: string;       
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: Currency;
}

