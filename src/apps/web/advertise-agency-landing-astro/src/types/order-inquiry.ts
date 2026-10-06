export interface InquiryField {
  label: string;
  hint: string;
  required: boolean;
  maxLength: number;
}

export interface OrderInquiryContent {
  title: string;
  subtitle: string;
  requiredNote: string;
  privacyLabel: string;
  submitLabel: string;
  consent: { approved: boolean; label: string };
  submission: { enabled: boolean; endpoint: string; timeoutMs: number };
  fields: {
    name: InquiryField & { required: true };
    email: InquiryField & { required: true };
    phone: InquiryField & { required: false };
    message: InquiryField & { required: true };
  };
  feedback: {
    unavailable: string;
    noJavaScript: string;
    invalid: string;
    sending: string;
    success: string;
    failure: string;
    required: string;
    email: string;
    tooLong: string;
  };
}
