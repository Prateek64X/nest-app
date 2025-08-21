// serverless/api/room-rents.js
import {
  createRoomRentEntries,
  getUpcomingRoomRents,
  getRoomRents,
  getRoomRentByTenant,
  updateRoomRent
} from '../../controllers/roomRentController.js';
import { verifyToken } from '../../middleware/auth.js';

export default async function handler(req, res) {
  try {
    const { method, query } = req;

    switch (method) {
      // Create entries or get all room rents
      case 'POST':
        if (query.action === 'create') {
          await verifyToken(req, res, async () => {
            await createRoomRentEntries(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid POST action' });
        }
        break;

      case 'GET':
        if (query.action === 'all') {
          await verifyToken(req, res, async () => {
            await getRoomRents(req, res);
          });
        } else if (query.action === 'upcoming') {
          await verifyToken(req, res, async () => {
            await getUpcomingRoomRents(req, res);
          });
        } else if (query.action === 'tenant') {
          await verifyToken(req, res, async () => {
            await getRoomRentByTenant(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid GET action' });
        }
        break;

      case 'PATCH':
        if (query.id) {
          await verifyToken(req, res, async () => {
            req.params = { id: query.id }; // dynamic route param
            await updateRoomRent(req, res);
          });
        } else {
          res.status(400).json({ error: 'Missing room rent ID for PATCH' });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Serverless room-rents handler error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
