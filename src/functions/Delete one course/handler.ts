import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const dlt_one_course: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {

    const { id } = event.pathParameters;

    const query = {
      TableName: "SEMS",
      KeyConditionExpression: "id = :id",
      ProjectionExpression: "courseid, coursetitle, CH",
      ExpressionAttributeValues: {
        ":id": id
      }
    }

    const query2 = {
      TableName: 'SEMS',
      Key: {
        id: id
      }
    }

    const course = await DynamoDB.getData(query);

    if (course.Items.length > 0) {
      await DynamoDB.deleteData(query2);

      return formatJSONResponse({
        message: "Course deleted"
      });
    } else {
      return formatJSONResponse({
        message: "Course not found"
      });
    }

  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(dlt_one_course);
