import OpenAI from 'openai';
import { MessageCreateParams } from 'openai/resources/beta/threads/messages';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function createThread() {
    const thread = await openai.beta.threads.create();
    return thread.id;
}

export async function addMessageToThread(threadId: string, content: string) {
    if (!content || !content.length) {
        throw new Error('No content to send');
    }
    // console.log('Preparing context...');
    // const context = await prepareContext(bot, content);
    const msg: MessageCreateParams = {
        role: 'user',
        content: content,
    };
    // + context && context.length ? '\n\n Additional Context (do not use it if not needed): ' + context : ''
    console.log('=====================================');
    console.log('MESSAGE:', msg, 'Content length:', content.length);
    console.log('=====================================');
    await openai.beta.threads.messages.create(threadId, msg);

    // Run operation
    await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });

    const messages = await openai.beta.threads.messages.list(threadId);
    const message: any = messages.data[0];
    const messageContent: any = message.content[0];
    const responseText = messageContent.text.value;
    const clearedResponse = responseText.replace(/【.*?】/g, '');
    return clearedResponse;
}
