#!/usr/bin/env node

import bcrypt from 'bcryptjs';
import readline from 'readline';

const isTTY = process.stdin.isTTY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: isTTY
});

let lineCount = 0;
let password = '';
let password2 = '';

console.log('🔐 Admin Password Hash Generator\n');

if (isTTY) {
  // Interactive mode - use prompts
  function promptPassword() {
    rl.question('Enter password: ', (answer) => {
      password = answer;
      rl.question('Confirm password: ', (answer2) => {
        password2 = answer2;
        finalize();
      });
    });
  }
  promptPassword();
} else {
  // Non-interactive mode - read from stdin
  rl.on('line', (line) => {
    if (lineCount === 0) {
      password = line.trim();
    } else if (lineCount === 1) {
      password2 = line.trim();
    }
    lineCount++;
  });

  rl.on('close', () => {
    finalize();
  });
}

function finalize() {
  if (!password || password.length === 0) {
    console.error('❌ Error: Password cannot be empty');
    process.exit(1);
  }

  if (password !== password2) {
    console.error('❌ Error: Passwords do not match');
    process.exit(1);
  }

  const hash = bcrypt.hashSync(password, 10);

  console.log('✅ Password hash generated successfully:\n');
  console.log('Add this to your .env file:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);

  rl.close();
  process.exit(0);
}
