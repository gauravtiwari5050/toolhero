import { ObjectId } from 'mongodb';
export function autoId(): string {
  const autoId = new ObjectId().toString();
  return autoId;
}
