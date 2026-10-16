// Provision a clean CI checkout with synthetic data for the normal build.
// Never overwrite a developer's separately supplied runtime content.
import { cp, mkdir } from 'node:fs/promises';

if (process.env.CI !== 'true') {
  throw new Error('Synthetic runtime provisioning is restricted to CI');
}
await mkdir('data/content');
await cp('tests/fixtures/content/site', 'data/content', { recursive: true });
