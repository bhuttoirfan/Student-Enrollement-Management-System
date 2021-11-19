import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { DynamoDB } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const update_one_enrollement: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {

    const { id } = event.pathParameters;
    const c_id = event.body.courseid;
    const s_id = event.body.studentid;
    const doa = event.body.dateofassigment;

    // Query for getting enrolement so that we can check if it already exists in the database so that it is
    // not to update
    const query2 = {
      TableName: "SEMS",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }

    const enrolled = await DynamoDB.getData(query2);

    if (enrolled.Items.length > 0) {
      const query = {
        TableName: "SEMS",
        Key: { id: id },
        UpdateExpression: "set courseid= :cid, studentid= :sid,  dateofassigment = :doa",
        ExpressionAttributeValues: {
          ":cid": c_id,
          ":sid": s_id,
          ":doa": doa
        }
      }

      await DynamoDB.updateData(query);

      return formatJSONResponse({
        message: "enrollement updated"
      });
    } else {
      return formatJSONResponse({
        message: "Enrollement not Found"
      });
    }

  } catch (err) {
    console.log(err);
  }
}

export const main = middyfy(update_one_enrollement);
