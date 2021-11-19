import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const get_list_of_enrollements: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    let enrollements = [{}];

    const query = {
      TableName: "SEMS"
    }

    const whole_data = await DynamoDB.scanWholeData(query);

    whole_data.Items.map(cur => {
      
      if(cur.courseid !== undefined) {
        let coursetitle = cur.coursetitle;
        let name = cur.name;
        let date_of_enrollment = cur.dateofassignment;

        enrollements.push({
          coursetitle,
          name,
          date_of_enrollment
        });
      }
    });


    return formatJSONResponse({
      message: "List of enrollements",
      enrollements
    });
  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(get_list_of_enrollements);
