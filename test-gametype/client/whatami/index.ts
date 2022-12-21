import { addSuggestion, Chat, removeSuggestion } from '../utils/Messaging.js';
import { StartJobs, StopJobs } from './Jobs.js';
import {
  adjustViewDistance,
  changeViewDistanceIncrementer,
  resetOptions,
  rotateShowState,
  WAIOptions
} from './Options.js';

export let IsActive: Boolean = false;

export const Register = async () => {
  IsActive = true;

  RegisterCommand('whatami_vdi', changeViewDistanceIncrementer, false);
  addSuggestion('whatami_vdi', 'Set the View Distance incrementer.', [
    {
      name: 'Increment Value',
      help: 'The View Distance Incrementer. Default is 5.'
    }
  ]);

  // Rotate Entities Left/Right
  RegisterCommand('-wai_view_type_left', () => rotateShowState(false), false);
  RegisterCommand('-wai_view_type_right', () => rotateShowState(true), false);
  RegisterKeyMapping('-wai_view_type_left', 'Rotate Entity Types Left', 'keyboard', 'LBRACKET');
  RegisterKeyMapping('-wai_view_type_right', 'Rotate Entity Types Right', 'keyboard', 'RBRACKET');

  // View Distance Min Up/Down
  RegisterCommand('-wai_viewdist_min_inc', () => adjustViewDistance(WAIOptions.distance.incrementer, false), false);
  RegisterCommand('-wai_viewdist_min_dec', () => adjustViewDistance(-WAIOptions.distance.incrementer, false), false);
  RegisterKeyMapping('-wai_viewdist_min_inc', 'Increment Inner View Distance', 'keyboard', 'NUMPAD7');
  RegisterKeyMapping('-wai_viewdist_min_dec', 'Decrement Inner View Distance', 'keyboard', 'NUMPAD1');
  // View Distance Max Up/Down
  RegisterCommand('-wai_viewdist_max_inc', () => adjustViewDistance(WAIOptions.distance.incrementer, true), false);
  RegisterCommand('-wai_viewdist_max_dec', () => adjustViewDistance(-WAIOptions.distance.incrementer, true), false);
  RegisterKeyMapping('-wai_viewdist_max_inc', 'Increment Outer View Distance', 'keyboard', 'NUMPAD9');
  RegisterKeyMapping('-wai_viewdist_max_dec', 'Decrement Outer View Distance', 'keyboard', 'NUMPAD3');
  // View Distance Incrementer Up/Down
  RegisterCommand('-wai_viewdist_inc_inc', () => changeViewDistanceIncrementer(1), false);
  RegisterCommand('-wai_viewdist_inc_dec', () => changeViewDistanceIncrementer(-1), false);
  RegisterKeyMapping('-wai_viewdist_inc_inc', 'Increment View Distance Incrementer', 'keyboard', 'NUMPAD8');
  RegisterKeyMapping('-wai_viewdist_inc_dec', 'Decrement View Distance Incrementer', 'keyboard', 'NUMPAD2');
  // View Distance Settings Reset
  RegisterCommand('-wai_settings_reset', resetOptions, false);
  RegisterKeyMapping('-wai_settings_reset', 'Reset [WhatAmI] Settings to Defaults', 'keyboard', 'NUMPAD5');

  StartJobs();

  Chat('--------------------------------------');
  Chat('[WhatAmI] Enabled!');
  Chat("  Be sure you've set up the keybinds for this Resource or you won't have much use out of it!");
};

export const Unregister = () => {
  StopJobs();

  IsActive = false;

  removeSuggestion('whatami_vdi');
  Chat('[WhatAmI] Disabled');
};
