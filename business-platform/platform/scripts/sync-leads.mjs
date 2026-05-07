#!/usr/bin/env node
// Sync Netlify form submissions → leads.json
// Run: node scripts/sync-leads.mjs

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const SITE_ID = 'ff261c1b-013c-4a81-b8b3-9942deb5583a';
const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

async function sync() {
  console.log('⚡ Syncing leads from Netlify...');

  // Fetch submissions via Netlify CLI (uses stored auth)
  let raw;
  try {
    raw = execSync(
      `netlify api listSiteSubmissions --data '{"site_id": "${SITE_ID"}'`,
      { encoding: 'utf-8', cwd: path.join(process.cwd(), '..', 'landing') }
    );
  } catch {
    console.error('❌ Failed to fetch from Netlify. Make sure you are logged in (netlify login).');
    process.exit(1);
  }

  const submissions = JSON.parse(raw);
  if (!submissions.length) {
    console.log('No new submissions.');
    return;
  }

  // Load existing leads
  let leads = [];
  if (existsSync(LEADS_FILE)) {
    leads = JSON.parse(readFileSync(LEADS_FILE, 'utf-8'));
  }

  // Get existing emails to avoid duplicates
  const existingEmails = new Set(leads.map(l => (l.primaryContact || '').toLowerCase()));

  let added = 0;
  for (const sub of submissions) {
    const d = sub.data || {};
    const email = (d.email || '').toLowerCase();
    if (!email || existingEmails.has(email)) continue;

    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      company: d.business || d.name || 'Unknown',
      name: d.name || 'Unknown',
      primaryContact: d.email || '',
      serviceInterest: d.plan || 'Starter — $297/mo',
      stage: 'New',
      owner: 'Richard',
      notes: `Industry: ${d.industry || 'N/A'} | Platform: ${d.platform || 'N/A'} | Source: Website form`,
      createdAt: sub.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    leads.unshift(newLead);
    existingEmails.add(email);
    added++;
    console.log(`  ✓ Added: ${newLead.company} (${newLead.primaryContact})`);
  }

  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2) + '\n', 'utf-8');
  console.log(`\n✅ Done. ${added} new lead(s) synced. Total leads: ${leads.length}`);
}

sync();
