/**
 * FIELD — the light inside a field that follows the pointer on hover: the field's
 * full state, an add-on to its minimal one (field.css; design/components/form-field.md).
 * Marks each field .has-light; inside [data-interaction="minimal"] the light stays off.
 * Safe to call again.
 *
 *   import { fieldLights } from './field.js';
 *   fieldLights();                          // every .ctl
 *   fieldLights('.hs-form .hs-input');      // a vendor's fields, with an adapter
 */
import { followPointer } from './pointer.js';

/** @param {string} [selector] */
export function fieldLights(selector = '.ctl') {
  document.querySelectorAll(selector).forEach((el) => { el.classList.add('has-light'); followPointer(el); });
}
