import { Result } from '../../core/Result';
import { Document, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  AggregateFacets,
  DocType,
  EnumError,
  FacetOptions,
  FilterQuery,
  IRepo,
  Pagination,
  SearchOptions,
  SearchQuery,
  SortOrder,
} from './IRepo';
import { ErrorCodes } from '../ErrorCodes';
import _ from 'lodash';
import { HeroApplication } from '../../../toolhero/HeroApplication';

export abstract class BaseRepo<Aggregate, AggregateSerialized>
  implements IRepo<Aggregate, AggregateSerialized>
{
  private application: HeroApplication;
  constructor(application: HeroApplication) {
    this.application = application;
  }
  protected abstract get repo(): Model<AggregateSerialized>;

  protected abstract fromDomain(
    aggregate: Aggregate
  ): DocType<AggregateSerialized>;
  protected abstract toDomain(
    document: DocType<AggregateSerialized>
  ): Result<Aggregate>;
  protected get searchIndex() {
    return 'default';
  }

  /**
   * a generic method for infering underlying Model out of a mongoose Document
   * and intersecting it with { _id: string }
   * @link https://stackoverflow.com/questions/65897965/how-to-typescript-mongoose-toobject
   */
  docToObject = <D extends Document>(doc: D) =>
    doc.toObject() as D extends Document<infer AggregateSerialized>
      ? AggregateSerialized & { _id: ObjectId }
      : never;

  async save(object: Aggregate): Promise<Result<Aggregate>> {
    const doc = this.fromDomain(object);
    try {
      await this.repo
        .updateOne(
          {
            _id: doc._id,
          },
          doc,
          { upsert: true }
        )
        .exec();
      const updatedDoc = await this.repo.findById(doc._id);

      // @ts-ignore
      return this.toDomain(this.docToObject(updatedDoc));
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error saving document',
      });
    }
  }

  async upsert(
    uniqueFilter: FilterQuery<AggregateSerialized> & {
      id?: string;
    },
    object: Aggregate
  ): Promise<Result<Aggregate>> {
    const { _id, ...doc } = this.fromDomain(object);

    // @ts-ignore
    const filterQuery: FilterQuery<AggregateSerialized> & {
      _id: ObjectId;
      id?: string;
    } = {
      ...uniqueFilter,
      ...(uniqueFilter.id && { _id: new ObjectId(uniqueFilter.id) }),
    };

    delete filterQuery.id;

    try {
      const updatedDoc = await this.repo
        .findOneAndReplace(filterQuery, doc, {
          upsert: true,
          new: true,
        })
        .exec();
      // @ts-ignore
      return this.toDomain(this.docToObject(updatedDoc));
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error saving document',
      });
    }
  }

  async findAll(
    filterQuery: FilterQuery<AggregateSerialized>,
    pagination?: Pagination,
    sortOrder?: SortOrder<AggregateSerialized>
  ): Promise<Result<Aggregate[]>> {
    const query = this.repo.find(filterQuery);
    if (
      pagination &&
      _.isFinite(pagination.page) &&
      _.isFinite(pagination.limit)
    ) {
      const skip = pagination.page * pagination.limit;
      query.skip(skip).limit(pagination.limit);
    }
    // @ts-ignore
    sortOrder && query.sort(sortOrder);

    try {
      const docs = await query.exec();
      const values: Aggregate[] = [];

      for (const doc of docs) {
        // @ts-ignore
        const result = this.toDomain(this.docToObject(doc));
        if (result.isFailure) {
          return Result.fail<Aggregate[]>(result.error);
        }
        const value = result.getValue();
        values.push(value);
      }

      return Result.ok<Aggregate[]>(values);
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error querying for document',
      });
    }
  }

  async findById(id: string): Promise<Result<Aggregate>> {
    try {
      const doc = await this.repo.findById(id).exec();
      if (!doc) {
        return Result.fail({
          code: EnumError.DOCUMENT_NOT_FOUND,
          message: 'Document not found',
          meta: {
            id,
          },
        });
      }
      // @ts-ignore
      return this.toDomain(this.docToObject(doc));
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error querying for document',
      });
    }
  }

  async findByIds(ids: string[]): Promise<Result<Aggregate[]>> {
    try {
      const docs = await this.repo.find({
        _id: {
          $in: ids,
        },
      });
      if (!docs) return Result.ok([]);

      const result = docs.map((doc) => {
        // @ts-ignore
        const result = this.toDomain(this.docToObject(doc));
        return result.getValue();
      });

      return Result.ok<Aggregate[]>(result);
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error querying for documents',
      });
    }
  }

  async findOne(
    uniqueFilter: FilterQuery<AggregateSerialized>
  ): Promise<Result<Aggregate | null>> {
    try {
      const doc = await this.repo.findOne(uniqueFilter).exec();
      if (!doc) {
        return Result.ok(null);
      }

      // @ts-ignore
      return this.toDomain(this.docToObject(doc));
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error querying for document',
      });
    }
  }

  /**
   * This implementation making use of `search` pipeline stage is specific to Mongo Atlas.
   * !IMPORTANT Also, it's important to have a search index created in the database before we can start using search.
   * !WARNING It will throw error if used with Mongo binary distribution.
   * Be sure to test it if any implementation is changed as there's no tests written and mongodb-memory-server doesn't support search
   * https://www.mongodb.com/docs/atlas/atlas-search/text/#fuzzy-examples
   */
  async search(
    filterQuery: FilterQuery<AggregateSerialized>,
    searchQuery: SearchQuery<AggregateSerialized>,
    pagination?: Pagination,
    sortOrder?: SortOrder<AggregateSerialized>,
    options: SearchOptions = {}
  ): Promise<Result<Aggregate[]>> {
    try {
      const query = this.repo.aggregate();
      // Search is only valid as the first stage in a pipeline.
      query.search({
        index: options.index || this.searchIndex,
        compound: {
          should: Object.entries(searchQuery).map(([path, value]) => {
            return {
              autocomplete: {
                query: value,
                path: path,
                ...(options.fuzzy && {
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1,
                  },
                }),
              },
            };
          }),
          score: {
            function: {
              score: 'relevance',
            },
          }, // in order to have score based on relevancy, index must be created with String along with Autocomplete data type.
          minimumShouldMatch: 0,
        },
      });

      // Apply filter if filterQuery is provided
      if (Object.keys(filterQuery).length) {
        query.match(filterQuery);
      }

      if (
        pagination &&
        _.isFinite(pagination.page) &&
        _.isFinite(pagination.limit)
      ) {
        const skip = pagination.page * pagination.limit;
        query.skip(skip).limit(pagination.limit);
      }

      query.addFields({
        score: { $meta: 'searchScore' },
      });

      if (sortOrder && Object.keys(sortOrder).length > 0) {
        // @ts-ignore
        query.sort({
          ...sortOrder,
        });
      }

      const docs = await query.exec();
      const values: Aggregate[] = [];

      for (const doc of docs) {
        const result = this.toDomain(doc);
        if (result.isFailure) {
          return Result.fail<Aggregate[]>(result.error);
        }
        const value = result.getValue();
        values.push(value);
      }

      return Result.ok<Aggregate[]>(values);
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error searching for documents',
      });
    }
  }

  async facet(
    filterQuery: FilterQuery<AggregateSerialized>,
    facetOptions: FacetOptions<AggregateSerialized>
  ): Promise<Result<AggregateFacets<AggregateSerialized>>> {
    try {
      const aggregate = this.repo.aggregate();
      if (Object.keys(filterQuery).length) {
        aggregate.match(filterQuery);
      }
      const facetQuery: Record<string, any[]> = {};

      for (const [field, value] of Object.entries<{ count?: boolean }>(
        // @ts-ignore
        facetOptions
      )) {
        if (facetOptions.hasOwnProperty(field)) {
          facetQuery[field] = [{ $unwind: '$' + field }];
          if (value?.count) {
            facetQuery[field].push({ $sortByCount: '$' + field });
          }
        }
      }

      aggregate.facet(facetQuery);

      const rawFacets = await aggregate.exec();

      const facetsResult: any = {};

      if (rawFacets.length) {
        for (const [field, value] of Object.entries<
          [{ _id: string; count?: number }]
        >(rawFacets[0])) {
          facetsResult[field] = value.map((v) => {
            return { id: v._id, count: v.count };
          });
        }
      }
      return Result.ok(facetsResult);
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error getting facets for documents',
      });
    }
  }

  async count(
    filterQuery: FilterQuery<AggregateSerialized>
  ): Promise<Result<number>> {
    try {
      const count = await this.repo.count(filterQuery).exec();
      return Result.ok(count);
    } catch (err: any) {
      return Result.fail({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Error getting count for documents',
      });
    }
  }
}
