export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password: string) =>
  password.length >= 6;

export const isValidName = (name: string) =>
  /^[a-zA-Z\s]{2,}$/.test(name);
