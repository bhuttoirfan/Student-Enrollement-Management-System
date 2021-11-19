import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const get_list_of_courses: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{
    let courses= [{}];

    const query = {
      TableName: "SEMS"
    }

    const whole_data = await DynamoDB.scanWholeData(query);

    whole_data.Items.map(cur => {
      
      if(cur.coursecode !== undefined) {
        let courseid = cur.courseid;
        let coursename = cur.coursetitle;
        let coursech = cur.CH;

        courses.push({
          courseid,
          coursename,
          coursech
        });
      }
    });

    return formatJSONResponse({
      message: "List of enrollements",
      courses
    });

  }catch(err) {
    console.log(err);
  }
}

export const main = middyfy(get_list_of_courses);
