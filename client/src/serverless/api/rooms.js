// serverless/api/rooms.js
import {
  createRoom,
  getAvailableRooms,
  getRooms,
  getRoomById,
  updateRoomById,
  getRoomsByTenantId,
  deleteRoomById
} from '../../controllers/roomsController.js';
import { verifyToken } from '../../middleware/auth.js';

export default async function handler(req, res) {
  try {
    const { method, query } = req;

    switch (method) {
      // POST: create a room
      case 'POST':
        if (query.action === 'create') {
          await verifyToken(req, res, async () => {
            await createRoom(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid POST action' });
        }
        break;

      // GET: fetch rooms
      case 'GET':
        if (query.action === 'all') {
          await verifyToken(req, res, async () => {
            await getRooms(req, res);
          });
        } else if (query.action === 'available') {
          await verifyToken(req, res, async () => {
            await getAvailableRooms(req, res);
          });
        } else if (query.action === 'byTenant' && query.tenantId) {
          req.params = { id: query.tenantId };
          await verifyToken(req, res, async () => {
            await getRoomsByTenantId(req, res);
          });
        } else if (query.action === 'byId' && query.id) {
          req.params = { id: query.id };
          await verifyToken(req, res, async () => {
            await getRoomById(req, res);
          });
        } else {
          res.status(400).json({ error: 'Invalid GET action' });
        }
        break;

      // PATCH: update a room
      case 'PATCH':
        if (query.id) {
          req.params = { id: query.id };
          await verifyToken(req, res, async () => {
            await updateRoomById(req, res);
          });
        } else {
          res.status(400).json({ error: 'Missing room ID for PATCH' });
        }
        break;

      // DELETE: delete a room
      case 'DELETE':
        if (query.id) {
          req.params = { id: query.id };
          await verifyToken(req, res, async () => {
            await deleteRoomById(req, res);
          });
        } else {
          res.status(400).json({ error: 'Missing room ID for DELETE' });
        }
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Serverless rooms handler error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
