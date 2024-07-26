<div align="center">
  A pity counter for Wuthering Waves, using the up-to-date data with global statistics and more. Share your pulls with your friends and track your account!
</div>

<div align="center">
  <a href="https://crowdin.com/project/wutheringwaves_app">
    <img src="https://badges.crowdin.net/wutheringwaves_app/localized.svg"  title="Crowdin" />
  </a>
</div>

![home.png](./.github/screenshots/home.png 'wutheringwaves.app')

## Roadmap

| Features                          | Description                          | Status      |
| --------------------------------- | ------------------------------------ | ----------- |
| Convene history                   | ...                                  | ✅          |
| Convene history > Share card      | ...                                  | ✅          |
| Convene global stats              | ...                                  | In progress |
| Cloud backup                      | ...                                  | ✅          |
| Database > Characters             | ...                                  | In progress |
| Database > Weapons                | ...                                  | In progress |
| Database > Echos                  | ...                                  | In progress |
| Database > Trophies               | ...                                  | ✅          |
| Accounts > Multiple               | Support multiple accounts            | ✅          |
| Tier list                         | ...                                  | In progress |
| Tier list > Creator               | ...                                  | In progress |
| Tier list > Creator > Live voting | Create tier list and realtime voting | None        |
| Todo list                         | ...                                  | None        |
| OCR import tool                   | Using OCR to import account data     | None        |
| Damage calculator                 | ...                                  | None        |
| Profile                           | Upload profile via screenshot        | None        |
| Profile > Share card              | Upload profile via screenshot        | None        |
| Profile > Echo                    | Upload profile via screenshot        | None        |
| Profile > Character               | Upload profile via screenshot        | None        |
| Codes                             | Giftcode page                        | ✅          |
| Interactive map                   | ...                                  | In progress |
| Trophies                          | ...                                  | ✅          |
| Timeline                          | ...                                  | ✅          |
| Functions > Global search         | Search any thing                     | In progress |
| Functions > Notifications         | Web push notification functions      | None        |

## Contributing

We'd love your help in improving the website with features, bug reports, and patches.<br/>

## Localization

We need more translators to help us translate the rest of the pages.

```
resources
```

<a href="https://crowdin.com/project/wutheringwaves_app">Crowdin </a>

## Development

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

If you're interested in the API, it's
here [https://github.com/trongtindev/wutheringwaves-app-api](https://github.com/trongtindev/wutheringwaves-app-api)

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and
disable Vetur).

### Project Setup

```sh
bun install
```

#### Compile and Hot-Reload for Development

```sh
bun run dev
```

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
bun test:unit
```

#### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
bun build

# Runs the end-to-end tests
bun test:e2e
# Runs the tests only on Chromium
bun test:e2e --project=chromium
# Runs the tests of a specific file
bun test:e2e tests/example.spec.ts
# Runs the tests in debug mode
bun test:e2e --debug
```

# License

[MIT](https://github.com/trongtindev/wutheringwaves-app/blob/main/LICENSE)

This project is not affiliated with Kuro Games.
Wuthering Waves, game content and materials are trademarks and copyrights of Kuro Games.
