import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const dlt_one_student: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {

    const { id } = event.pathParameters;

    const query = {
      TableName: "SEMS",
      Key: { id }
    }

    const query2 = {
      TableName: "SEMS",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }

    const course = await DynamoDB.getData(query2);

    if (course.Items.length > 0) {
      await DynamoDB.deleteData(query);

      return formatJSONResponse({
        message: "Student deleted"
      });
    } else {
      return formatJSONResponse({
        message: "Student not found"
      });
    }



  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(dlt_one_student);
