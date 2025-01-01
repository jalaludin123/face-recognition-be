import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function toHash(password: string) {
  const salt = randomBytes(8).toString('hex');
  const buf = await scryptAsync(password, salt, 64);

  return `${(buf as Buffer).toString('hex')}.${salt}`;
}

export async function compare(
  storedPassword: string,
  suppliedPassword: string,
) {
  const [hashedStoredPassword, salt] = storedPassword.split('.');
  const buf = await scryptAsync(suppliedPassword, salt, 64);
  const hashedSuppliedPassword = (buf as Buffer).toString('hex');
  return hashedStoredPassword === hashedSuppliedPassword;
}
