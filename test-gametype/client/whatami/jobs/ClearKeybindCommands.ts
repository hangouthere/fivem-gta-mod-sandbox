import { removeSuggestion } from '../../utils/Messaging.js';

export const job_clearKeybindCommands = () => {
  setTimeout(() => {
    [
      '-wai_view_type_left',
      '-wai_view_type_right',
      '-wai_viewdist_min_inc',
      '-wai_viewdist_min_dec',
      '-wai_viewdist_max_inc',
      '-wai_viewdist_max_dec',
      '-wai_viewdist_inc_inc',
      '-wai_viewdist_inc_dec',
      '-wai_settings_reset'
    ].forEach(removeSuggestion);
  }, 1000);
};
