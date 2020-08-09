import { Buffer } from 'buffer';

const isBasicAuthValid = (
  authorizationHeader: string,
  matchingUsername: string,
  matchingPassword: string,
): boolean => {
  const token = authorizationHeader.split(/\s+/).pop() || '';

  const auth = Buffer.from(token, 'base64').toString();
  const parts = auth.split(/:/);

  const username = parts[0];
  const password = parts[1];

  return (
    username === matchingUsername && password === matchingPassword
  );
};

export default isBasicAuthValid;
