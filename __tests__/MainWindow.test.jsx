jest.mock('../src/util/ExtensionProvider');

import { MainWindow } from '../src/views/MainWindow';
import React from 'react';
import { shallow } from 'enzyme';
import { findAll, findWithType, findWithClass } from 'react-shallow-testutils';

import { Label, Modal } from 'react-bootstrap';

function renderMainWindow() {
  function dummyT(input) {
    return input;
  }

  const api = { events: { on: () => undefined } };

  return shallow(<MainWindow objects={[]} t={ dummyT } api={api}/>);
}

it('has no modals', () => {
  let win = renderMainWindow();
  let modals = findAll(win, (ele) => (ele !== null) && (ele.type === Modal));

  // expecting only the Dialog Modal
  expect(modals.length).toBe(0);
});
