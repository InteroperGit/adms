import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/imageGallery';
import { imageGalleryContent } from '@/types/shared/imageGallery';
import { OrderFormProductTabs } from './OrderFormProductTabs';
import { OrderFormDynamicFields } from './OrderFormDynamicFields';
import { OrderFormCustomerFields } from './OrderFormCustomerFields';
import { OrderFormConsent } from './OrderFormConsent';
import { OrderFormSuccess } from './OrderFormSuccess';
import { YandexSmartCaptcha } from '@/components/yandex/YandexSmartCaptcha';
import type { FormFieldDefinition, OrderFormDefinition } from '@/types/config/orderForms';

interface OrderFormProps {
  definition: OrderFormDefinition;
}

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

export function OrderForm({ definition }: OrderFormProps) {
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

  const handleCaptchaSuccess = useCallback((token: string) => {
    setCaptchaToken(token);
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

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();

    if (!consent || !captchaToken || !smartCaptchaSiteKey || !orderFormApiUrl) {
      return;
    }

    const allRequired = [...(activeProduct?.fields ?? []), ...definition.customerFields].filter(
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

    try {
      const response = await fetch(orderFormApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: values,
          captchaToken,
          message: 'test',
        }),
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
    setCaptchaToken('');
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <OrderFormSuccess success={definition.success} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {definition.productTypes.length > 1 && (
          <>
            {definition.tabsLabel && (
              <p className="text-sm font-medium text-foreground">{definition.tabsLabel}</p>
            )}
            <OrderFormProductTabs
              productTypes={definition.productTypes}
              activeKey={activeProductKey}
              onChange={handleProductChange}
            />
            <hr className="border-border" />
          </>
        )}

        {activeProduct?.description && (
          <p className="text-sm text-muted-foreground">{activeProduct.description}</p>
        )}

        {activeProduct?.images && activeProduct.images.length > 0 && (
          <ImageGallery
            images={activeProduct.images}
            altPrefix={activeProduct.label}
            prevLabel={imageGalleryContent.prevLabel}
            nextLabel={imageGalleryContent.nextLabel}
            closeLabel={imageGalleryContent.closeLabel}
            counterTemplate={imageGalleryContent.counter}
          />
        )}

        {activeProduct && (
          <OrderFormDynamicFields
            fields={activeProduct.fields}
            values={Object.fromEntries(
              Object.entries(values).filter(([k]) => productFieldKeys.has(k))
            )}
            onChange={handleFieldChange}
          />
        )}

        <OrderFormCustomerFields
          fields={definition.customerFields}
          values={Object.fromEntries(
            Object.entries(values).filter(([k]) => customerFieldKeys.has(k))
          )}
          onChange={handleFieldChange}
        />

        <OrderFormConsent consent={definition.consent} checked={consent} onChange={setConsent} />

        {smartCaptchaSiteKey ? (
          <YandexSmartCaptcha
            siteKey={smartCaptchaSiteKey}
            onTokenChange={handleCaptchaSuccess}
            onTokenExpired={handleCaptchaExpired}
          />
        ) : (
          <p className="text-sm text-destructive">{definition.captchaNotConfigured}</p>
        )}

        {submitError && (
          <p className="text-sm text-destructive text-center">{definition.submitFailed}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full cursor-pointer rounded-full"
          disabled={!consent || !captchaToken || !smartCaptchaSiteKey || isSubmitting}
        >
          {isSubmitting ? definition.sending : definition.submit}
        </Button>

        <p className="text-center text-xs text-muted-foreground">{definition.disclaimer}</p>
      </form>
    </div>
  );
}
