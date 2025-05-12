import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and then merges Tailwind classes using twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple encryption/decryption for URL parameters
 */
const ENCRYPTION_KEY = "nordastro";

/**
 * Encodes an object to a base64 string with simple obfuscation
 */
export function encodeUrlData(data: any): string {
  try {
    // Convert to string
    const jsonStr = JSON.stringify(data);
    
    // Simple XOR encryption with a key
    let result = '';
    for (let i = 0; i < jsonStr.length; i++) {
      const charCode = jsonStr.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    
    // Convert to base64
    return btoa(result).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (e) {
    console.error("Error encoding URL data:", e);
    return "";
  }
}

/**
 * Decodes a base64 string back to an object
 */
export function decodeUrlData(encodedStr: string): any {
  try {
    // Convert from URL-safe base64
    const base64 = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64
    const encryptedStr = atob(base64);
    
    // Decrypt with XOR
    let result = '';
    for (let i = 0; i < encryptedStr.length; i++) {
      const charCode = encryptedStr.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    
    // Parse JSON
    return JSON.parse(result);
  } catch (e) {
    console.error("Error decoding URL data:", e);
    return null;
  }
}

/**
 * Generates a random string of specified length
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Creates a shareable URL for the quiz with the given parameters
 */
export function createShareableQuizUrl(
  baseUrl: string,
  params: {
    gender?: string;
    resultId?: string;
    answers?: Record<string, string[]>;
  }
) {
  const url = new URL(baseUrl);
  
  // Create a data object with all parameters
  const urlData: Record<string, any> = {};
  
  // Add gender if present
  if (params.gender) {
    urlData.g = params.gender;
  }
  
  // Add result if present
  if (params.resultId) {
    urlData.r = params.resultId;
    urlData.sr = 1;
  }
  
  // Add answers if present
  if (params.answers && Object.keys(params.answers).length > 0) {
    urlData.a = params.answers;
  }
  
  // Encode all data into a single parameter
  const encodedData = encodeUrlData(urlData);
  
  // Add random string to make it look less like an encoded object
  const randomPrefix = generateRandomString(4);
  url.searchParams.set("d", randomPrefix + encodedData);
  
  return url.toString();
}

/**
 * Extracts parameters from an encoded URL
 */
export function extractUrlParameters(url: string): {
  gender?: string;
  resultId?: string;
  answers?: Record<string, string[]>;
  showResults?: boolean;
} {
  try {
    const urlObj = new URL(url);
    const encodedData = urlObj.searchParams.get("d");
    
    if (!encodedData) {
      // Fall back to old URL format if no encoded data
      return {
        gender: urlObj.searchParams.get("gender") || undefined,
        resultId: urlObj.searchParams.get("result") || undefined,
        answers: urlObj.searchParams.get("ans") ? 
          JSON.parse(urlObj.searchParams.get("ans") || "{}") : undefined,
        showResults: urlObj.searchParams.get("showResults") === "1"
      };
    }
    
    // Remove random prefix (first 4 characters)
    const actualData = encodedData.substring(4);
    const decodedData = decodeUrlData(actualData);
    
    if (!decodedData) return {};
    
    return {
      gender: decodedData.g,
      resultId: decodedData.r,
      answers: decodedData.a,
      showResults: decodedData.sr === 1
    };
  } catch (e) {
    console.error("Error extracting URL parameters:", e);
    return {};
  }
}

/**
 * Generates a short description based on quiz result
 */
export function generateShareDescription(resultTitle: string): string {
  return `Check out my ${resultTitle} result from the Nordastro quiz!`;
}