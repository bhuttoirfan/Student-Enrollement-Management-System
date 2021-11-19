import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import { v4 } from "uuid";
import schema from './schema';

const add_enrollement: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {

    const data = event.body;
    const c_id = event.body.courseid;
    let flag: boolean = false;

    const check_course = {
      TableName: "SEMS",
      FilterExpression: "courseid = :cid",
      ExpressionAttributeValues: {
        ":cid": c_id
      }
    }

    const course = await DynamoDB.scanWholeData(check_course);
    
    course.Items.map(cur => {
      if(cur.courseid === c_id) {
        flag = true;
      }
    });

    if (flag) {
      return formatJSONResponse({
        message: "enrollement already exits"
      });
    } else {
      const id = v4();
      const query = {
        TableName: "SEMS",
        Item: {
          id,
          ...data
        }
      }
      await DynamoDB.SaveData(query);

      return formatJSONResponse({
        message: "New enrollement created"
      });
    }
  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(add_enrollement);
