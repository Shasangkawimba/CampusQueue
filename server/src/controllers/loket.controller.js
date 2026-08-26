const db = require('../db');

const getAllLoket = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM loket ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching loket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLoketById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM loket WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loket not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching loket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createLoket = async (req, res) => {
  try {
    const { name, description, is_active } = req.body;
    const result = await db.query(
      'INSERT INTO loket (name, description, is_active) VALUES ($1, $2, $3) RETURNING *',
      [name, description, is_active ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating loket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateLoket = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;
    
    const result = await db.query(
      'UPDATE loket SET name = COALESCE($1, name), description = COALESCE($2, description), is_active = COALESCE($3, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, description, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loket not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating loket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteLoket = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM loket WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loket not found' });
    }
    res.json({ message: 'Loket deleted successfully' });
  } catch (error) {
    console.error('Error deleting loket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllLoket,
  getLoketById,
  createLoket,
  updateLoket,
  deleteLoket
};
