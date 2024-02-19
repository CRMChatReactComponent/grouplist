import { slice } from "lodash-es";

export function insertBefore<T>(
  array: T[],
  valueToInsert: T,
  targetValue: T,
): T[] {
  // 如果存在，则从数组中移除
  array = array.filter((item) => item !== valueToInsert);

  // 找到目标值的索引
  const targetIndex = array.findIndex((item) => item === targetValue);

  if (!~targetIndex) {
    // 如果没有找到目标值，返回
    return array;
  }

  // 将新值插入到指定索引的前面
  console.log([
    ...slice(array, 0, targetIndex), // 目标索引前的部分
    valueToInsert, // 插入的新值
    ...slice(array, targetIndex), // 目标索引及其之后的部分
  ]);
  return [
    ...slice(array, 0, targetIndex), // 目标索引前的部分
    valueToInsert, // 插入的新值
    ...slice(array, targetIndex), // 目标索引及其之后的部分
  ];
}
