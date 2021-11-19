import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import {v4} from 'uuid';

import schema from './schema';

const save_student: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    let flag: boolean = false;
    const data = event.body;
    const email = event.body.email;

    const query = {
      TableName: "SEMS",
      FilterExpression: "email = :em",
      ExpressionAttributeValues: {
        ":em" : email
      }
    }

    const student = await DynamoDB.scanWholeData(query);

    student.Items.map(cur => {
      if(cur.email === email) {
        flag = true;
      }
    });

    if(flag) {
      return formatJSONResponse({
        message: "This student already exits"
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
        message: "New Student created"
      });
    }

  }catch(err) {
    console.log(err);
  }
}

export const main = middyfy(save_student);
