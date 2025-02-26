import { ChatList, RenderErrorMessage, RenderMessage } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import {
  agentSelectors,
  chatSelectors,
  useSessionChatInit,
  useSessionStore,
} from '@/store/session';
import { ChatMessage } from '@/types/chatMessage';
import { ErrorType } from '@/types/fetch';
import { isFunctionMessage } from '@/utils/message';

import InvalidAccess from './Error/InvalidAccess';
import OpenAiBizError from './Error/OpenAiBizError';
import MessageExtra from './MessageExtra';
import FunctionCall from './Plugins/FunctionCall';
import PluginMessage from './Plugins/PluginMessage';
import SkeletonList from './SkeletonList';

const renderErrorMessage: RenderErrorMessage = (error, message) => {
  switch (error.type as ErrorType) {
    case 'InvalidAccessCode': {
      return <InvalidAccess id={message.id} />;
    }
    case 'OpenAIBizError': {
      return <OpenAiBizError content={(error as any).body} id={message.id} />;
    }
  }
};

const List = () => {
  const init = useSessionChatInit();
  const { t } = useTranslation('common');

  const data = useSessionStore(chatSelectors.currentChatsWithGuideMessage, isEqual);

  const [displayMode, chatLoadingId, deleteMessage, resendMessage, dispatchMessage] =
    useSessionStore((s) => [
      agentSelectors.currentAgentConfig(s).displayMode,
      s.chatLoadingId,
      s.deleteMessage,
      s.resendMessage,
      s.dispatchMessage,
    ]);

  const renderMessage: RenderMessage = useCallback(
    (content, message: ChatMessage) => {
      if (message.role === 'function')
        return (
          <Flexbox gap={12}>
            <FunctionCall
              content={message.content}
              function_call={message.function_call}
              loading={message.id === chatLoadingId}
            />
            <PluginMessage loading={message.id === chatLoadingId} {...message} />
          </Flexbox>
        );

      if (message.role === 'assistant') {
        return isFunctionMessage(message.content) || !!message.function_call ? (
          <FunctionCall
            content={message.content}
            function_call={message.function_call}
            loading={message.id === chatLoadingId}
          />
        ) : (
          content
        );
      }

      return content;
    },
    [chatLoadingId],
  );

  return !init ? (
    <SkeletonList />
  ) : (
    <ChatList
      data={data}
      loadingId={chatLoadingId}
      onActionClick={(key, id) => {
        switch (key) {
          case 'delete': {
            deleteMessage(id);
            break;
          }

          case 'regenerate': {
            resendMessage(id);
            break;
          }
        }
      }}
      onMessageChange={(id, content) => {
        dispatchMessage({ id, key: 'content', type: 'updateMessage', value: content });
      }}
      renderErrorMessage={renderErrorMessage}
      renderMessage={renderMessage}
      renderMessageExtra={MessageExtra}
      style={{ marginTop: 24 }}
      text={{
        cancel: t('cancel'),
        confirm: t('ok'),
        copy: t('copy'),
        copySuccess: t('copySuccess'),
        delete: t('delete'),
        edit: t('edit'),
        regenerate: t('regenerate'),
      }}
      type={displayMode}
    />
  );
};

export default memo(List);
