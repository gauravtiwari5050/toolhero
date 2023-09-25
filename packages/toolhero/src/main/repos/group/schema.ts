import { model, Schema } from 'mongoose';
import timestampsPlugin from '../timestampPlugin';
import { IGroupSerialized } from './Group';

export const schema = new Schema<IGroupSerialized>({
  name: { type: String, required: true, index: true },
});

schema.plugin(timestampsPlugin);

schema.index({ specialities: 'text', languages: 'text' });
