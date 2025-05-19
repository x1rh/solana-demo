// rust 
export type Result<T, E> = {value: T } | {error: E };

export function isErr<T, E>(result: Result<T, E>): result is {error: E} {
    return "error" in result;
}

export function runWithTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
  ]);
}