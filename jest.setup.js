// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { act } from 'react';
global.act = act;

global.crypto = {
  randomUUID: () => 'mocked-uuid'
};
