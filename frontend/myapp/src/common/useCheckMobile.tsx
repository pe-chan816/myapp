import { useMedia } from 'use-media';

export const useCheckMobile = () => {
  return useMedia({ maxWidth: '450px' });
};
