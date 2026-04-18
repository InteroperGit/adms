import { useState, useCallback, type FormEvent } from 'react';
import { legalData, type DocumentVersion } from '@/types/config/legalData';
import type {
  FormFieldDefinition,
  OrderFormDefinition,
  OrderConsentRecord,
  OrderSubmissionPayload,
  ProductType,
} from '@/types/config/orderForms';

const legalDocByHref: Record<string, DocumentVersion | undefined> = {
  '/privacy-policy': legalData.documents.privacyPolicy,
  '/user-agreement': legalData.documents.userAgreement,
  '/consent': legalData.documents.consent,
};

function fieldDefaults(fields: FormFieldDefinition[]): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const f of fields) {
    if (f.type === 'number' && f.required && f.min !== undefined) {
      defaults[f.key] = String(f.min);
    } else if (f.type === 'radio' && f.required && f.options?.[0]) {
      defaults[f.key] = f.options[0].value;
    }
  }
  return defaults;
}

function buildConsentRecord(definition: OrderFormDefinition): OrderConsentRecord {
  return {
    acceptedAt: new Date().toISOString(),
    text: definition.consent.text,
    links: definition.consent.links.map((link) => ({
      ...link,
      ...legalDocByHref[link.href],
    })),
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    referrer: document.referrer || null,
  };
}

export interface UseOrderFormReturn {
  activeProductKey: string;
  activeProduct: ProductType | undefined;
  values: Record<string, string | boolean>;
  consent: boolean;
  captchaToken: string;
  submitted: boolean;
  isSubmitting: boolean;
  submitError: boolean;
  productFieldKeys: Set<string>;
  customerFieldKeys: Set<string>;
  smartCaptchaSiteKey: string | undefined;
  handleFieldChange: (key: string, value: string | boolean) => void;
  handleCaptchaExpired: () => void;
  handleProductChange: (key: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
  setConsent: (v: boolean) => void;
  setCaptchaToken: (v: string) => void;
}

export function useOrderForm(definition: OrderFormDefinition): UseOrderFormReturn {
  const [activeProductKey, setActiveProductKey] = useState(definition.productTypes[0].key);
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    fieldDefaults(definition.productTypes[0].fields)
  );
  const [consent, setConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const activeProduct = definition.productTypes.find((pt) => pt.key === activeProductKey);
  const productFieldKeys = new Set(activeProduct?.fields.map((f) => f.key) ?? []);
  const customerFieldKeys = new Set(definition.customerFields.map((f) => f.key));

  const smartCaptchaSiteKey = import.meta.env.VITE_SMARTCAPTCHA_SITEKEY;
  const orderFormApiUrl = import.meta.env.VITE_ORDER_FORM_API_URL;

  const handleFieldChange = useCallback((key: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCaptchaExpired = useCallback(() => {
    setCaptchaToken('');
  }, []);

  function handleProductChange(key: string) {
    setActiveProductKey(key);
    setValues((prev) => {
      const next: Record<string, string | boolean> = {};
      for (const [k, v] of Object.entries(prev)) {
        if (customerFieldKeys.has(k)) {
          next[k] = v;
        }
      }
      const product = definition.productTypes.find((pt) => pt.key === key);
      return { ...fieldDefaults(product?.fields ?? []), ...next };
    });
    setCaptchaToken('');
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!consent || !captchaToken || !smartCaptchaSiteKey || !orderFormApiUrl || !activeProduct) {
      return;
    }

    const allRequired = [...activeProduct.fields, ...definition.customerFields].filter(
      (f) => f.required
    );

    const missing = allRequired.some((f) => {
      const v = values[f.key];
      return v === undefined || v === '' || v === false;
    });

    if (missing) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(false);

    const consentRecord = buildConsentRecord(definition);

    try {
      const response = await fetch(orderFormApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: { ...values, productType: activeProductKey },
          consent: consentRecord,
          captchaToken,
        } satisfies OrderSubmissionPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setSubmitted(true);
      setValues({});
      setConsent(false);
      setCaptchaToken('');
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setSubmitError(false);
    setActiveProductKey(definition.productTypes[0].key);
    setValues(fieldDefaults(definition.productTypes[0].fields));
    setCaptchaToken('');
  }

  return {
    activeProductKey,
    activeProduct,
    values,
    consent,
    captchaToken,
    submitted,
    isSubmitting,
    submitError,
    productFieldKeys,
    customerFieldKeys,
    smartCaptchaSiteKey,
    handleFieldChange,
    handleCaptchaExpired,
    handleProductChange,
    handleSubmit,
    handleReset,
    setConsent,
    setCaptchaToken,
  };
}
