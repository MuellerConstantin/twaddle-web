import axios from 'axios';
import authSlice from '../store/slices/auth';

let store;

export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_TWADDLE_API_URI,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      if (err.response.status >= 500) {
        console.error(err.message, err.response.data);
      } else {
        console.warn(err.message, err.response.data);
      }
    } else if (err.request) {
      console.error(err.message, err.request);
    } else {
      console.error(err.message);
    }

    return Promise.reject(err);
  },
);

api.interceptors.request.use((config) => {
  const state = store.getState();

  if (state.auth.accessToken) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const {response, config} = err;

    if (response && config.url !== '/auth/refresh') {
      // eslint-disable-next-line no-underscore-dangle
      if (response.status === 401 && !config._retry) {
        // eslint-disable-next-line no-underscore-dangle
        config._retry = true;
        const state = store.getState();

        if (state.auth.refreshToken) {
          try {
            const refreshRes = await api.post('/auth/refresh', {
              refreshToken: state.auth.refreshToken,
            });

            store.dispatch(
              authSlice.actions.setToken({
                accessToken: refreshRes.data.accessToken,
                accessExpiresIn: refreshRes.data.accessExpiresIn,
                refreshToken: refreshRes.data.refreshToken,
                refreshExpiresIn: refreshRes.data.refreshExpiresIn,
              }),
            );

            config.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
            return axios(config);
          } catch (refeshError) {
            return Promise.reject(refeshError);
          }
        }
      }
    }

    return Promise.reject(err);
  },
);

export default api;
