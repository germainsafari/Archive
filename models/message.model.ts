import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
export interface MessagePayload {
    thread_id: string;
    user_id: string;
    text: string;
}

export interface Message {
    id: string;
    thread_id: string;
    user_id: string;
    role: string;
    text: string;
    created_at?: String;
}

export const MessageSchema = dynamoose.model('mura-messages', {
    id: {
        type: String,
        hashKey: true,
    },
    user_id: {
        type: String,
        index: true,
    },
    thread_id: {
        type: String,
    },
    role: {
        type: String,
    },
    text: {
        type: String,
    },
    created_at: {
        type: String,
    },
});

export async function saveMessage(userId: string, threadId: string, role: string, text: string) {
    const message = {
        id: uuidv4(),
        user_id: userId,
        thread_id: threadId,
        role,
        text,
        created_at: new Date().toISOString(),
    };
    await MessageSchema.create(message);
}
