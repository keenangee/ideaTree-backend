import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { createAppSyncApi } from "./appsync-api";
import { createDynamoDbTable } from "./dynamodb-table";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = createAppSyncApi(this, "ideaTreeApi");

    // const table = createDynamoDbTable(this, "ideaTreeTable");

    const getUserLambda = new lambda.Function(this, "getUserHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/getUser")),
      handler: "index.handler",
    });

    const getUserDataSource = api.addLambdaDataSource(
      "getUserDataSource",
      getUserLambda
    );

    getUserDataSource.createResolver("ideaTreeApi", {
      typeName: "Query",
      fieldName: "getUser",
    });
  }
}
