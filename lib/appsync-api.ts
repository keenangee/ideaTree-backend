import * as appsync from "aws-cdk-lib/aws-appsync";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export function createAppSyncApi(
  scope: Construct,
  id: string
): appsync.GraphqlApi {
  return new appsync.GraphqlApi(scope, id, {
    name: "idea-tree-api",
    schema: appsync.SchemaFile.fromAsset("./schema.graphql"),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: appsync.AuthorizationType.API_KEY,
        apiKeyConfig: {
          name: "idea-tree-api-key",
          expires: cdk.Expiration.after(cdk.Duration.days(365)),
        },
      },
    },
    xrayEnabled: true,
  });
}
