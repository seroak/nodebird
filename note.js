const hello = () => console.log("hi");
const wait = (timeToDelay) =>
  new Promise((hello) => setTimeout(hello, timeToDelay));
async function two() {
  await wait(5000);
}
two();
