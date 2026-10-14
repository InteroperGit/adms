// Inject private acceptance routes only when explicitly enabled for testing.
import { fileURLToPath } from 'node:url';

export default function articleAcceptance() {
  return {
    name: 'article-acceptance',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        injectRoute({
          pattern: '/__visual-check/[variant]/',
          entrypoint: fileURLToPath(new URL(
            '../fixtures/visual-blocks.astro', import.meta.url,
          )),
          prerender: true,
        });
        injectRoute({
          pattern: '/__article-check/[case]/[format]/',
          entrypoint: fileURLToPath(new URL(
            '../fixtures/article-acceptance.astro', import.meta.url,
          )),
          prerender: true,
        });
      },
    },
  };
}
