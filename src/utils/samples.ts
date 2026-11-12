/**
 * High quality photorealistic sample images for 1-click testing in SAYAN AI LAB.
 */

export const REAL_SAMPLE_IMAGES = {
  portrait: {
    id: 'portrait',
    name: 'Studio Portrait (Curly Hair)',
    url: '/src/assets/images/sample_portrait_model_1794414654520.jpg',
    badge: 'Hair & Edges',
    desc: 'Complex flyaway hair curls & architectural backdrop',
  },
  sneaker: {
    id: 'sneaker',
    name: 'Athletic Sneaker',
    url: '/src/assets/images/sample_product_runner_1794414654118.jpg',
    badge: 'Product Cutout',
    desc: 'Detailed sole tread, laces & concrete surface',
  },
  cat: {
    id: 'cat',
    name: 'Fluffy Cat (Fur & Whiskers)',
    url: '/src/assets/images/sample_fluffy_cat_1794414654220.jpg',
    badge: 'Fine Fur Detail',
    desc: 'Soft fur contours, fine whiskers & patterned rug',
  },
};

// Fallback generator for other quick mock tools if needed
export function createSampleImage(type: 'portrait' | 'sneaker' | 'gadget' | 'cat'): string {
  if (type === 'portrait') return REAL_SAMPLE_IMAGES.portrait.url;
  if (type === 'sneaker') return REAL_SAMPLE_IMAGES.sneaker.url;
  if (type === 'cat') return REAL_SAMPLE_IMAGES.cat.url;
  return REAL_SAMPLE_IMAGES.sneaker.url;
}
