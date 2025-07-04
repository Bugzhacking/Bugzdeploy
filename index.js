
require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const { exec } = require('child_process');

const BOT_TOKEN = process.env.BOT_TOKEN;
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim()).filter(Boolean);

const bot = new Telegraf(BOT_TOKEN);
const PREFIX = '.,_';
const RENDER_BASE = 'https://api.render.com/v1/services';
const axiosCfg = { headers: { 'Authorization': `Bearer ${RENDER_API_KEY}`, 'Content-Type': 'application/json' } };

// Utility: check admin
function isAdmin(ctx) {
  return ADMIN_IDS.length === 0 || ADMIN_IDS.includes(String(ctx.from.id));
}

// Utility: fetch all services
async function fetchServices() {
  const { data } = await axios.get(RENDER_BASE, axiosCfg);
  return data;
}

// Bot start
bot.start((ctx) => ctx.reply('🤖 Bugzkingz Deployer at your service. Use /help for commands.'));

// Help
bot.command('help', (ctx) => {
  ctx.replyWithMarkdownV2(`*Commands*:
• /deploy <GitHubURL> \\_\\_\\_ Deploy a repo to Render
• /status <name> \\_\\_\\_ Check deploy status
• /list \\_\\_\\_ List all deployments
• /delete <name> \\_\\_\\_ Delete a deployment
• /term <cmd> \\_\\_\\_ \(Admin\) Run shell command`);
});

// /deploy
bot.command('deploy', async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply('❌ Not authorized');
  const args = ctx.message.text.split(' ').slice(1);
  const repo = args[0];
  if (!repo?.startsWith('https://github.com')) return ctx.reply('❌ Provide a valid GitHub repo URL');

  const name = 'bugz_' + Math.random().toString(36).substring(2, 8);
  const body = {
    name,
    repo,
    branch: 'main',
    buildCommand: 'npm install',
    startCommand: 'node index.js',
    env: 'node',
    plan: 'free',
    type: 'worker',
    envVars: [
      { key: 'BOT_TOKEN', value: BOT_TOKEN },
      { key: 'RENDER_API_KEY', value: RENDER_API_KEY }
    ]
  };
  try {
    const { data } = await axios.post(RENDER_BASE, body, axiosCfg);
    ctx.reply(`✅ Deploying **${name}** (id: ${data.id})`);
  } catch (err) {
    ctx.reply(`❌ Deploy failed: ${err.response?.data?.message || err.message}`);
  }
});

// /list
bot.command('list', async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply('❌ Not authorized');
  try {
    const services = await fetchServices();
    if (!services.length) return ctx.reply('ℹ️ No services found');
    const msg = services.map(s => `• ${s.name} — ${s.status}`).join('\n');
    ctx.reply(msg);
  } catch (err) {
    ctx.reply(`❌ Error: ${err.message}`);
  }
});

// /status
bot.command('status', async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply('❌ Not authorized');
  const name = ctx.message.text.split(' ').slice(1)[0];
  if (!name) return ctx.reply('Usage: /status <serviceName>');
  try {
    const services = await fetchServices();
    const svc = services.find(s => s.name === name);
    if (!svc) return ctx.reply('❌ Service not found');
    ctx.reply(`🔎 *${svc.name}* — Status: *${svc.status}*`, { parse_mode: 'Markdown' });
  } catch (err) {
    ctx.reply(`❌ Error: ${err.message}`);
  }
});

// /delete
bot.command('delete', async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply('❌ Not authorized');
  const name = ctx.message.text.split(' ').slice(1)[0];
  if (!name) return ctx.reply('Usage: /delete <serviceName>');
  try {
    const services = await fetchServices();
    const svc = services.find(s => s.name === name);
    if (!svc) return ctx.reply('❌ Service not found');
    await axios.delete(`${RENDER_BASE}/${svc.id}`, axiosCfg);
    ctx.reply(`🗑️ Deleted ${name}`);
  } catch (err) {
    ctx.reply(`❌ Error: ${err.message}`);
  }
});

// /term
bot.command('term', async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply('❌ Not authorized');
  const cmd = ctx.message.text.split(' ').slice(1).join(' ');
  if (!cmd) return ctx.reply('Usage: /term <command>');
  exec(cmd, { timeout: 15000 }, (err, stdout, stderr) => {
    if (err) return ctx.reply(`❌ ${err.message}`);
    const output = stdout || stderr || '(no output)';
    ctx.reply(`🖥️ ${output.substring(0, 4000)}`);
  });
});

// Fallback text handler for prefix commands
bot.on('text', (ctx) => {
  const txt = ctx.message.text.trim();
  if (!txt.startsWith(PREFIX)) return;
  ctx.reply('ℹ️ Unknown command. Use /help');
});

// Launch
bot.launch();
console.log('Bugzkingz deployer bot started', new Date().toISOString());

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
