
```
 ██████╗ ██╗   ██╗ ██████╗ ███████╗██╗  ██╗██╗███╗   ██╗ ██████╗ ███████╗
██╔════╝ ██║   ██║██╔═══██╗██╔════╝██║ ██╔╝██║████╗  ██║██╔════╝ ██╔════╝
██║  ███╗██║   ██║██║   ██║███████╗█████╔╝ ██║██╔██╗ ██║██║  ███╗█████╗  
██║   ██║██║   ██║██║   ██║╚════██║██╔═██╗ ██║██║╚██╗██║██║   ██║██╔══╝  
╚██████╔╝╚██████╔╝╚██████╔╝███████║██║  ██╗██║██║ ╚████║╚██████╔╝███████╗
 ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
```

> 🤖 **BUGZKINGZ** v1.0.0 — "Deploy Fast. Rule Faster."  
> 🧠 Telegram bot that **spins up Render bots from GitHub links**

---

## 🐍 Features

| Key | Value |
|---|---|
| **Prefix** | `.,_` |
| **Deploy Type** | Any GitHub-based bot/app |
| **Deployment Target** | [Render.com](https://render.com) |
| **Language** | Node.js |
| **Security** | Render API Key required |
| **Contact** | gamershub20007@gmail.com / +263 780 667 006 |

- 🔧 Deploy **other bots** from GitHub right from Telegram  
- 🧠 Commands like `/deploy`, `/status`, `/delete`, `/list`  
- 💡 Supports any Node.js, Python, or Docker-based repo  
- ☁️ Works via **Render API**  
- 🧰 Clean and hackable setup

---

## 💾 Setup Locally

```bash
git clone https://github.com/Bugzking210/bugzkingz-telegram-bot.git
cd bugzkingz-telegram-bot
npm install
```

Create an `.env` file:
```env
BOT_TOKEN=your_telegram_bot_token
RENDER_API_KEY=your_render_api_key
```

---

## 📜 Telegram Bot Commands

| Command | Action |
|--------|--------|
| `/deploy <GitHub_URL>` | Deploy a GitHub repo to Render |
| `/status <name>` | Check deploy status |
| `/delete <name>` | Delete deployment |
| `/list` | List all your deployed apps |

---

## ☁️ One‑Click Render Deployment

> From GitHub link → live bot in under 60 seconds

### `render.yaml`

```yaml
services:
  - type: worker
    name: bugzkingz
    env: node
    plan: free
    buildCommand: 'npm install'
    startCommand: 'node index.js'
    envVars:
      - key: BOT_TOKEN
        sync: false
      - key: RENDER_API_KEY
        sync: false
```

---

## 🧠 Behind the Scenes

This bot:
1. Talks to Telegram users
2. Parses commands like `/deploy https://github.com/username/bot`
3. Uses the **Render REST API** to create services
4. Tracks services per user
5. Replies with deployment status and controls

---

## 🛠 Add More Logic?

Want to:
- Validate repos?
- Limit per-user deploys?
- Auto‑configure environment vars?

Just dive into `index.js` and expand the logic.

---

## 📡 Contact

- 🧑‍💻 GitHub: [Bugzking210](https://github.com/Bugzking210)
- 📧 Email: gamershub20007@gmail.com
- 📱 WhatsApp: +263 780 667 006

---

## ☠️ Warning

> This bot can deploy **live code to the cloud**. That’s not a toy. Use it like a king, not a clown 🤡.

---

🧠 *"The world belongs to those who deploy faster."*


### 🔑 Admin Protection
Set `ADMIN_IDS` in your `.env` (comma‑separated Telegram user IDs) to restrict `/deploy`, `/delete`, `/term`, etc.

```env
ADMIN_IDS=123456789,987654321
```

---

## 🚀 Commands Overview

| Command | Description |
|---------|-------------|
| `/deploy <GitHubURL>` | Deploy GitHub repo to Render |
| `/list` | List all your Render services |
| `/status <name>` | Check status of a service |
| `/delete <name>` | Delete a service |
| `/term <cmd>` | Execute shell command (admin only) |
| `/help` | Show help |
