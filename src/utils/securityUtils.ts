
// Input validation and sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const validatePhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // Optional field
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone.trim());
};

export const validateMessage = (message: string): boolean => {
  const cleaned = message.trim();
  return cleaned.length >= 10 && cleaned.length <= 1000;
};

export const rateLimitCheck = (): boolean => {
  const lastSubmission = localStorage.getItem('lastContactSubmission');
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  if (lastSubmission && (now - parseInt(lastSubmission)) < fiveMinutes) {
    return false; // Rate limited
  }
  
  localStorage.setItem('lastContactSubmission', now.toString());
  return true;
};
