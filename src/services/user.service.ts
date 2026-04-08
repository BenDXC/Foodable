import { User } from '../models/user';

export const fetchUsers = async (): Promise<User[]> => {
  return [{ id: 1, name: 'John' }];
};
