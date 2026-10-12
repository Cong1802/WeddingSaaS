import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LandingPage from './components/LandingPage';

export function render() {
  return renderToStaticMarkup(<LandingPage />);
}
