import React from 'react';
import renderer from 'react-test-renderer';
import  CustomTooltip from '../CustomTooltip';

it('renders correctly', () => {
  const tree = renderer.create(<CustomTooltip />).toJSON();
  expect(tree).toMatchSnapshot();
});