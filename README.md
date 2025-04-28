# Metronome Node API Application

This Node.js app allows you to send event payloads to the Metronome API for a mock data warehouse company called Raindrop.

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and add your Metronome API token.
3. Import and use `sendMetronomeEvent` in your code:
   ```js
   const sendMetronomeEvent = require('./sendMetronomeEvent');
const token = process.env.METRONOME_TOKEN;
   sendMetronomeEvent(events, token);

