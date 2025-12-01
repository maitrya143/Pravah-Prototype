import crypto from 'crypto';
import QRCode from 'qrcode';

const QR_SECRET = process.env.QR_SECRET || 'your-qr-secret-key-change-in-production';

// Generate HMAC signature for QR code payload
export function generateQRSignature(payload) {
  const hmac = crypto.createHmac('sha256', QR_SECRET);
  hmac.update(payload);
  return hmac.digest('hex');
}

// Verify HMAC signature
export function verifyQRSignature(payload, signature) {
  const expectedSignature = generateQRSignature(payload);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Generate QR code payload: student_id|center_id|timestamp
export function generateQRPayload(studentId, centerId) {
  const timestamp = Date.now();
  const payload = `${studentId}|${centerId}|${timestamp}`;
  const signature = generateQRSignature(payload);
  return `${payload}|${signature}`;
}

// Parse and verify QR code payload
export function parseQRPayload(qrData) {
  const parts = qrData.split('|');
  if (parts.length !== 4) {
    throw new Error('Invalid QR code format');
  }

  const [studentId, centerId, timestamp, signature] = parts;
  const payload = `${studentId}|${centerId}|${timestamp}`;

  // Verify signature
  if (!verifyQRSignature(payload, signature)) {
    throw new Error('Invalid QR code signature');
  }

  // Check if QR code is too old (24 hours)
  const qrTime = parseInt(timestamp);
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  if (now - qrTime > maxAge) {
    throw new Error('QR code has expired');
  }

  return {
    studentId: parseInt(studentId),
    centerId: parseInt(centerId),
    timestamp: qrTime,
  };
}

// Generate QR code image as data URL
export async function generateQRCodeImage(payload) {
  try {
    const dataURL = await QRCode.toDataURL(payload);
    return dataURL;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
}

