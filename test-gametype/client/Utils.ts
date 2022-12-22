import { Vector2, Vector3 } from '@nativewrappers/client';



// wrapper ---------------------------------------------------------------------------------------

export const Vector3To2 = (vec: Vector3) => new Vector2(vec.x, vec.y);
