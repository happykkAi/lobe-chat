import { EditableMessage, FormGroup, TokenTag } from '@lobehub/ui';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { encode } from 'gpt-tokenizer';
import { Bot } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { FORM_STYLE } from '@/const/layoutTokens';
import { ModelTokens } from '@/const/modelTokens';
import { AgentAction } from '@/store/session/slices/agentConfig';
import { LobeAgentConfig } from '@/types/session';

export const useStyles = createStyles(({ css, token }) => ({
  markdown: css`
    border: unset;
  `,
  textarea: css`
    background: ${token.colorFillTertiary};
  `,
}));

export interface AgentPromptProps {
  config: LobeAgentConfig;
  updateConfig: AgentAction['updateAgentConfig'];
}

const AgentPrompt = memo<AgentPromptProps>(({ config, updateConfig }) => {
  const { t } = useTranslation('setting');
  const { styles } = useStyles();
  const [editing, setEditing] = useState(false);
  const { systemRole, model } = config;
  const systemTokenCount = useMemo(() => encode(systemRole || '').length, [systemRole]);

  return (
    <FormGroup
      extra={
        <Flexbox align={'center'} gap={8} horizontal>
          <TokenTag
            displayMode={'used'}
            maxValue={ModelTokens[model]}
            shape={'square'}
            text={{
              overload: t('tokenTag.overload', { ns: 'common' }),
              remained: t('tokenTag.remained', { ns: 'common' }),
              used: t('tokenTag.used', { ns: 'common' }),
            }}
            value={systemTokenCount}
          />
        </Flexbox>
      }
      icon={Bot}
      style={FORM_STYLE.style}
      title={t('settingAgent.prompt.title')}
    >
      <Flexbox gap={16} paddingBlock={16}>
        <EditableMessage
          classNames={styles}
          editButtonSize={'small'}
          editing={editing}
          height={'auto'}
          inputType={'ghost'}
          onChange={(e) => {
            updateConfig({ systemRole: e });
          }}
          onEditingChange={setEditing}
          placeholder={t('settingAgent.prompt.placeholder')}
          showEditWhenEmpty
          text={{
            cancel: t('cancel', { ns: 'common' }),
            confirm: t('ok', { ns: 'common' }),
          }}
          value={systemRole}
        />
        {!editing && !!systemRole && (
          <Flexbox direction={'horizontal-reverse'}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              size={'small'}
              type={'primary'}
            >
              {t('edit', { ns: 'common' })}
            </Button>
          </Flexbox>
        )}
      </Flexbox>
    </FormGroup>
  );
});

export default AgentPrompt;
