import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const update_one_student: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {

    const { id } = event.pathParameters;
    const name = event.body.name;
    const email = event.body.email;
    const dob = event.body.dob;
    const age = event.body.age;
    
    const query2 = {
      TableName: "SEMS",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }

    const course = await DynamoDB.getData(query2);

    if (course.Items.length > 0) {
      const query = {
        TableName: "SEMS",
        Key: { id: id },
        UpdateExpression: "set #name= :n, email= :e,  dob = :dob, age = :a",
        ExpressionAttributeNames: {
          "#name": "name"
        },
        ExpressionAttributeValues: {
          ":n": name,
          ":e": email,
          ":a": age,
          ":dob": dob
        }
      }

      await DynamoDB.updateData(query);

      return formatJSONResponse({
        message: "student updated"
      });
    }
    else {
      return formatJSONResponse({
        message: "Student not Found"
      });
    }

  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(update_one_student);
