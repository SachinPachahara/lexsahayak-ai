import { AuditLog } from '../models/AuditLog.js';
import { sha256 } from '../utils/crypto.js';
export async function audit({ userId, action, resourceType, resourceId, result = 'success', metadata = {}, ip = '' }) {
  try {
    await AuditLog.create({ userId, action, resourceType, resourceId: resourceId ? String(resourceId) : undefined, result, metadata, ipHash: ip ? sha256(ip) : undefined });
  } catch { /* audit failures must not break primary user flow */ }
}
