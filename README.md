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
