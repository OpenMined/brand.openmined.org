/**
 * FIELD — the light inside a field that follows the pointer on hover
 * (field.css; design/components/form-field.md). Safe to call again.
 *
 *   import { fieldLights } from './field.js';
 *   fieldLights();                          // every .ctl
 *   fieldLights('.hs-form .hs-input');      // a vendor's fields, with an adapter
 */
import { followPointer } from './pointer.js';

/** @param {string} [selector] */
export function fieldLights(selector = '.ctl') {
  document.querySelectorAll(selector).forEach(followPointer);
}
