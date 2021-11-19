import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const get_list_of_students: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {

    let students = [{}];

    const query = {
      TableName: "SEMS"
    }

    const whole_data = await DynamoDB.scanWholeData(query);

    whole_data.Items.map(cur => {
      
      if(cur.email !== undefined) {
        let name = cur.name;
        let email = cur.email;
        let age = cur.age;
        let dob = cur.dob;

        students.push(
          {
            name,
            email,
            age,
            dob
          }
        );
        
      }
    });

    return formatJSONResponse({
      message: "List of students",
      students
    });


  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(get_list_of_students);
