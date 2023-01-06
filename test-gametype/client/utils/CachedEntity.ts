import { Entity, Ped, Prop, Vehicle } from '@nativewrappers/client';
import { CachedObject } from './CachedObject.js';
import { Pickup2 } from './Entities.js';

export type EntityTypes = Entity | Ped | Pickup2 | Vehicle | Prop;

export class CachedEntity extends CachedObject<EntityTypes> {
  constructor(original: EntityTypes) {
    super(original, 'Handle');
  }
}
