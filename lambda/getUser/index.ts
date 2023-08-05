import { AppSyncResolverHandler } from "aws-lambda";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

import { User, Idea, QueryGetUserArgs } from "../../types";

const mapIdeas = (items?: { L?: any[] }) => {
  if (!items || !items.L) return [];

  return items.L.map((item) => {
    return {
      id: item.M?.id.S!,
      idea: item.M?.idea.S!,
      description: item.M?.description?.S,
      createdAt: item.M?.createdAt.S!,
    } as Idea;
  });
};

const config = {
  region: process.env.AWS_REGION || "eu-west-2",
};
const client = new DynamoDBClient(config);

export const handler: AppSyncResolverHandler<
  QueryGetUserArgs,
  User | null
> = async (event) => {
  const userId = event.arguments?.userId;
  const input = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      userId: { S: userId },
      level: { S: "now" },
    },
  };
  try {
    const command = new GetItemCommand(input);
    const data = await client.send(command);

    if (!data.Item) {
      return null;
    }

    const user: User = {
      userId: data.Item.userId.S!,
      level: "now",
      username: data.Item.username.S!,
      email: data.Item.email.S!,
      ideas: mapIdeas(data.Item.ideas),
    };

    return user as User;
  } catch (error) {
    console.error(error);
    return null;
  }
};
