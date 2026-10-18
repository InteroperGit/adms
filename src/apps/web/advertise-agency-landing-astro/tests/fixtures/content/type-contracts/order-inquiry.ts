// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/order-inquiry';

export const value = {
  title: 'TEST_TITLE',
  subtitle: 'TEST_SUBTITLE',
  requiredNote: 'TEST_REQUIREDNOTE',
  privacyLabel: 'TEST_PRIVACYLABEL',
  submitLabel: 'TEST_SUBMITLABEL',
  consent: {
    approved: false,
    label: 'TEST_LABEL',
  },
  submission: {
    enabled: false,
    endpoint: '',
    timeoutMs: 1000,
  },
  fields: {
    name: {
      label: 'TEST_LABEL',
      hint: 'TEST_HINT',
      required: true,
      maxLength: 1,
    },
    email: {
      label: 'TEST_LABEL',
      hint: 'TEST_HINT',
      required: true,
      maxLength: 1,
    },
    phone: {
      label: 'TEST_LABEL',
      hint: 'TEST_HINT',
      required: false,
      maxLength: 1,
    },
    message: {
      label: 'TEST_LABEL',
      hint: 'TEST_HINT',
      required: true,
      maxLength: 1,
    },
  },
  feedback: {
    unavailable: 'TEST_UNAVAILABLE',
    noJavaScript: 'TEST_NOJAVASCRIPT',
    invalid: 'TEST_INVALID',
    sending: 'TEST_SENDING',
    success: 'TEST_SUCCESS',
    failure: 'TEST_FAILURE',
    required: 'TEST_REQUIRED',
    email: 'test@example.com',
    tooLong: 'TEST_TOOLONG',
  },
} satisfies Domain.OrderInquiryContent;

export const wrongRequired = {
  ...value.fields.name,
  // @ts-expect-error The name field cannot become optional.
  required: false,
} satisfies Domain.OrderInquiryContent['fields']['name'];

export const InquiryField = value.fields.name satisfies Domain.InquiryField;

export const invalid = {
  ...value,
  // @ts-expect-error consent must retain its domain type.
  consent: false,
} satisfies Domain.OrderInquiryContent;
