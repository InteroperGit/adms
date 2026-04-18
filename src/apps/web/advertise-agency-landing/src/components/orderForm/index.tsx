import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/imageGallery';
import { imageGalleryContent } from '@/types/shared/imageGallery';
import { OrderFormProductTabs } from './OrderFormProductTabs';
import { OrderFormDynamicFields } from './OrderFormDynamicFields';
import { OrderFormCustomerFields } from './OrderFormCustomerFields';
import { OrderFormConsent } from './OrderFormConsent';
import { OrderFormSuccess } from './OrderFormSuccess';
import { YandexSmartCaptcha } from '@/components/yandex/YandexSmartCaptcha';
import type { OrderFormDefinition } from '@/types/config/orderForms';
import { useOrderForm } from './useOrderForm';

interface OrderFormProps {
  definition: OrderFormDefinition;
}

export function OrderForm({ definition }: OrderFormProps) {
  const {
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
  } = useOrderForm(definition);

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      {submitted ? (
        <OrderFormSuccess success={definition.success} onReset={handleReset} />
      ) : (
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
              onTokenChange={setCaptchaToken}
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
      )}
    </div>
  );
}
