import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/ui/imageGallery';
import { imageGalleryContent } from '@/types/shared/imageGallery';
import { OrderFormProductTabs } from './OrderFormProductTabs';
import { OrderFormDynamicFields } from './OrderFormDynamicFields';
import { OrderFormCustomerFields } from './OrderFormCustomerFields';
import { OrderFormConsent } from './OrderFormConsent';
import { OrderFormSuccess } from './OrderFormSuccess';
import type { FormFieldDefinition, OrderFormDefinition } from '@/types/config/orderForms';

interface OrderFormProps {
  definition: OrderFormDefinition;
}

/**
 * @component
 * @description Complete multi-step order form with product tabs, dynamic fields, customer info, consent and success state
 * @param {OrderFormProps} props
 * @param {OrderFormDefinition} props.definition - Form configuration with products, fields, labels, etc.
 * @returns {JSX.Element} Form wrapper or success message
 * @example
 * <OrderForm definition={orderFormDefinition} />
 */
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
  const [submitted, setSubmitted] = useState(false);

  const activeProduct = definition.productTypes.find((pt) => pt.key === activeProductKey);
  const productFieldKeys = new Set(activeProduct?.fields.map((f) => f.key) ?? []);
  const customerFieldKeys = new Set(definition.customerFields.map((f) => f.key));

  const handleFieldChange = useCallback((key: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
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
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!consent) {
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

    setSubmitted(true);
    setValues({});
    setConsent(false);
  }

  function handleReset() {
    setSubmitted(false);
    setActiveProductKey(definition.productTypes[0].key);
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

        <Button
          type="submit"
          size="lg"
          className="w-full cursor-pointer rounded-full"
          disabled={!consent}
        >
          {definition.submit}
        </Button>

        <p className="text-center text-xs text-muted-foreground">{definition.disclaimer}</p>
      </form>
    </div>
  );
}
