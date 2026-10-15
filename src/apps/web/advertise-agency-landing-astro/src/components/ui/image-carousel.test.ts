// @vitest-environment jsdom
// Browser-state coverage verifies carousel lifecycle and cleanup behavior.
import { afterEach, expect, it, vi } from 'vitest';

class ObserverMock {
  static instances: ObserverMock[] = [];
  callback: IntersectionObserverCallback | ResizeObserverCallback;
  disconnected = false;

  constructor(callback: IntersectionObserverCallback | ResizeObserverCallback) {
    this.callback = callback;
    ObserverMock.instances.push(this);
  }

  observe() {}
  disconnect() {
    this.disconnected = true;
  }
}

const matchMedia = (matches = false) => ({
  matches,
  media: '',
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(() => true),
});

function carouselMarkup() {
  return `
    <image-carousel data-autoplay="true" data-interval="1000"
      data-manual="true" data-arrows="true" data-circles="true"
      data-item-label="Slide">
      <div class="carousel-controls"><button class="carousel-arrow"
        data-direction="1">Next</button></div>
      <div class="carousel-dots">
        <button class="carousel-dot" data-index="0"></button>
        <button class="carousel-dot" data-index="1"></button>
      </div>
      <div role="status"></div>
      <div class="carousel-slide" id="one">One</div>
      <div class="carousel-slide" id="two">Two</div>
    </image-carousel>`;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.useRealTimers();
  ObserverMock.instances = [];
});

it(
  'initializes manual state and cleans observers on disconnection',
  async () => {
  vi.stubGlobal(
    'IntersectionObserver',
    ObserverMock,
  );
  vi.stubGlobal('ResizeObserver', ObserverMock);
  vi.stubGlobal('matchMedia', () => matchMedia());
  vi.resetModules();
  await import('./image-carousel');
  document.body.innerHTML = carouselMarkup();
  const carousel = document.querySelector<HTMLElement>('image-carousel')!;
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');

  expect(carousel.dataset.ready).toBe('true');
  expect(slides[0]).not.toHaveAttribute('aria-hidden');
  expect(slides[1]).toHaveAttribute('aria-hidden', 'true');
  expect(dots[0]).toHaveAttribute('aria-current', 'true');
  expect(dots[1]).not.toHaveAttribute('aria-current');

  (dots[1] as HTMLElement).click();
  expect(slides[0]).toHaveAttribute('aria-hidden', 'true');
  expect(slides[1]).not.toHaveAttribute('aria-hidden');
  expect(carousel.querySelector('[role="status"]'))
    .toHaveTextContent('Slide 2');

  carousel.remove();
  expect(ObserverMock.instances.every(observer => observer.disconnected))
    .toBe(true);
  expect(carousel.dataset.ready).toBeUndefined();
  expect(slides[0]).not.toHaveAttribute('aria-hidden');
  },
);

it('does not enhance when observer support is unavailable', async () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  vi.stubGlobal('ResizeObserver', undefined);
  vi.stubGlobal('matchMedia', () => matchMedia());
  vi.resetModules();
  await import('./image-carousel');
  document.body.innerHTML = carouselMarkup();
  const carousel = document.querySelector<HTMLElement>('image-carousel')!;

  expect(carousel.dataset.ready).toBeUndefined();
  expect(carousel.querySelector('.carousel-slide'))
    .not.toHaveAttribute('aria-hidden');
});
