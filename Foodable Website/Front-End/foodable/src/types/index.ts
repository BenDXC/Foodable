// Common prop types
export interface SetUserProps {
  setLoggedinUser: (user: string) => void;
}

export interface UserProps {
  loggedInUser: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  buttonStyle?: string;
  buttonSize?: string;
}

export interface CardItemProps {
  path: string;
  label: string;
  src: string;
  text: string;
}

export interface NavbarProps {
  loggedInUser?: string;
}

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface UserData {
  email: string;
  name?: string;
  addresses?: UserAddress[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}
