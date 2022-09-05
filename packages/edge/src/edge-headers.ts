/**
 * City of the original client IP as calculated by Vercel Proxy.
 */
export const CITY_HEADER_NAME = 'x-vercel-ip-city';
/**
 * Country of the original client IP as calculated by Vercel Proxy.
 */
export const COUNTRY_HEADER_NAME = 'x-vercel-ip-country';
/**
 * Client IP as calcualted by Vercel Proxy.
 */
export const IP_HEADER_NAME = 'x-real-ip';
/**
 * Latitude of the original client IP as calculated by Vercel Proxy.
 */
export const LATITUDE_HEADER_NAME = 'x-vercel-ip-latitude';
/**
 * Longitude of the original client IP as calculated by Vercel Proxy.
 */
export const LONGITUDE_HEADER_NAME = 'x-vercel-ip-longitude';
/**
 * Country region of the original client IP calculated by Vercel Proxy.
 *
 * See [docs](https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country-region).
 */
export const REGION_HEADER_NAME = 'x-vercel-ip-country-region';
/**
 * The request ID for each request generated by Vercel Proxy.
 */
export const REQUEST_ID_HEADER_NAME = 'x-vercel-id';

/**
 * We define a new type so this function can be reused with
 * the global `Request`, `node-fetch` and other types.
 */
interface Request {
  headers: {
    get(name: string): string | null;
  };
}

/**
 * The location information of a given request.
 */
export interface Geo {
  /** The city that the request originated from. */
  city?: string;

  /** The country that the request originated from. */
  country?: string;

  /** The [Vercel Edge Network region](https://vercel.com/docs/concepts/edge-network/regions) that received the request. */
  region?: string;

  /** The region part of the ISO 3166-2 code of the client IP.
   * See [docs](https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country-region).
   */
  countryRegion?: string;

  /** The latitude of the client. */
  latitude?: string;

  /** The longitude of the client. */
  longitude?: string;
}

function getHeader(request: Request, key: string): string | undefined {
  return request.headers.get(key) ?? undefined;
}

/**
 * Returns the IP address of the request from the headers.
 *
 * @see {@link IP_HEADER_NAME}
 * @param request The incoming request object which provides the IP
 */
export function ipAddress(request: Request): string | undefined {
  return getHeader(request, IP_HEADER_NAME);
}

/**
 * Extracts the Vercel Edge Network region name from the request ID.
 *
 * @param requestId The request ID (`x-vercel-id`).
 * @returns The first region received the client request.
 */
function getRegionFromRequestId(requestId?: string): string | undefined {
  if (!requestId) {
    return 'dev1';
  }

  // The request ID is in the format of `region::id` or `region1:region2:...::id`.
  const match = requestId.match(/^(?<region>[a-z0-9]+):/);
  return match?.groups?.region;
}

/**
 * Returns the location information for the incoming request.
 *
 * @see {@link CITY_HEADER_NAME}
 * @see {@link COUNTRY_HEADER_NAME}
 * @see {@link REGION_HEADER_NAME}
 * @see {@link LATITUDE_HEADER_NAME}
 * @see {@link LONGITUDE_HEADER_NAME}
 * @param request The incoming request object which provides the geolocation data
 */
export function geolocation(request: Request): Geo {
  return {
    city: getHeader(request, CITY_HEADER_NAME),
    country: getHeader(request, COUNTRY_HEADER_NAME),
    countryRegion: getHeader(request, REGION_HEADER_NAME),
    region: getRegionFromRequestId(getHeader(request, REQUEST_ID_HEADER_NAME)),
    latitude: getHeader(request, LATITUDE_HEADER_NAME),
    longitude: getHeader(request, LONGITUDE_HEADER_NAME),
  };
}
