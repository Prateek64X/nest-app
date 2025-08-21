// serverless/api/update-requests.js
import {
  createUpdateRequest,
  updateUpdateRequest,
  getAllUpdateRequests,
  getUpdateRequestTenant
} from '../../../server/src/controllers/updateRequestsController.js';
import { verifyToken } from '../../../server/src/middleware/auth.js';

export default async function handler(req, res) {
  try {
    const { method, query } = req;

    switch (method) {
      // POST - create a new request (tenant)
      case 'POST':
        if (query.action === 'create') {
          await verifyToken(req, res, async () => {
            await createUpdateRequest(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid POST action' });
        }
        break;

      // PATCH - update request status
      case 'PATCH':
        if (query.action === 'update' && query.id) {
          req.params = { id: query.id };
          await verifyToken(req, res, async () => {
            await updateUpdateRequest(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid PATCH action or missing ID' });
        }
        break;

      // GET routes
      case 'GET':
        if (query.action === 'admin' && query.adminId) {
          req.params = { adminId: query.adminId };
          await verifyToken(req, res, async () => {
            await getAllUpdateRequests(req, res);
          });
        } else if (query.action === 'tenant' && query.tenantId) {
          req.params = { tenantId: query.tenantId };
          await verifyToken(req, res, async () => {
            await getUpdateRequestTenant(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid GET action or missing ID' });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Serverless update-requests handler error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
