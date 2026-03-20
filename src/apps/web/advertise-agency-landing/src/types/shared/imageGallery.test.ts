import { z } from 'zod';
import { ImageGalleryContentSchema } from './imageGallery';

describe('ImageGalleryContentSchema', () => {
  it('should validate a correct ImageGalleryContent object', () => {
    const validContent = {
      prevLabel: 'Previous',
      nextLabel: 'Next',
      counter: '{current} of {total}',
      closeLabel: 'Close',
    };
    expect(() => ImageGalleryContentSchema.parse(validContent)).not.toThrow();
  });

  it('should throw an error for a missing prevLabel', () => {
    const invalidContent = {
      nextLabel: 'Next',
      counter: '{current} of {total}',
      closeLabel: 'Close',
    };
    expect(() => ImageGalleryContentSchema.parse(invalidContent)).toThrow(z.ZodError);
  });

  it('should throw an error for an invalid counter type', () => {
    const invalidContent = {
      prevLabel: 'Previous',
      nextLabel: 'Next',
      counter: 123,
      closeLabel: 'Close',
    };
    expect(() => ImageGalleryContentSchema.parse(invalidContent)).toThrow(z.ZodError);
  });

  // Since imageGalleryContent is a direct parse of a raw import,
  // we can't easily test its failure without mocking the import.
  // For now, we'll assume the raw data conforms to the schema.
});
