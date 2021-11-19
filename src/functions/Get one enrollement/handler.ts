import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const get_one_enrollement: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try{

    const {id} = event.pathParameters;

    const query = {
      TableName: "SEMS",
      KeyConditionExpression: "id = :id",
      ProjectionExpression: "coursetitle, #name, dateofassignment",
      ExpressionAttributeNames: {
        "#name" : "name"
      },
      ExpressionAttributeValues: {
        ":id" : id
      }
    }

    const enrolled = await DynamoDB.getData(query);
    if(enrolled.Items.length > 0 ){
      return formatJSONResponse({
        message: "Enrollement found",
        enrollement: enrolled
      });
    }else {
      return formatJSONResponse({
        message: "Enrollement not found"
      });
    }
    

  }catch(err) {
    console.log(err);
  }
}

export const main = middyfy(get_one_enrollement);
