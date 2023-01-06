import { Game } from '@nativewrappers/client';

export const ChatSelf = (msg: string | string[], templateId?: string) => {
  console.log(msg);

  const _msg = Array.isArray(msg) ? msg : [msg];
  _msg.unshift(Game.Player.Name);

  emit('chat:addMessage', {
    templateId,
    args: _msg
  });
};

export const ChatAll = (msg: string | string[]) => {
  console.log(msg);

  emitNet('_chat:messageEntered', Game.Player.Name, null, Array.isArray(msg) ? msg : [msg], 'all');
};

export const Alert = (msg: string) => {
  console.info(msg);
  SetTextComponentFormat('STRING');
  AddTextComponentString(msg);
  DisplayHelpTextFromStringLabel(0, false, true, -1);
};

export const Notify = (msg: string) => {
  console.info(msg);
  SetNotificationTextEntry('STRING');
  AddTextComponentString(msg);
  DrawNotification(true, false);
};

export type SuggestionParam = { name: string; help: string };
export const addSuggestion = (commandName: string, description: string, params?: SuggestionParam[]) =>
  emit('chat:addSuggestion', `/${commandName}`, description, params);
export const removeSuggestion = (commandName: string) => emit('chat:removeSuggestion', `/${commandName}`);
