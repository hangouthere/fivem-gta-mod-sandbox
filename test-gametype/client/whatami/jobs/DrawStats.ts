import { Color, Container, Point, Screen, Size, Text } from '@nativewrappers/client';
import { WAIOptions, WAIShowState } from '../Options.js';
import { cacheInViewDist, entitiesOnScreen } from './index';

const lineHeight = 20;
const containerSize = new Size(500, 500);
const statsContainer = new Container(
  new Point(Screen.ScaledWidth - containerSize.width - 5, Screen.Height - containerSize.height - 5),
  containerSize,
  new Color(75, 0, 0, 0)
);
const statViewMode = new Text('', new Point(5, lineHeight * 0), 0.5);
const statEntitiesTotal = new Text('', new Point(5, lineHeight * 1), 0.5);
const statEntitiesOnScreen = new Text('', new Point(5, lineHeight * 2), 0.5);
statsContainer.addItem(statViewMode);
statsContainer.addItem(statEntitiesTotal);
statsContainer.addItem(statEntitiesOnScreen);
export const job_drawStats = async () => {
  statViewMode.caption =
    `[${WAIShowState[WAIOptions.showState]}] ` + `${WAIOptions.distance.min} -> ${WAIOptions.distance.max}`;
  statEntitiesTotal.caption = 'Entities in View Distance: ' + cacheInViewDist.size;
  statEntitiesOnScreen.caption = 'Entities on screen: ' + entitiesOnScreen.size;
  statsContainer.draw();
};
