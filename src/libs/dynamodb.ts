import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000"
});

export const DynamoDB = {

    async SaveData(params) {
        await dynamodb.put(params).promise();
    },
    
    async getData(params) {
       const data = await dynamodb.query(params).promise();
       return data;
    },

    async deleteData(params) {
        await dynamodb.delete(params).promise();
    },

    async scanWholeData(params) {
        const data = await dynamodb.scan(params).promise();
        return data;
    },
    async updateData(params) {
        await dynamodb.update(params).promise();
    }
}