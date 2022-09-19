export interface IdGenerator {
  ulid(): string;
  uuid(): string;
}
