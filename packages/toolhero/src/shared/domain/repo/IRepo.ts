import { Result } from "../../core/Result";
import { ObjectId } from "mongodb";

export enum EnumError {
  INSERTION_ERROR = "INSERTION_ERROR",
  DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND",
}

export type DocType<Type> = Type & { _id: ObjectId };

export type FindQuery<Type> = {
  [Property in keyof Type]?:
    | Type[Property]
    | {
        $in?: Type[Property] | string[];
      }
    | {
        $gte?: Type[Property];
      }
    | {
        $lte?: Type[Property];
      }
    | {
        $gt?: Type[Property];
      }
    | {
        $lt?: Type[Property];
      }
    | {
        $ne?: Type[Property] | null | undefined;
      };
};

export type FindQueryWithCustomKey<Type> = FindQuery<Type> & {
  [key in string]?: any;
};

export type OR<Type> = {
  $or: FindQueryWithCustomKey<Type>[];
};

export type AND<Type> = {
  $and: FindQueryWithCustomKey<Type>[];
};

export type FilterQuery<Type> =
  | FindQueryWithCustomKey<Type>
  | OR<Type>
  | AND<Type>;

export type SearchQuery<Type> = {
  [Property in keyof Type]?: string; // property: querystring
};

export type Pagination = {
  page: number;
  limit: number;
};

export enum SortDirection {
  ASC = 1,
  DESC = -1,
}
export type SortOrder<Type> =
  | {
      [Property in keyof Type]?: SortDirection;
    }
  | { [key in string]?: SortDirection };

export type SearchOptions = {
  fuzzy?: boolean;
  index?: string;
};

export type IFacet = {
  id: string;
  count: number;
  type?: "selection" | "range";
};

export type AggregateFacets<AggregateSerialised> = {
  [prop in keyof AggregateSerialised]?: IFacet[];
};

export type FacetOptions<AggregateSerialised> = {
  [prop in keyof AggregateSerialised]?: {
    count?: boolean;
  };
};

export interface IRepo<Aggregate, AggregateSerialised> {
  findAll(
    filterQuery: FilterQuery<AggregateSerialised>,
    pagination?: Pagination,
    sortOrder?: SortOrder<AggregateSerialised>
  ): Promise<Result<Aggregate[]>>;

  findById(id: string): Promise<Result<Aggregate>>;

  findOne(
    uniqueFilter: FilterQuery<AggregateSerialised>
  ): Promise<Result<Aggregate>>;
  /**
   * save or replace the document matching _id field.
   * !Important if there's an existing document then it will overwrite it with new object.
   */
  save(object: Aggregate): Promise<Result<Aggregate>>;

  /**
   * save or update the document matching uniqueFilter query.
   * It's important that uniqueFilter must be provided with any unique field of the aggregate
   * to avoid unintended update on random doc.
   * !Important if there's an existing document then it will overwrite it with new object.
   * Use save() if both object IDs are same otherwise object.id will be ignored when replacing.
   */
  upsert(
    uniqueFilter: FilterQuery<AggregateSerialised> & {
      id?: string;
    },
    object: Aggregate
  ): Promise<Result<Aggregate>>;

  findByIds(ids: string[]): Promise<Result<Aggregate[]>>;

  search(
    filterQuery: FilterQuery<AggregateSerialised>,
    searchQuery: SearchQuery<AggregateSerialised>,
    pagination?: Pagination,
    sortOrder?: SortOrder<AggregateSerialised>,
    options?: SearchOptions
  ): Promise<Result<Aggregate[]>>;

  facet(
    filterQuery: FilterQuery<AggregateSerialised>,
    facetOptions: FacetOptions<AggregateSerialised>
  ): Promise<Result<AggregateFacets<AggregateSerialised>>>;

  count(filterQuery: FilterQuery<AggregateSerialised>): Promise<Result<number>>;
}
