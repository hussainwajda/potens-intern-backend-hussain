const { appendEntry, verifyChain, verifyEntry } = require('../../services/chainService');
const pool = require('../pool');

async function runSeed() {
  try {
    await appendEntry({
      actor: 'system',
      action: 'create_log',
      payload: { message: 'Genesis test entry' },
    });

    await appendEntry({
      actor: 'admin',
      action: 'update_config',
      payload: { setting: 'retention_days', value: 30 },
    });

    await appendEntry({
      actor: 'auditor',
      action: 'review_chain',
      payload: { scope: 'test-seed', approved: true },
    });

    const chainResult = await verifyChain();
    console.log('verifyChain result:', chainResult);

    const entryResult = await verifyEntry(2);
    console.log('verifyEntry(2) result:', entryResult);
  } catch (err) {
    console.log('Seed failed:', err);
  } finally {
    await pool.end();
  }
}

runSeed();
