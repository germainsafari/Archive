{
    "name": "bots-function",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "deploy": "lambda-build upload mura-bot -e functions/mura-bot.function.ts -r eu-central-1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "@aws-sdk/client-dynamodb": "^3.609.0",
        "aws-lambda": "^1.0.7",
        "dynamoose": "^4.0.2",
        "openai": "^4.71.1",
        "uuid": "^10.0.0"
    },
    "devDependencies": {
        "@aws-sdk/client-codedeploy": "^3.600.0",
        "@aws-sdk/client-lambda": "^3.600.0",
        "@types/aws-lambda": "^8.10.140",
        "@types/node": "^20.14.8",
        "@types/node-fetch": "^2.6.11",
        "@types/uuid": "^10.0.0",
        "@typescript-eslint/eslint-plugin": "^7.14.1",
        "@typescript-eslint/parser": "^7.14.1",
        "dotenv-flow": "^4.1.0",
        "esbuild": "^0.21.5",
        "esbuild-register": "^3.5.0",
        "eslint": "^8.57.0",
        "eslint-config-google": "^0.14.0",
        "eslint-config-prettier": "^9.1.0",
        "eslint-plugin-import": "^2.29.1",
        "eslint-plugin-prettier": "^5.1.3",
        "hyper-express": "^6.16.4",
        "jest": "^29.7.0",
        "lambda-build": "^1.0.6",
        "mock-aws-s3": "^4.0.2",
        "nock": "^13.5.4",
        "prettier": "^3.3.2",
        "ts-node": "^10.9.2",
        "tsconfig-paths": "^4.2.0",
        "tsx": "^4.15.7",
        "typescript": "^5.5.2"
    }
}