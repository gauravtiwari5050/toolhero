import { Schema } from 'mongoose';

export type Options = {
  disableCreated?: boolean;
  disableUpdated?: boolean;
};

export default (schema: Schema, options?: Options) => {
  options = options || {};
  // Set defaults
  options = Object.assign(
    {
      disableCreated: false,
      disableUpdated: false,
    },
    options
  );

  // Add fields if not disabled
  if (!options.disableCreated) {
    schema.add({ createdAt: { type: Date, default: Date.now, index: 1 } });
  }
  if (!options.disableUpdated) {
    schema.add({ updatedAt: { type: Date, default: Date.now, index: 1 } });
  }

  schema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    if (!options?.disableUpdated) this.set({ updatedAt: new Date() });
    next();
  });

  return schema;
};
