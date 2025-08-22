// serverless/api/tenants.js
import multer from 'multer';
import {
  createTenant,
  getTenants,
  getTenantById,
  getTenantsByIds,
  updateTenant,
  updateTenantProfile,
  deleteTenant,
} from '@/serverless/controllers/tenantsController.js';
import { verifyToken } from '@/serverless/middleware/auth';

// Multer memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  try {
    const { method, query } = req;

    switch (method) {
      // POST routes
      case 'POST':
        if (query.action === 'create') {
          await verifyToken(req, res, async () => {
            await new Promise((resolve, reject) => {
              upload.any()(req, res, async (err) => {
                if (err) return reject(err);
                try {
                  await createTenant(req, res);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              });
            });
          });
        } else if (query.action === 'byIds') {
          await verifyToken(req, res, async () => {
            await getTenantsByIds(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid POST action' });
        }
        break;

      // GET routes
      case 'GET':
        if (query.action === 'all') {
          await verifyToken(req, res, async () => {
            await getTenants(req, res);
          });
        } else if (query.action === 'byId' && query.id) {
          req.params = { id: query.id };
          await verifyToken(req, res, async () => {
            await getTenantById(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid GET action' });
        }
        break;

      // PATCH routes
      case 'PATCH':
        if (query.action === 'update' && query.id) {
          req.params = { id: query.id };
          await verifyToken(req, res, async () => {
            await new Promise((resolve, reject) => {
              upload.any()(req, res, async (err) => {
                if (err) return reject(err);
                try {
                  await updateTenant(req, res);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              });
            });
          });
        } else if (query.action === 'profile' && query.id) {
          req.params = { id: query.id };
          await verifyToken(req, res, async () => {
            await updateTenantProfile(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid PATCH action' });
        }
        break;

      // DELETE routes
      case 'DELETE':
        if (query.id) {
          req.params = { id: query.id };
          await verifyToken(req, res, async () => {
            await deleteTenant(req, res);
          });
        } else {
          res.status(400).json({ error: 'Missing tenant ID for DELETE' });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Serverless tenants handler error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
