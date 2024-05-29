import { IExtensionContext, ToDoType } from '../../types/IExtensionContext';
import { IState } from '../../types/api';
import {showError} from '../../util/message';

import TopModsDashlet from './TopModsDashlet';
import Dashlet from './Dashlet';
import { IToDo } from './IToDo';
import settingsReducer from './reducers';
import todos from './todos';

import { TFunction } from 'i18next';

const extTodos: IToDo[] = [];

function init(context: IExtensionContext): boolean {
  context.registerReducer(['settings', 'firststeps'], settingsReducer);

  context.registerToDo = (id: string,
                          type: ToDoType,
                          props: (state: any) => any,
                          icon: (props: any) => JSX.Element,
                          text: (t: TFunction, props: any) => JSX.Element,
                          action?: (props: any) => void,
                          condition?: (props: any) => boolean,
                          value?: (t: TFunction, props: any) => JSX.Element,
                          priority?: number) => {
    extTodos.push({ id, icon, type, props, condition, text, value, action, priority });
  };

  context.registerDashlet('ToDo List', 3, 2, 0, Dashlet, state => {
    const allTodos: IToDo[] = [].concat(todos(context.api), extTodos);
    const steps = state.settings.firststeps.steps;

    const visibleSteps = allTodos.filter(item => {
        if (steps[item.id]) {
          return false;
        }

        if (item.condition) {
          const props = item.props ? item.props(state) : {};
          return item.condition(props);
        } else {
          return true;
        }
      });
    return visibleSteps.length > 0;
  }, () => ({
    todos: [].concat(todos(context.api), extTodos),
  }), undefined);

  context.registerDashlet('Top Mods', 1, 3, 1, TopModsDashlet, (state: IState) => true, undefined, {
    fixed: false,
    closable: false,
  });

  return true;
}

export default init;
