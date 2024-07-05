// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function (arr: Array<any>) {
  return arr[Math.floor(Math.random() * arr.length)];
}
