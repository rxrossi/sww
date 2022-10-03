export class Ids {
  ulid = () => Date.now().toString() + Math.random();
  id = () => Date.now().toString() + Math.random();
}
