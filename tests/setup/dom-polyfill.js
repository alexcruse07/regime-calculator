/**
 * DOM Polyfill for Node Environment
 * Provides a minimal DOM implementation for testing DOM manipulation
 */

import { JSDOM } from 'jsdom';

// Create a minimal DOM for testing
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

// Expose DOM to global scope
/* eslint-disable no-undef */
global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
/* eslint-enable no-undef */
