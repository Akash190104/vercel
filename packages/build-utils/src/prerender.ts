import { File } from './types';
import { Lambda } from './lambda';

interface PrerenderOptions {
  expiration: number | false;
  lambda: Lambda;
  fallback: File | null;
  group?: number;
  bypassToken?: string | null /* optional to be non-breaking change */;
  allowQuery?: string[];
  initialHeaders?: Record<string, string>;
  initialStatus?: number;
}

export class Prerender {
  public type: 'Prerender';
  public expiration: number | false;
  public lambda: Lambda;
  public fallback: File | null;
  public group?: number;
  public bypassToken: string | null;
  public allowQuery?: string[];
  public initialHeaders?: Record<string, string>;
  public initialStatus?: number;

  constructor({
    expiration,
    lambda,
    fallback,
    group,
    bypassToken,
    allowQuery,
    initialHeaders,
    initialStatus,
  }: PrerenderOptions) {
    this.type = 'Prerender';
    this.expiration = expiration;
    this.lambda = lambda;

    if (
      typeof group !== 'undefined' &&
      (group <= 0 || !Number.isInteger(group))
    ) {
      throw new Error(
        'The `group` argument for `Prerender` needs to be a natural number.'
      );
    }
    this.group = group;

    if (bypassToken == null) {
      this.bypassToken = null;
    } else if (typeof bypassToken === 'string') {
      if (bypassToken.length < 32) {
        // Enforce 128 bits of entropy for safety reasons (UUIDv4 size)
        throw new Error(
          'The `bypassToken` argument for `Prerender` must be 32 characters or more.'
        );
      }
      this.bypassToken = bypassToken;
    } else {
      throw new Error(
        'The `bypassToken` argument for `Prerender` must be a `string`.'
      );
    }

    if (typeof fallback === 'undefined') {
      throw new Error(
        'The `fallback` argument for `Prerender` needs to be a `FileBlob`, `FileFsRef`, `FileRef`, or null.'
      );
    }
    this.fallback = fallback;

    if (initialHeaders !== undefined) {
      if (
        !initialHeaders ||
        typeof initialHeaders !== 'object' ||
        Object.entries(initialHeaders).some(
          ([key, value]) =>
            typeof key !== 'string' || value !== 'string'
        )
      ) {
        throw new Error(
          `The \`initialHeaders\` argument for \`Prerender\` must be an object with string key/values`
        );
      }
      this.initialHeaders = initialHeaders;
    }

    if (initialStatus !== undefined) {
      if (initialStatus <= 0 || !Number.isInteger(initialStatus)) {
        throw new Error(
          `The \`initialStatus\` argument for \`Prerender\` must be a natural number.`
        );
      }
      this.initialStatus = initialStatus;
    }

    if (allowQuery !== undefined) {
      if (!Array.isArray(allowQuery)) {
        throw new Error(
          'The `allowQuery` argument for `Prerender` must be Array.'
        );
      }
      if (!allowQuery.every(q => typeof q === 'string')) {
        throw new Error(
          'The `allowQuery` argument for `Prerender` must be Array of strings.'
        );
      }
      this.allowQuery = allowQuery;
    }
  }
}
