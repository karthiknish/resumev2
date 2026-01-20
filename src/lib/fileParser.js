/**
 * File Parser Library for Agent Mode
 * Supports parsing PDF, DOCX, and TXT files for content extraction
 */

import pdf from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Maximum file size in bytes (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Supported file types with their MIME types
 */
const SUPPORTED_FILE_TYPES = {
  pdf: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
  },
  docx: {
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ],
    extensions: ['.docx', '.doc'],
  },
  txt: {
    mimeTypes: ['text/plain'],
    extensions: ['.txt'],
  },
};

/**
 * Check if a file type is supported
 * @param {string} mimeType - The MIME type of the file
 * @returns {boolean} - Whether the file type is supported
 */
export function isSupportedFileType(mimeType) {
  return Object.values(SUPPORTED_FILE_TYPES).some(type =>
    type.mimeTypes.includes(mimeType)
  );
}

/**
 * Get the file type from MIME type
 * @param {string} mimeType - The MIME type of the file
 * @returns {string|null} - The file type (pdf, docx, txt) or null
 */
export function getFileType(mimeType) {
  for (const [type, config] of Object.entries(SUPPORTED_FILE_TYPES)) {
    if (config.mimeTypes.includes(mimeType)) {
      return type;
    }
  }
  return null;
}

/**
 * Validate file size
 * @param {number} size - The file size in bytes
 * @returns {object} - Validation result with isValid and error message
 */
export function validateFileSize(size) {
  if (size > MAX_FILE_SIZE) {
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    const maxMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      isValid: false,
      error: `File size (${sizeMB}MB) exceeds maximum allowed size (${maxMB}MB)`,
    };
  }
  return { isValid: true };
}

/**
 * Parse a PDF buffer and extract text content
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<string>} - The extracted text content
 */
async function parsePdf(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Parse a DOCX buffer and extract text content
 * @param {Buffer} buffer - The DOCX file buffer
 * @returns {Promise<string>} - The extracted text content
 */
async function parseDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
}

/**
 * Parse a TXT buffer and extract text content
 * @param {Buffer} buffer - The TXT file buffer
 * @returns {Promise<string>} - The extracted text content
 */
async function parseTxt(buffer) {
  try {
    return buffer.toString('utf-8');
  } catch (error) {
    throw new Error(`Failed to parse TXT: ${error.message}`);
  }
}

/**
 * Parse a file based on its type and extract text content
 * @param {Buffer} buffer - The file buffer
 * @param {string} fileType - The file type (pdf, docx, txt)
 * @returns {Promise<string>} - The extracted and cleaned text content
 */
export async function parseFile(buffer, fileType) {
  let content;

  switch (fileType) {
    case 'pdf':
      content = await parsePdf(buffer);
      break;
    case 'docx':
      content = await parseDocx(buffer);
      break;
    case 'txt':
      content = await parseTxt(buffer);
      break;
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }

  // Clean up the content
  return cleanupContent(content);
}

/**
 * Clean up extracted content
 * @param {string} content - The raw content
 * @returns {string} - The cleaned content
 */
function cleanupContent(content) {
  return content
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')     // Remove excessive line breaks
    .replace(/\r\n/g, '\n')         // Normalize line endings
    .trim();
}

/**
 * Truncate content to a maximum length
 * @param {string} content - The content to truncate
 * @param {number} maxLength - The maximum length in characters
 * @returns {string} - The truncated content with an indicator
 */
export function truncateContent(content, maxLength = 15000) {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '\n\n[Content truncated...]';
}

/**
 * Parse a file from a base64 string
 * @param {string} base64 - The base64 encoded file
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<string>} - The extracted and cleaned text content
 */
export async function parseFileFromBase64(base64, mimeType) {
  const fileType = getFileType(mimeType);

  if (!fileType) {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  // Convert base64 to buffer
  const buffer = Buffer.from(base64, 'base64');

  // Validate file size
  const sizeValidation = validateFileSize(buffer.length);
  if (!sizeValidation.isValid) {
    throw new Error(sizeValidation.error);
  }

  // Parse the file
  const content = await parseFile(buffer, fileType);

  // Truncate if too long
  return truncateContent(content);
}

/**
 * Get file info from a File object (client-side)
 * @param {File} file - The File object
 * @returns {object} - File validation and info
 */
export function getFileInfo(file) {
  const fileType = getFileType(file.type);

  if (!fileType) {
    return {
      isValid: false,
      error: `Unsupported file type. Please upload PDF, DOCX, or TXT files.`,
    };
  }

  const sizeValidation = validateFileSize(file.size);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return {
    isValid: true,
    fileType,
    fileName: file.name,
    fileSize: file.size,
  };
}

export default {
  isSupportedFileType,
  getFileType,
  validateFileSize,
  parseFile,
  parseFileFromBase64,
  truncateContent,
  getFileInfo,
  MAX_FILE_SIZE,
  SUPPORTED_FILE_TYPES,
};
