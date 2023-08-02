import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export function createDynamoDbTable(
  scope: Construct,
  id: string
): dynamodb.Table {
  return new dynamodb.Table(scope, id, {
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "createdAt", type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });
}
