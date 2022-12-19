const MemoCache: Record<string, HashStore> = {};

type HashStore = {
  value: any;
};

class CacheProxyHandler<T extends object> {
  private subKey = 'funcVal';
  constructor(private idKey: keyof T) {}

  private storeCache(hashedKey: string, value: any) {
    const cacheVal = { value };
    MemoCache[hashedKey] = cacheVal;
    return cacheVal;
  }

  // Thunk to cache lookup for function calls
  private proxiedFunction =
    (hashedKey: string, targetObj: T, origFunc: Function) =>
    // Actual proxied call
    (...args: any[]) => {
      const subKey = `${hashedKey}-${this.subKey}`;
      let returnVal: any = MemoCache[subKey];

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
    let returnVal: any = MemoCache[hashedKey];

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

  clearCache(targetObj: T, property: keyof T) {
    const hashedKey = `${targetObj[this.idKey]}-${String(property)}`;
    delete MemoCache[hashedKey];
    delete MemoCache[`${hashedKey}-${this.subKey}`];
  }
}

export class CachedObject<T extends object> {
  original: T;
  cached: T;

  private handler: CacheProxyHandler<T>;

  constructor(original: T, idKey: string) {
    this.original = original;
    this.handler = new CacheProxyHandler<T>(idKey as keyof T);
    this.cached = new Proxy<T>(this.original, this.handler);
  }

  clearCache = (property: keyof T) => this.handler.clearCache(this.cached, property);
}
