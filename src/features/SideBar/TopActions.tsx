import { ActionIcon } from '@lobehub/ui';
import { MessageSquare, Sticker } from 'lucide-react';
import Router from 'next/router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { GlobalStore } from '@/store/global';

export interface TopActionProps {
  setTab: GlobalStore['switchSideBar'];
  tab: GlobalStore['sidebarKey'];
}

const TopActions = memo<TopActionProps>(({ tab, setTab }) => {
  const { t } = useTranslation('common');

  return (
    <>
      <ActionIcon
        active={tab === 'chat'}
        icon={MessageSquare}
        onClick={() => {
          // 如果已经在 chat 路径下了，那么就不用再跳转了
          if (Router.asPath.startsWith('/chat')) return;

          Router.push('/chat');
        }}
        size="large"
        title={t('tab.chat')}
      />
      <ActionIcon
        active={tab === 'market'}
        icon={Sticker}
        onClick={() => setTab('market')}
        size="large"
        title={t('tab.market')}
      />
    </>
  );
});

export default TopActions;
