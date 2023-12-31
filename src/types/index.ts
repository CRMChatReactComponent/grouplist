export type CancelableReturnType = void | false | Promise<void | false>;

export type UnSettable<T> = T | undefined;
export type US<T> = UnSettable<T>;
