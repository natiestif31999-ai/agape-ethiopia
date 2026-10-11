type DatabaseError = { message: string };
type DuplicateLookup = {
  data: Array<{ id: string }> | null;
  error: DatabaseError | null;
};
type InsertResult<T> = { data: T | null; error: DatabaseError | null };

export type PublicRegistrationStore<T> = {
  findDuplicate: () => PromiseLike<DuplicateLookup>;
  insert: (payload: Record<string, unknown>) => PromiseLike<InsertResult<T>>;
};

export type PublicRegistrationPersistenceResult<T> =
  | { kind: "duplicate" }
  | { kind: "error"; message: string }
  | { kind: "created"; data: T };

export async function persistPublicRegistration<T>(
  store: PublicRegistrationStore<T>,
  payload: Record<string, unknown>,
): Promise<PublicRegistrationPersistenceResult<T>> {
  const { data: existing, error: lookupError } = await store.findDuplicate();
  if (lookupError) return { kind: "error", message: lookupError.message };
  if (existing?.length) return { kind: "duplicate" };

  const { data, error } = await store.insert(payload);
  if (error || !data) return { kind: "error", message: error?.message ?? "The database did not confirm the registration." };
  return { kind: "created", data };
}