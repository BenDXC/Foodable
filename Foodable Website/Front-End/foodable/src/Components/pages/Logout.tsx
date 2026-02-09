import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetUserProps } from '../../types';
import { ROUTES, SUCCESS_MESSAGES } from '../../constants';
import logger from '../../utils/logger';

const Logout: React.FC<SetUserProps> = ({ setLoggedinUser }): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async (): Promise<void> => {
      try {
        setLoggedinUser("");
        sessionStorage.removeItem("jwt");
        logger.debug(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
        
        // Redirect to home after logout
        setTimeout(() => {
          navigate(ROUTES.HOME);
        }, 1500);
      } catch (error) {
        logger.error('Logout failed', error);
      }
    };

    performLogout();
  }, [setLoggedinUser, navigate]);

  return (
    <div className="logout-container">
      <p>{SUCCESS_MESSAGES.LOGOUT_SUCCESS}</p>
      <p>Redirecting to home page...</p>
    </div>
  );
}

export default Logout;