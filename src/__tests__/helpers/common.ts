export function sleep(second: number) {
  return new Promise<void>((res) => {
    setTimeout(res, second * 1000);
  });
}
