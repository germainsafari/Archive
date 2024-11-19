import * as dynamoose from 'dynamoose';
import { createThread } from 'services/openai.service';
import { v4 as uuidv4 } from 'uuid';

export interface User {
    id: string;
    name: string;
    email: string;
    thread_id: string;
    last_active_at?: string;
    created_at?: string;
}

export const UserSchema = dynamoose.model('mura-users', {
    id: {
        type: String,
        hashKey: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        index: true,
    },
    thread_id: {
        type: String,
    },
    last_active_at: {
        type: String,
    },
    created_at: {
        type: String,
    },
});

export async function getUserByEmail(email: string) {
    const user = (await UserSchema.query('email').eq(email).exec()).toJSON()[0] as User;
    return user;
}

export async function getOrCreateUser(name: string, email: string) {
    console.log('{->} GET OR CREATE USER:', name, email);
    // 1. Get User by email
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        console.log('{->} EXISTING USER:', existingUser);
        return existingUser;
    }
    // 2. Create User
    const threadId = await createThread();
    const newUser = {
        id: uuidv4(),
        thread_id: threadId,
        name,
        email,
        last_active_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
    };
    await UserSchema.create(newUser);
    console.log('{->} NEW USER:', newUser);
    return newUser;
}

export async function updateUserActivity(userId: string) {
    await UserSchema.update({ id: userId, last_active_at: new Date().toISOString() });
}
