import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import {v4} from "uuid";
import schema from './schema';

const add_course: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    const data = event.body;
    const c_code = event.body.coursecode;
    let flag: boolean = false;

    const query = {
      TableName: "SEMS",
      FilterExpression: "coursecode = :cc",
      ExpressionAttributeValues: {
        ":cc" : c_code
      }
    }

    const course = await DynamoDB.scanWholeData(query);

    course.Items.map(cur => {
      if(cur.coursecode === c_code) {
        flag = true;
      }
    });


    if(flag) {
      return formatJSONResponse({
        message: "This course already exits"
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
        message: "New course created"
      });
    }
  }catch(err) {
    console.log(err);
  }
}

export const main = middyfy(add_course);
