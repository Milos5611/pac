import Storage from './storage';
const cacheClient = new Storage();

/**
 * Saves a users profile to cacheClient
 * @param {*} user
 */
export const persistUserProfile = user => {
  //unset if user is null
  if (!user) {
    return cacheClient.removeItem('profile');
  }

  const currentProfile = getPersistedUserProfile();
  const profile = { ...currentProfile, ...user };

  cacheClient.setItem('profile', profile);
};

/**
 * Saves a users token to cacheClient
 * @param {*} token
 */

export const persistUserToken = token => {
  //unset if token is null
  if (!token) {
    return cacheClient.removeItem('token');
  }

  cacheClient.setItem('token', token);
};

export const persistUserRedirect = redirect => {
  //unset if token is null
  if (!redirect) {
    return cacheClient.removeItem('redirect');
  }

  cacheClient.setItem('redirect', redirect);
};

export const getPersistedUserRedirect = () => {
  return cacheClient.getItem('redirect') || null;
};

export const removePersistedUserRedirect = () => {
  return cacheClient.removeItem('redirect');
};

/**
 * Returns Auth token in cacheClient if avaliable
 */
export const getPersistedUserToken = () => {
  return cacheClient.getItem('oidc') || null;
};

/**
 * Returns user profile in cacheClient if found
 */
export const getPersistedUserProfile = () => {
  const profile = cacheClient.getItem('profile');
  return profile || null;
};

/**
 * return an array of error messages form
 * an array of error objects
 * @param {Array, Object} errors
 */
export const getErrorMessages = errors => {
  if (errors.networkError && errors.networkError.result.errors.length > 0)
    return errors.networkError.result.errors.map(err => {
      return err.message;
    });
  if (Array.isArray(errors)) return errors.map(err => err.message);
  return errors.message;
};

/**
 * Returns an object with null properties removed
 * @param {Object} object
 */
export const removeNullValues = object =>
  !object
    ? object
    : Object.entries(object).reduce((acc, entry) => {
        if (entry[1] !== null) {
          acc[entry[0]] = entry[1];
        }

        return acc;
      }, {});

/**
 * Returns an object with all the empty properties removed
 * @param {*} object
 */
export const removeEmptyValues = object =>
  !object
    ? object
    : Object.entries(object).reduce((acc, entry) => {
        if (entry[1] !== '') {
          acc[entry[0]] = entry[1];
        }

        return acc;
      }, {});

/**
 * Returns an object with null properties converted to
 * empty strings
 * @param {Object} object
 */
export const covertNullValues = object => {
  return !object
    ? object
    : Object.entries(object).reduce((acc, entry) => {
        if (entry[1] === null) {
          acc[entry[0]] = '';
        } else {
          acc[entry[0]] = entry[1];
        }

        return acc;
      }, {});
};

/**
 * return true if an object has all the specified
 * properties
 * @param {Object} obj
 * @param {Array} props
 */
export const objectHasProps = (obj, props) => {
  const objKeys = Object.keys(obj);
  return !props.some(prop => !objKeys.includes(prop));
};

/**
 * Return the value of an objects property
 * @param {Object} obj
 * @param {*} props
 */
export const pickField = (obj, ...props) => {
  const val = obj ? obj[props[0]] : null;

  if (props.length === 1 || !val) return val;

  const rest = props.slice(1);
  return pickField(val, ...rest);
};

export const isEmpty = object =>
  Object.values(object).every(x => x === null || x === '');

export const config = {
  SVELTE_APP_BE_URL: "http://conference.backend/graphql",
  SVELTE_APP_CLIENT_ID: "0oaup7oeuqIcBZjyw4x6",
  SVELTE_APP_ISSUER: "https://dev-269607.okta.com",
  SVELTE_APP_OKTA_TESTING_DISABLEHTTPSCHECK: false,
  SVELTE_APP_REDIRECT_OKTA_URL: "http://conference.frontend/",
};