const queueService = require('../services/queueService');
const socketService = require('../services/socketService');

class QueueController {
  async getStatus(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Loket ID is required' });
      }
      const status = await queueService.getQueueStatus(id);
      return res.status(200).json({ data: status });
    } catch (error) {
      console.error('Error getting queue status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async takeTicket(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'Loket ID is required' });
      }

      const ticket = await queueService.takeNewTicket(id);
      
      // Phase 4: Broadcast update
      const newStatus = await queueService.getQueueStatus(id);
      socketService.broadcastQueueUpdate(id, 'TAKE_TICKET', {
        ticket,
        status: newStatus
      });

      return res.status(201).json({
        message: 'Ticket successfully created',
        data: ticket
      });
    } catch (error) {
      console.error('Error taking ticket:', error);
      
      if (error.message === 'Loket tidak ditemukan' || error.message === 'Loket sedang tidak aktif') {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async callNext(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Loket ID is required' });
      }

      // Check if admin calling it has permission for this loket
      // For now, any logged-in admin can call next for any loket as per MVP,
      // but if req.user.loket_id is set, it might need to match.
      // Based on PRD we will keep it simple for now.

      const ticket = await queueService.callNextTicket(id);

      if (!ticket) {
        return res.status(404).json({ message: 'No tickets waiting in queue' });
      }

      // Phase 4: Broadcast update
      const newStatus = await queueService.getQueueStatus(id);
      socketService.broadcastQueueUpdate(id, 'CALL_NEXT', {
        ticket,
        status: newStatus
      });

      return res.status(200).json({
        message: 'Next ticket called successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Error calling next ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new QueueController();
