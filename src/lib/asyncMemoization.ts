type MemoizedFunction<T> = (arg: string) => Promise<T>;

export function createAsyncMemoizedFunction<T>(
  fn: (arg: string) => Promise<T>
): MemoizedFunction<T> {
  const cache = new Map<string, Promise<T>>();

  return (arg: string) => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }

    const promise = fn(arg);
    cache.set(arg, promise);
    return promise;
  };
}