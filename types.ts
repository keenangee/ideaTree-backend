export type User = {
  userId: string;
  username: string;
  email: string;
  level: string;
  ideas: Idea[];
};

export type Idea = {
  id: string;
  idea: string;
  description?: string;
  createdAt: string;
};

export type QueryGetUserArgs = {
  userId: string;
};

export type MutationAddToDailyIdeaArgs = {
  userId: string;
  level: string;
  idea: IdeaInput;
};

export type IdeaInput = {
  id: string;
  idea: string;
  description?: string;
  createdAt: string;
};

export type PutInput = {
  TableName: string;
  Item: {
    userId: { S: string };
    level: { S: string };
    ideas: { L: any[] };
  };
};
