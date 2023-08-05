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

    const table = createDynamoDbTable(this, "ideaTreeTable");

    const getUserLambda = new lambda.Function(this, "getUserHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 1024,
      code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/getUser")),
      handler: "index.handler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadData(getUserLambda);

    const getUserDataSource = api.addLambdaDataSource(
      "getUserDataSource",
      getUserLambda
    );

    getUserDataSource.createResolver("getUserResolver", {
      typeName: "Query",
      fieldName: "getUser",
    });

    const addIdeaLambda = new lambda.Function(this, "addIdeaHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 1024,
      code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/addIdea")),
      handler: "index.handler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(addIdeaLambda);

    const addIdeaDataSource = api.addLambdaDataSource(
      "addIdeaDataSource",
      addIdeaLambda
    );

    addIdeaDataSource.createResolver("addIdeaResolver", {
      typeName: "Mutation",
      fieldName: "addIdea",
    });
  }
}
