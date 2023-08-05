import { AppSyncResolverHandler } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { MutationAddToDailyIdeaArgs, Idea, PutInput } from "../../types";

const config = {
  region: process.env.AWS_REGION || "eu-west-2",
};
const client = new DynamoDBClient(config);

export const handler: AppSyncResolverHandler<
  MutationAddToDailyIdeaArgs,
  Idea | null
> = async (event) => {
  const userId = event.arguments?.userId;
  const level = event.arguments?.level;
  const idea = event.arguments?.idea;

  const input = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      userId: { S: userId },
      level: { S: level },
    },
  };

  try {
    const command = new GetItemCommand(input);
    const data = await client.send(command);

    if (!data.Item) {
      console.error("No user found");
      return null;
    }

    const ideas = data.Item.ideas.L || [];

    const newIdeas = [
      ...ideas,
      {
        M: {
          id: { S: idea.id },
          idea: { S: idea.idea },
          description: { S: idea.description || "" },
          createdAt: { S: new Date().toISOString() },
        },
      },
    ];

    const putInput = {
      TableName: process.env.TABLE_NAME!,
      Item: {
        userId: { S: userId },
        level: { S: level },
        email: { S: data.Item.email.S! },
        username: { S: data.Item.username.S! },
        ideas: { L: newIdeas },
      },
    } as PutInput;

    const putCommand = new PutItemCommand(putInput);
    await client.send(putCommand);

    return idea;
  } catch (error) {
    console.error("error", error);
    return null;
  }
};
