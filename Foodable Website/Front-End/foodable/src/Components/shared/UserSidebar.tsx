import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface UserSidebarProps {
  username: string;
  profileImage?: string;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({ 
  username, 
  profileImage = 'Img/foodable1mini.jpg'
}): JSX.Element => {
  const location = useLocation();

  const navItems = [
    { path: ROUTES.DONATOR, label: 'Donate' },
    { path: ROUTES.REWARDS, label: 'Rewards' },
    { path: ROUTES.PROFILE, label: 'Profile' },
  ];

  return (
    <div className="mini-nav">
      <img 
        className="profilephoto" 
        src={profileImage} 
        alt={`${username}'s profile`}
      />
      <h1 className="username">{username}</h1>
      <div className="sidebar">
        <div className="sidemenu">
          <div className="sidebutton">
            <ul>
              {navItems.map(({ path, label }) => (
                <li key={path}>
                  <Link 
                    to={path}
                    className={location.pathname === path ? 'active' : ''}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
