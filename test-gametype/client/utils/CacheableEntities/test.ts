import { Entity } from '@nativewrappers/client';
import { CachedObject } from '../CachedObject.js';

export class CachedEntity<T extends Entity> extends CachedObject<T> {
  constructor(original: T) {
    super(original, 'Handle');
  }
}
