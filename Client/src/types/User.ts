export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "guest" | "buyer" | "owner" | "admin";
  phone?: string;
}