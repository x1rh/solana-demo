// rust 
export type Result<T, E> = {value: T } | {error: E };

export function isErr<T, E>(result: Result<T, E>): result is {error: E} {
    return "error" in result;
}