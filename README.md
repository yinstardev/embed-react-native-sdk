## React Native Embed SDK Example

**The `@thoughtspot/react-native-embed-sdk` provides a way for embedding ThoughtSpot Liveboards into your React Native applications.**

### Expo Snack

**This is a code example demonstrating how to embed ThoughtSpot Liveboards using the `@thoughtspot/react-native-embed-sdk`. Check out the live demo in the Expo Snack environment by clicking the link below, and experiment with the code!**

You can play around with the code in Expo Snack:
[Expo Snack Link](https://snack.expo.dev/@git/github.com/thoughtspot/developer-examples:mobile/react-native-embed-sdk)

### Installation

Add the SDK to your project using your preferred package manager:

*   **npm:**
    ```bash
    npm install @thoughtspot/react-native-embed-sdk
    ```
*   **yarn:**
    ```bash
    yarn add @thoughtspot/react-native-embed-sdk
    ```
*   **pnpm:**
    ```bash
    pnpm add @thoughtspot/react-native-embed-sdk
    ```

### Quick Start

Here's how to embed a Liveboard in your React Native app:

1.  **Initialize the SDK:** Call the `init` function once, typically in your app's entry point.

    ```javascript
    import { init, AuthType } from '@thoughtspot/react-native-embed-sdk';

    init({
      // Replace with your ThoughtSpot instance URL
      thoughtSpotHost: 'your-ts-host',
      // Specify the authentication type (TrustedAuthTokenCookieless is common)
      authType: AuthType.TrustedAuthTokenCookieless,
      // Provide an async function that returns a valid auth token
      getAuthToken: async () => {
        // Replace this with your actual token fetching logic
        return "YOUR_AUTH_TOKEN";
      }
    });
    ```

2.  **Embed the Liveboard Component:** Use the `LiveboardEmbed` component where you want the Liveboard to appear.

    ```javascript
    import React from 'react';
    import { LiveboardEmbed } from '@thoughtspot/react-native-embed-sdk';

    export default function App() {
      return (
          <LiveboardEmbed
            // Replace with the ID of the Liveboard you want to embed
            liveboardId="your-liveboard-id"
          />
      );
    }
    ```

### Additional Resources

*   **npm Package:** [https://www.npmjs.com/package/@thoughtspot/react-native-embed-sdk](https://www.npmjs.com/package/@thoughtspot/react-native-embed-sdk)
*   **GitHub Repository:** [https://github.com/thoughtspot/react-native-mobile-sdk](https://github.com/thoughtspot/react-native-mobile-sdk)
*   **ThoughtSpot Developer Documentation:** [https://developers.thoughtspot.com/](https://developers.thoughtspot.com/)
