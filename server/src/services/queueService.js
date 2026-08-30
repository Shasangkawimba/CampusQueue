const db = require('../db');

class QueueService {
  /**
   * Mengambil tiket baru untuk loket tertentu
   * Menggunakan pola atomic upsert untuk mencegah race condition
   */
  async takeNewTicket(loketId) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Pastikan loket aktif
      const loketCheck = await client.query('SELECT is_active FROM loket WHERE id = $1', [loketId]);
      if (loketCheck.rows.length === 0) {
        throw new Error('Loket tidak ditemukan');
      }
      if (!loketCheck.rows[0].is_active) {
        throw new Error('Loket sedang tidak aktif');
      }

      // Upsert counter harian, atomic increment
      const counterResult = await client.query(
        `INSERT INTO daily_counters (loket_id, date, last_number)
         VALUES ($1, CURRENT_DATE, 1)
         ON CONFLICT (loket_id, date)
         DO UPDATE SET last_number = daily_counters.last_number + 1
         RETURNING last_number`,
        [loketId]
      );
      const number = counterResult.rows[0].last_number;

      // Insert antrian
      const ticketResult = await client.query(
        `INSERT INTO queue_tickets (loket_id, number, status)
         VALUES ($1, $2, 'waiting') RETURNING *`,
        [loketId, number]
      );

      await client.query('COMMIT');
      return ticketResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Memanggil tiket antrian berikutnya (menjadi status 'called')
   * Menggunakan pola FOR UPDATE SKIP LOCKED untuk mencegah bentrok antar admin
   */
  async callNextTicket(loketId) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Ambil tiket yang paling lama menunggu (status waiting)
      const result = await client.query(
        `SELECT * FROM queue_tickets
         WHERE loket_id = $1 AND status = 'waiting'
         ORDER BY created_at ASC
         LIMIT 1
         FOR UPDATE SKIP LOCKED`,
        [loketId]
      );

      if (result.rows.length === 0) {
        await client.query('COMMIT');
        return null; // tidak ada antrian tersisa
      }

      const ticket = result.rows[0];
      
      // Update tiket menjadi 'called' dan set called_at
      const updateResult = await client.query(
        `UPDATE queue_tickets SET status = 'called', called_at = NOW()
         WHERE id = $1 RETURNING *`,
        [ticket.id]
      );

      await client.query('COMMIT');
      return updateResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Get the current status of the queue for a loket
   */
  async getQueueStatus(loketId) {
    const client = await db.getClient();
    try {
      // Get the currently serving ticket (the latest one that was called)
      const servingResult = await client.query(
        `SELECT number FROM queue_tickets 
         WHERE loket_id = $1 AND status = 'called' 
         ORDER BY called_at DESC LIMIT 1`,
        [loketId]
      );
      
      // Get count of people waiting
      const waitingResult = await client.query(
        `SELECT COUNT(*) as count FROM queue_tickets 
         WHERE loket_id = $1 AND status = 'waiting'`,
        [loketId]
      );

      // Get average service duration in minutes from the last 10 completed tickets
      const avgResult = await client.query(
        `SELECT COALESCE(
          AVG(EXTRACT(EPOCH FROM (completed_at - called_at)) / 60),
          10
        ) as avg_wait_minutes
        FROM (
          SELECT called_at, completed_at
          FROM queue_tickets
          WHERE loket_id = $1 AND status = 'done' AND completed_at IS NOT NULL AND called_at IS NOT NULL
          ORDER BY completed_at DESC
          LIMIT 10
        ) as recent_tickets`,
        [loketId]
      );

      return {
        currentlyServing: servingResult.rows.length > 0 ? servingResult.rows[0].number : '-',
        peopleAhead: parseInt(waitingResult.rows[0].count, 10),
        avgWaitMinutes: Math.round(parseFloat(avgResult.rows[0].avg_wait_minutes))
      };
    } finally {
      client.release();
    }
  }
}

module.exports = new QueueService();
