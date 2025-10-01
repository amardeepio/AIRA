export class ChatDto {
  message: string;
  history: { role: 'user' | 'model'; parts: { text: string }[] }[];
}
