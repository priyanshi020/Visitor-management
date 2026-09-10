export type VisitorStatus = 'pending' | 'approved' | 'rejected';

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  unit: string;
  visitDate: string; // ISO date string
  status: VisitorStatus;
  createdAt: string;
}

export type NewVisitor = Pick<Visitor, 'name' | 'phone' | 'unit' | 'visitDate'>;

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
