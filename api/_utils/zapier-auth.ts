import { Buffer } from 'buffer';

const { ZAPIER_BASIC_AUTH_USERNAME, ZAPIER_BASIC_AUTH_PASSWORD } = process.env;

const isBasicAuthValid = (authorizationHeader = '') => {
  const token = authorizationHeader.split(/\s+/).pop() || '';

  const auth = Buffer.from(token, 'base64').toString();
  const parts = auth.split(/:/);

  const username = parts[0];
  const password = parts[1];

  return username === ZAPIER_BASIC_AUTH_USERNAME && password === ZAPIER_BASIC_AUTH_PASSWORD
};

export default isBasicAuthValid;
