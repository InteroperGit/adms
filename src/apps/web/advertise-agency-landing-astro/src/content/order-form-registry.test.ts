// Specialized forms resolve only exact allowlisted ownership tuples.
import { expect, it } from 'vitest';
import {
  GENERAL_ORDER_FORM_ID, getOrderFormRegistration, isRegisteredFormId,
  isValidOrderFormTuple,
} from './order-form-registry';

it.each([
  ['project', 'led-letters', '#led-letters'],
  ['service', 'svetovye-bukvy', '/services/svetovye-bukvy/#led-letters'],
] as const)('resolves %s registration with optional form id',
  (context, category, href) => {
    for (const formId of [undefined, null, '', 'led-letters']) {
      expect(getOrderFormRegistration(context, category, formId)).toEqual({
        formId: 'led-letters', category, context, href,
        label: 'Request a lettering estimate',
      });
    }
    expect(isValidOrderFormTuple(context, category, 'led-letters')).toBe(true);
    expect(getOrderFormRegistration(context, category, 'unknown'))
      .toBeUndefined();
  },
);

it('rejects missing, unknown and mismatched categories', () => {
  for (const category of [undefined, null, '', 'unknown', 'svetovye-bukvy']) {
    expect(getOrderFormRegistration('project', category)).toBeUndefined();
  }
  expect(isRegisteredFormId('led-letters')).toBe(true);
  expect(isRegisteredFormId('unknown')).toBe(false);
  expect(isRegisteredFormId(GENERAL_ORDER_FORM_ID)).toBe(false);
  expect(isValidOrderFormTuple('project', undefined, 'unknown')).toBe(false);
  expect(GENERAL_ORDER_FORM_ID).toBe('general-inquiry');
  expect(isValidOrderFormTuple('service', undefined, GENERAL_ORDER_FORM_ID))
    .toBe(true);
});
