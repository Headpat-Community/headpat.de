import { Client, Databases, Account } from 'appwrite';

export const client = new Client();
export const account = new Account(client);
export const databases = new Databases(client);

client
  .setEndpoint(`${process.env.NEXT_PUBLIC_API_URL}/v1`)
  .setProject(`${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`)

export { ID } from 'appwrite';
