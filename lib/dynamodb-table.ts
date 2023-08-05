import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export function createDynamoDbTable(
  scope: Construct,
  id: string
): dynamodb.Table {
  return new dynamodb.Table(scope, id, {
    partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "level", type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });
}
