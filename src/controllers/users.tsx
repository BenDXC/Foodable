import { useEffect, useState } from 'react';
import { fetchUsers } from '../services/user.service';
import { User } from '../models/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return users;
};
