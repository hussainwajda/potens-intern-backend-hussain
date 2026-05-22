const { verifyChain } = require('../services/chainService');
const pool = require('../db/pool');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

async function run() {
  let exitCode = 0;

  try {
    const result = await verifyChain();

    if (result.status === 'pass') {
      console.log(`${GREEN} Chain verification PASSED — ${result.total_checked} entries checked, no tampering detected${RESET}`);
    } else {
      exitCode = 1;
      console.log(`${RED} Chain verification FAILED — tampering detected at entry ID: ${result.broken_at}${RESET}`);
    }
  } catch (err) {
    exitCode = 1;
    console.error(`${RED} Chain verification FAILED — ${err.message}${RESET}`);
  } finally {
    await pool.end();
    process.exit(exitCode);
  }
}

run();
