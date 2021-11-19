import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const update_one_course: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const c_code = event.body.coursecode;
    const c_title = event.body.coursetitle;
    const ch = event.body.CH;

    const query = {
      TableName: "SEMS",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }
    
    // Query for getting user so that we can check if course is stored
    // if yes only then to update 
    // if its length is greater than zero it means course exists and you can update
    const course = await DynamoDB.getData(query);

    if (course.Items.length > 0) {
      const query2 = {
        TableName: "SEMS",
        Key: { id },
        UpdateExpression: "set coursecode= :cc, coursetitle= :ct,  CH = :ch",
        ExpressionAttributeValues: {
          ":cc": c_code,
          ":ct": c_title,
          ":ch": ch
        }
      }

      await DynamoDB.updateData(query2);

      return formatJSONResponse({
        message: "course updated"
      });
    } else {
      return formatJSONResponse({
        message: "Course not Found"
      });
    }

  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(update_one_course);
