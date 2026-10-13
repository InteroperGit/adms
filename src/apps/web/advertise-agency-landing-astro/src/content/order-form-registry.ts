import type { ProjectCategory } from './project-categories';

/** Only explicitly registered categories may select a specialized form. */
export type OrderFormContext = 'project' | 'service';

export interface OrderFormRegistration {
  formId: string;
  category: string;
  context: OrderFormContext;
  href: string;
  label: string;
}

const registrations = [
  {
    formId: 'led-letters',
    category: 'led-letters',
    context: 'project',
    href: '#led-letters',
    label: 'Request a lettering estimate',
  },
  {
    formId: 'led-letters',
    category: 'svetovye-bukvy',
    context: 'service',
    href: '/services/svetovye-bukvy/#led-letters',
    label: 'Request a lettering estimate',
  },
] as const satisfies readonly OrderFormRegistration[];

export type RegisteredFormId = typeof registrations[number]['formId'];
export const GENERAL_ORDER_FORM_ID = 'general-inquiry';

/** Resolve only a matching context, category, and registered form id. */
export function getOrderFormRegistration(
  context: OrderFormContext,
  category: ProjectCategory | string | null | undefined,
  formId?: string | null,
): OrderFormRegistration | undefined {
  if (!category) return undefined;

  return registrations.find((registration) =>
    registration.context === context &&
    registration.category === category &&
    (!formId || registration.formId === formId));
}

/** Resolve a stable form id without trusting an authored category value. */
export function isRegisteredFormId(
  formId: string,
): boolean {
  return registrations.some((registration) =>
    registration.formId === formId);
}

/** Validate specialized form references as an exact allowlisted tuple. */
export function isValidOrderFormTuple(
  context: OrderFormContext,
  category: string | undefined,
  formId: string,
): boolean {
  if (formId === GENERAL_ORDER_FORM_ID) return true;
  return Boolean(getOrderFormRegistration(context, category, formId));
}
