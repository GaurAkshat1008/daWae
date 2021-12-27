import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      })
    );
  };

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    // console.log('allfields:', allFields);

    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    let hasMore = true;
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isInCache;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });
    return {
      __typename: "PaginatedPosts",
      hasMore: hasMore,
      posts: results,
    };
  };
};
//   const visited = new Set();
//   let result: NullArray<string> = [];
//   let prevOffset: number | null = null;

//   for (let i = 0; i < size; i++) {
//     const { fieldKey, arguments: args } = fieldInfos[i];
//     if (args === null || !compareArgs(fieldArgs, args)) {
//       continue;
//     }

//     const links = cache.resolve(entityKey, fieldKey) as string[];
//     const currentOffset = args[cursorArgument];

//     if (
//       links === null ||
//       links.length === 0 ||
//       typeof currentOffset !== 'number'
//     ) {
//       continue;
//     }

//     const tempResult: NullArray<string> = [];

//     for (let j = 0; j < links.length; j++) {
//       const link = links[j];
//       if (visited.has(link)) continue;
//       tempResult.push(link);
//       visited.add(link);
//     }

//     if (
//       (!prevOffset || currentOffset > prevOffset) ===
//       (mergeMode === 'after')
//     ) {
//       result = [...result, ...tempResult];
//     } else {
//       result = [...tempResult, ...result];
//     }

//     prevOffset = currentOffset;
//   }

//   const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
//   if (hasCurrentPage) {
//     return result;
//   } else if (!(info as any).store.schema) {
//     return undefined;
//   } else {
//     info.partial = true;
//     return result;
//   }

export const createURQLClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          createPost: (_result, args, cache, info) => {
            // cache.invalidate('Query', 'posts', {
            //     limit: 15,
            // })
            const allfields = cache.inspectFields("Query");
            const fieldInfos = allfields.filter(
              (info) => info.fieldName === "posts"
            );
            fieldInfos.forEach((fi) => {
              cache.invalidate("Query", "posts", fi.arguments || {});
            });
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
