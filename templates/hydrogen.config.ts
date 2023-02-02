import {defineConfig, CookieSessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {
    defaultCountryCode: 'US',
    defaultLanguageCode: 'EN',
    storeDomain:
      import.meta.env.PUBLIC_STORE_DOMAIN || 'hydrogen-preview.myshopify.com',
    storefrontToken:
      import.meta.env.PUBLIC_STOREFRONT_API_TOKEN ||
      '3b580e70970c4528da70c98e097c2fa0',
    privateStorefrontToken: import.meta.env.PRIVATE_STOREFRONT_API_TOKEN,
    storefrontApiVersion: '2022-07',
    storefrontId: import.meta.env.PUBLIC_STOREFRONT_ID,
  },
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
