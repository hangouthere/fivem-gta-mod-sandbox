import { Color, Container, Point, Screen, Size, Text } from '@nativewrappers/client';
import { WAIOptions, WAIShowState } from '../Options.js';
import { entitiesInViewDist, entitiesOnScreen } from './index';

const lineHeight = 20;
const containerSize = new Size(300, 100);
const statsContainer = new Container(
  new Point(Screen.ScaledWidth - containerSize.width - 5, Screen.Height - containerSize.height - 5),
  containerSize,
  new Color(125, 0, 0, 0)
);

// prettier-ignore
const statViewMode = new Text('', new Point(5, lineHeight * 0), 0.5, undefined, undefined, undefined, undefined, true);
// prettier-ignore
const statEntitiesTotal = new Text('', new Point(5, lineHeight * 1), 0.5, undefined, undefined, undefined, undefined, true);
// prettier-ignore
const statEntitiesOnScreen = new Text('', new Point(5, lineHeight * 2), 0.5, undefined, undefined, undefined, undefined, true);
statsContainer.addItem(statViewMode);
statsContainer.addItem(statEntitiesTotal);
statsContainer.addItem(statEntitiesOnScreen);
export const job_drawStats = async () => {
  // prettier-ignore
  statViewMode.caption = `[${WAIShowState[WAIOptions.showState]}] ${WAIOptions.distance.min} -> ${WAIOptions.distance.max}`;
  statEntitiesTotal.caption = 'Entities in View Distance: ' + entitiesInViewDist.size;
  statEntitiesOnScreen.caption = 'Entities on screen: ' + entitiesOnScreen.size;
  statsContainer.draw();
};
