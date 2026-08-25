export type SearchableItem = {
  title: string;
  description: string;
  keywords: string;
};

const conversationalWords = /(怎么|如何|怎样|请问|麻烦|帮我|我想|可以|是否)/gu;
const searchableToken = /[a-z0-9.#+-]+|[\u3400-\u9fff]{2,}/giu;

export function tokenizeQuery(query: string): string[] {
  const normalized = query.toLowerCase().replace(conversationalWords, " ");
  return normalized.match(searchableToken) ?? [];
}

export function matchesSearch(item: SearchableItem, query: string): boolean {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return false;

  const searchableText = `${item.title} ${item.description} ${item.keywords}`.toLowerCase();
  return tokens.every((token) => searchableText.includes(token));
}
