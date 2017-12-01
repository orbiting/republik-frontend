# Republik Frontend (alpha)

This is the repo of the digital magazine [Republik](https://www.republik.ch/en) that will launch in 2018.

## Usage

### Quick start

You need to have node (8.4.0+) installed.

Bootstrap your .env file:
```
PORT=3010
API_URL=http://localhost:3020/graphql
API_WS_URL=ws://localhost:3020/graphql
```

This frontend needs an API, provided by [republik-backend](https://github.com/orbiting/republik-backend), running on the same TLD (for cookie sharing).

Install and run:
```
npm install
npm run dev
```

### Testing

Run a test locally:
```
npm run tape components/Me/index.test.js
```

Run all tests:
```
npm run test
```

### Pledge

An online magazine is financed by people pledging to pay for it's content. And if a crowd forms around a maginze it becomes crowdfunded. Crowdfundings have a dedicated name in the backend. You can configure the currently active one via the environment. You can only point the front end at one crowdfunding at a time.

```
CROWDFUNDING_NAME=LAUNCH
```

Additionally you can configure a second `SALES_UP` crowdfunding. This can be used while the main crowdfunding is inactive but you still wish to sell something.

```
SALES_UP=PRESALE
```

#### Payment

Payment provider configuration can be passed in via the environment. `PUBLIC_BASE_URL` is used for PostFinance and PayPal return urls.

```
PUBLIC_BASE_URL=https://example.com

STRIPE_PUBLISHABLE_KEY=

PF_PSPID=
PF_FORM_ACTION=https://e-payment.postfinance.ch/ncol/test/orderstandard.asp

PAYPAL_FORM_ACTION=https://www.sandbox.paypal.com/cgi-bin/webscr
PAYPAL_BUSINESS=
PAYPAL_DONATE_LINK=
```

#### Email

Configure at which email address you're available for general questions, investor relations and payment issues:

```
EMAIL_CONTACT=contact@example.com
EMAIL_IR=ir@example.com
EMAIL_PAYMENT=payment@example.com
```

### Piwik

You can enable tracking by setting a base url and site id:

```
PIWIK_URL_BASE=https://piwik.example.com
PIWIK_SITE_ID=1
```

### Theming

Your logo, fonts and colors? See [orbiting/styleguide](https://github.com/orbiting/styleguide#theming)

## License

The source code is «BSD 3-clause» licensed.
