import { mockMediaQueryList } from 'use-media/lib/useMedia';
// Types are also exported for convienence:
// import {Effect, MediaQueryObject} from 'use-media/lib/types';

export interface MockMatchMedia {
  media: string;
  matches?: boolean;
}

function getMockImplementation({ media, matches = false }: MockMatchMedia) {
  const mql: MediaQueryList = {
    ...mockMediaQueryList,
    media,
    matches,
  };

  return () => mql;
}

export function jestMockMatchMedia({ media, matches = false }: MockMatchMedia) {
  const mockedImplementation = getMockImplementation({ media, matches });
  window.matchMedia = jest.fn().mockImplementation(mockedImplementation);
}
