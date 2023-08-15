import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {getCurrentUserAvatar} from '../api/users';

const CurrentUserAvatarContext = createContext(null);

/**
 * Provider for the current user's avatar.
 *
 * @return {JSX.Element} The current user's avatar provider
 */
export function CurrentUserAvatarProvider({children}) {
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);

  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const getAvatar = useCallback(async () => {
    try {
      const response = await getCurrentUserAvatar();
      const blob = new Blob([response.data], {type: response.headers['content-type']});
      const imageUrl = URL.createObjectURL(blob);

      return imageUrl;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null;
      } else if (err.response && err.response.status === 401) {
        navigate('/logout');
      }

      throw err;
    }
  }, []);

  const reloadAvatar = useCallback(async () => {
    const newAvatar = await getAvatar();
    setAvatar(newAvatar);
  }, [getAvatar]);

  useEffect(() => {
    reloadAvatar();
  }, [reloadAvatar]);

  return (
    <CurrentUserAvatarContext.Provider
      value={{
        avatar,
        updateAvatar,
        reloadAvatar,
      }}
    >
      {children}
    </CurrentUserAvatarContext.Provider>
  );
}

CurrentUserAvatarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook for accessing the current user's avatar context.
 *
 * @return {object} The current user's avatar context
 */
export function useCurrentUserAvatar() {
  const context = useContext(CurrentUserAvatarContext);

  if (context === undefined) {
    throw new Error('useCurrentUserAvatar() may be used only in the context of a <CurrentUserAvatarProvider>');
  }

  return context;
}
