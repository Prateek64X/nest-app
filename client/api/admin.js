// serverless/api/admin.ts
import { registerAdmin, loginAdmin, getAdminProfile, checkPassword, updateAdminProfile, deleteAdminAccount } from '../src/serverless/controllers/adminController.js';
import { verifyToken } from '../src/serverless/middleware/auth.js';

export default async function handler(req, res) {
  try {
    const { method } = req;

    // Route based on method + optional query/action parameter
    switch (method) {
      case 'POST':
        if (req.query.action === 'register') {
          await registerAdmin(req, res);
        } else if (req.query.action === 'login') {
          await loginAdmin(req, res);
        } else if (req.query.action === 'verify-password') {
          await verifyToken(req, res, async () => {
            await checkPassword(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid POST action' });
        }
        break;

      case 'GET':
        if (req.query.action === 'profile') {
          await verifyToken(req, res, async () => {
            await getAdminProfile(req, res);
          });
        } else if (req.query.action === 'delete') {
          await verifyToken(req, res, async () => {
            await deleteAdminAccount(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid GET action' });
        }
        break;

      case 'PUT':
        if (req.query.action === 'profile') {
          await verifyToken(req, res, async () => {
            await updateAdminProfile(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid PUT action' });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Serverless admin handler error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
