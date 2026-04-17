export interface YMQMessageAttributes {
  [key: string]: {
    data_type: string;
    string_value?: string;
  };
}

export interface YMQMessage {
  message_id: string;
  md5_of_body: string;
  body: string;
  attributes: Record<string, string>;
  message_attributes: YMQMessageAttributes;
  md5_of_message_attributes: string;
}

export interface YMQEventMetadata {
  event_id: string;
  event_type: string;
  created_at: string;
  cloud_id: string;
  folder_id: string;
}

export interface YMQEventDetails {
  queue_id: string;
  message: YMQMessage;
}

export interface YMQRecord {
  event_metadata: YMQEventMetadata;
  details: YMQEventDetails;
}

export interface YMQEvent {
  messages: YMQRecord[];
}
