/**
 * @jest-environment jsdom
 */
import Renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionBuilder from '../../builder/ActionBuilder';

const validActions = [
  {
    component: 'button',
    type: 'primary',
    name: 'edit',
    title: 'Edit',
    call: 'modal',
    method: null,
    uri: '/api/admins/:id',
  },
  {
    component: 'button',
    type: 'default',
    name: 'delete',
    title: 'Delete',
    call: 'delete',
    method: 'post',
    uri: '/api/admins/delete',
  },
];
const invalidActions = [
  {
    component: 'invalidComponent',
    type: 'primary',
    name: 'edit',
    title: 'Edit',
    call: 'modal',
    method: null,
    uri: '/api/admins/:id',
  },
];

describe('ActionBuilder', () => {
  test('snapshot test', () => {
    const dom = Renderer.create(ActionBuilder(validActions as any, () => {}) as any).toJSON();
    expect(dom).toMatchSnapshot();
  });

  test('valid params', () => {
    render(ActionBuilder(validActions as any, () => {}) as any);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Edit'));
  });

  test('invalid params', () => {
    expect(ActionBuilder(null as any, () => {})).toEqual([]);
    expect(ActionBuilder([] as any, () => {})).toEqual([]);
    expect(ActionBuilder({} as any, () => {})).toEqual([]);
    expect(ActionBuilder(undefined as any, () => {})).toEqual([]);
    expect(ActionBuilder(NaN as any, () => {})).toEqual([]);
    expect(ActionBuilder(true as any, () => {})).toEqual([]);
    expect(ActionBuilder(false as any, () => {})).toEqual([]);
    expect(ActionBuilder('' as any, () => {})).toEqual([]);
    expect(ActionBuilder(invalidActions as any, () => {})).toEqual([null]);
  });
});
