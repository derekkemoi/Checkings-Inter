export interface User {
  uid: string;
  email: string;
  firstName: string;
  secondName: string;
  idNumber: string;
  country: string;
  currency: string;
  createdAt: string;
  paymentMade: boolean;
  purposes?: string[];
  reportUrl?: string;
  crbReportId?: string;
  reportGeneratedAt?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export interface RegisterFormData {
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  confirmPassword: string;
  idNumber: string;
  country: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface PurposeFormData {
  purposes: string[];
}

export interface PaymentData {
  amount: number;
  email: string;
  reference: string;
}

export interface CRBReport {
  reportId: string;
  userId: string;
  generatedAt: string;
  expiresAt: string;
  country: string;
  currency: string;
  score: number;
  scoreCategory: string;
  scoreColor: string;
  creditBureau: string;
  banks: string[];
  personalInfo: {
    fullName: string;
    idNumber: string;
    address: string;
  };
  summary: string;
  advice: string[];
  disclaimer: string;
  paymentReference: string;
}
