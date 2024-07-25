'use server';

import { updateCoffeeStore } from '@/lib/airtable';

type State = {
  id: string;
  voting: number;
};

export const upvoteAction = async (prevState: State): Promise<State> => {
  const { id } = prevState;
  const data = await updateCoffeeStore(id);

  if (data) {
    return {
      id,
      voting: data.length > 0 ? data[0].voting : 0,
    };
  } else {
    return prevState;
  }
};