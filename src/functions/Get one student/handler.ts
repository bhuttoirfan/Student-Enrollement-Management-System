import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const update_one_student: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {

    const { id } = event.pathParameters;

    const query = {
      TableName: "SEMS",
      KeyConditionExpression: "id = :id",
      ProjectionExpression: "#name, #email, #age, #dob",
      ExpressionAttributeNames: {
        "#name": 'name',
        "#email": 'email',
        "#age": 'age',
        "#dob": 'dob'
      },
      ExpressionAttributeValues: {
        ":id": id
      }
    }

    const std = await DynamoDB.getData(query);
    if (std.Items.length > 0) {
      return formatJSONResponse({
        message: "Student found",
        student: std
      });
    } else {
      return formatJSONResponse({
        message: "Student found",
        student: std
      });
    }


  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(update_one_student);
