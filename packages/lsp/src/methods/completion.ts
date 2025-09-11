import type { RequestMessage } from '../types';
import { cache } from '../utils/cache';

type CompletionItem = {
  label: string;
  kind: number;
};

interface CompletionList {
  isIncomplete: boolean;
  items: CompletionItem[];
}

export const completion = async (_: RequestMessage): Promise<CompletionList> => {
  const items = cache.get('classnames') ?? [];

  return {
    isIncomplete: false,
    items: items.map(i => ({
      label: i,
      kind: 6,
    }))
  };
};
