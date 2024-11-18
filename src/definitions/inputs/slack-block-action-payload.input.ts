export interface SlackBlockActionPayloadInputType {
  type: string;
  team: {
    id: string;
    domain: string;
  };
  user: {
    id: string;
    name: string;
    team_id: string;
  };
  api_app_id: string;
  token: string;
  container: {
    type: string;
    message_ts: string;
    attachment_id: number;
    channel_id: string;
    is_ephemeral: boolean;
    is_app_unfurl: boolean;
  };
  trigger_id: string;
  channel: {
    id: string;
    name: string;
  };
  message: {
    bot_id: string;
    type: string;
    text: string;
  };
  response_url: string;
  actions: {
    action_id: string;
    block_id: string;
    name: string;
    text: {
      type: string;
      text: string;
      emoji: boolean;
    };
    value: string;
    type: string;
    action_ts: string;
  }[];
}
