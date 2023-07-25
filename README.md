# A SmartApp for the Samsung SmartThings Starter Kit.

This example Lambda SmartApp demonstrates the use of SmartThings APIs via the [SmartApp NodeJS SDK](https://github.com/SmartThingsCommunity/smartapp-sdk-nodejs) to achieve an Automation.

It showcases:

- App installation and configuration flow.
- Integrating with a third-party API (OpenWeather).
- Actuating devices using the SmartThings API.
- Creating schedules and handling scheduled executions.

## Setup instructions

### Prerequisites

- A [Samsung account](https://account.samsung.com/membership/index.do) and the SmartThings mobile application.
- A [Developer Workspace](https://smartthings.developer.samsung.com/workspace/) account.
- A SmartThings compatible color bulb, such as SYLVANIA Smart RGBW, LIFX, or Phillips Hue.

#### If testing locally (using provided webserver)
- [Node.js](https://nodejs.org) and [npm](https://npmjs.com) installed (verified with npm version 6.14.8 and Node 12.19.0).
- [ngrok](https://ngrok.com/) installed to create a secure tunnel and create a globally available URL for fast testing.

### Start

This smartapp is a simple web server that can be used to run and test locally. 

Clone or download this repository and follow the desired option.

#### Local

1. Install the dependencies for this app: `npm install`.

1. Start the server: `npm start`.

1. Start ngrok (in another terminal window/tab): `ngrok http 3005`. Copy the `https:` URL to your clipboard.

### Register

Follow the instructions for [registering a SmartApp](https://smartthings.developer.samsung.com/docs/smartapps/app-registration.html) with the SmartThings platform.

- The following OAuth2 scopes are required.
	- `r:devices:*`
	- `x:devices:*`

#### Local Only

A `CONFIRMATION request` log should show in the log output of the local server once registered. Navigate to this link to [verify your domain ownership](https://smartthings.developer.samsung.com/docs/smartapps/webhook-apps.html#Verify-your-domain-ownership) and enable the app to receive events. **This is required for successful installation.**

### Test

Follow the instructions for [testing a SmartApp](https://smartthings.developer.samsung.com/docs/testing/how-to-test.html).

## Troubleshooting

### Local

- When installing the SmartApp in the SmartThings mobile app, if you get an error **Something went wrong. Please try to install the SmartApp again**, then it is possible that you did not navigate to the confirmation link as specified above. If this is the case, then in the npm server terminal you will also see an error. Make sure you navigate to the URL sent with the `CONFIRMATION request` to the npm server. This can be resent by navigating to Developer Workspace `Overview` and clicking `Verify App Registration`.

## Documentation

- Documentation for developing SmartApps can be found on the [SmartThings developer portal](https://smartthings.developer.samsung.com/develop/guides/smartapps/basics.html).
- [SmartThings API reference documentation](https://smartthings.developer.samsung.com/develop/api-ref/st-api.html)
- [SmartApp API reference documentation](https://smartthings.developer.samsung.com/docs/api-ref/smartapps-v1.html)

## Credits

The concept of a SmartThings-connected smart app is a variation of another SmartApp setting color of a light based on the weather.

- [A SmartThings-connected color bulb](https://github.com/SmartThingsCommunity/weather-color-light-smartapp-nodejs)

