const MemoCache: Map<string, HashStore> = new Map();

type HashStore = {
  value: any;
};

class CacheProxyHandler<T extends object> {
  private subKey = 'funcVal';
  constructor(private idKey: keyof T) {}

  private storeCache(hashedKey: string, value: any) {
    const cacheVal = { value };
    MemoCache.set(hashedKey, cacheVal);
    return cacheVal;
  }

  // Thunk to cache lookup for function calls
  private proxiedFunction =
    (hashedKey: string, targetObj: T, origFunc: Function) =>
    // Actual proxied call
    (...args: any[]) => {
      const subKey = `${hashedKey}-${this.subKey}`;
      let returnVal: any = MemoCache.get(subKey);

      // Cache Miss, call and store!
      if (!returnVal) {
        returnVal = this.storeCache(subKey, origFunc.apply(targetObj, args));
      }

      return returnVal.value;
    };

  get(targetObj: T, key: string | symbol) {
    const hashedKey = `${targetObj[this.idKey]}-${String(key)}`;
    const targetProp = targetObj[key as keyof T];
    const isFunc = 'function' === typeof targetProp;
    let returnVal: any = MemoCache.get(hashedKey);

    // Cache miss
    if (!returnVal) {
      returnVal = this.storeCache(
        hashedKey,
        // If a simple prop, cache that.
        // If a function, use `proxiedFunction` thunk wrapper to
        // generate a function specifically to check this and return as necessary.
        !isFunc ? targetProp : this.proxiedFunction(hashedKey, targetObj, targetProp as Function)
      );
    }

    // Return the cache
    return returnVal.value;
  }

  // Clear all cache for a target object
  clearCache(targetObj: T) {
    const hashedStart = `${targetObj[this.idKey]}`;
    for (let key of Object.keys(MemoCache)) {
      if (key.startsWith(hashedStart)) {
        MemoCache.delete(key);
      }
    }
  }

  // Clear a specific hashed key value for a target object
  clearPropCache(targetObj: T, property: keyof T) {
    const hashedKey = `${targetObj[this.idKey]}-${String(property)}`;
    MemoCache.delete(hashedKey);
    MemoCache.delete(`${hashedKey}-${this.subKey}`);
  }
}

export class CachedObject<T extends object> {
  original: T;
  cached: T;

  private handler: CacheProxyHandler<T>;

  constructor(original: T, idKey: keyof T) {
    this.original = original;
    this.handler = new CacheProxyHandler<T>(idKey as keyof T);
    this.cached = new Proxy<T>(this.original, this.handler);
  }

  clearCache = () => this.handler.clearCache(this.cached);
  clearPropCache = (property: keyof T) => this.handler.clearPropCache(this.cached, property);
}
