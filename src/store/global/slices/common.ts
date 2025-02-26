import { produce } from 'immer';
import { merge } from 'lodash-es';
import type { StateCreator } from 'zustand/vanilla';

import { setNamespace } from '@/utils/storeDebug';

import type { GlobalPreference, GlobalState, Guide, SidebarTabKey } from '../initialState';
import type { GlobalStore } from '../store';

const t = setNamespace('settings');

/**
 * 设置操作
 */
export interface CommonAction {
  /**
   * 切换侧边栏选项
   * @param key - 选中的侧边栏选项
   */
  switchSideBar: (key: SidebarTabKey) => void;
  toggleChatSideBar: (visible?: boolean) => void;
  updateGuideState: (guide: Partial<Guide>) => void;
  updatePreference: (preference: Partial<GlobalPreference>, action?: string) => void;
}

export const createCommonSlice: StateCreator<
  GlobalStore,
  [['zustand/devtools', never]],
  [],
  CommonAction
> = (set, get) => ({
  switchSideBar: (key) => {
    set({ sidebarKey: key }, false, t('switchSideBar', key));
  },
  toggleChatSideBar: (newValue) => {
    const showChatSideBar =
      typeof newValue === 'boolean' ? newValue : !get().preference.showChatSideBar;

    get().updatePreference({ showChatSideBar }, t('toggleAgentPanel', newValue) as string);
  },
  updateGuideState: (guide) => {
    const { updatePreference } = get();
    const nextGuide = merge({}, get().preference.guide, guide);
    updatePreference({ guide: nextGuide });
  },

  updatePreference: (preference, action) => {
    set(
      produce((draft: GlobalState) => {
        draft.preference = merge({}, draft.preference, preference);
      }),
      false,
      action,
    );
  },
});
