import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { MessagePayload, saveMessage } from '../models/message.model';
import { getOrCreateUser } from '../models/user.model';
import { addMessageToThread } from '../services/openai.service';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
        console.log('{!} Function HANDLER:', JSON.stringify(event));
        const method = event.requestContext.http.method;

        const pathParts = event.rawPath.split('/').filter(part => part.length);
        let route;
        if (pathParts.length) {
            route = pathParts[0];
        }
        console.log('{!} Function METHOD:', method, '{!} Function ROUTE:', route);

        // Get bot
        switch (route) {
            case 'start':
                if (!event.body) {
                    return {
                        statusCode: 400,
                        body: 'Insufficient data',
                    };
                }
                const startPayload = JSON.parse(event.body!) as { name: string; email: string };
                const name = startPayload.name.trim();
                const email = startPayload.email.toLowerCase().trim();
                // get or create user
                const dbUser: any = await getOrCreateUser(name, email);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ thread_id: dbUser.thread_id, user_id: dbUser.id }),
                };
            case 'ask':
                if (!event.body) {
                    return {
                        statusCode: 400,
                        body: 'Insufficient data',
                    };
                }
                const body = JSON.parse(event.body!) as MessagePayload;
                console.log('[1] ASK BODY:', body);
                if (!body.text || !body.thread_id || !body.user_id) {
                    return {
                        statusCode: 400,
                        body: 'Insufficient data',
                    };
                }
                try {
                    await saveMessage(body.user_id, body.thread_id, 'user', body.text);
                } catch (error) {
                    console.error(error);
                }
                console.log('=============+!+=====================');
                const response = await addMessageToThread(body.thread_id, body.text);
                console.log('[2] BOT RESPONSE:', response);
                try {
                    // Save message to the database
                    await saveMessage(body.user_id, body.thread_id, 'bot', response);
                } catch (error) {
                    console.error(error);
                }

                return {
                    statusCode: 200,
                    body: JSON.stringify({ response }),
                };
        }
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: '',
        };
    } catch (error: any) {
        console.log('ERROR:', error);
        console.error(error);
        return {
            statusCode: 400,
            body: JSON.stringify(error.message || error),
        };
    }
};
