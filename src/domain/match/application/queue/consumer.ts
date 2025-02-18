export interface ConsumerParams {
  messagesCount?: number
}

export abstract class Consumer {
  abstract getMessage(params: ConsumerParams): Promise<string>
}
