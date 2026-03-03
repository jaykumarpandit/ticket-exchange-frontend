export interface Station {
  code: string;
  name: string;
  city: string;
}

function isValidStation(obj: unknown): obj is Station {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'code' in obj &&
    'name' in obj &&
    typeof (obj as Station).code === 'string' &&
    typeof (obj as Station).name === 'string'
  );
}

function parseStationsResponse(data: unknown): Station[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isValidStation).map((s) => ({
    code: s.code,
    name: s.name,
    city: typeof s.city === 'string' ? s.city : '',
  }));
}

export interface SearchStationsResult {
  stations: Station[];
  error?: string;
}

export async function searchStations(
  query: string,
  limit = 10,
): Promise<SearchStationsResult> {
  if (!query || query.trim().length < 2) {
    return { stations: [] };
  }
  try {
    // Use Next.js API route (same origin) to avoid CORS - it proxies to the backend
    const res = await fetch(
      `/api/stations/search?q=${encodeURIComponent(query.trim())}&limit=${limit}`,
    );
    if (!res.ok) {
      return { stations: [], error: 'Search failed. Please try again.' };
    }
    const data = await res.json();
    const stations = parseStationsResponse(data);
    return { stations };
  } catch {
    return { stations: [], error: 'Search failed. Please try again.' };
  }
}
