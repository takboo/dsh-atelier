# Project instructions

- Before changing runtime integration, packaging, tests or screenshots, read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for module ownership and the verified host contract.
- Edit `src/`; regenerate the tracked `client.js` with `npm run build`. Keep the DSH module id equal to the package name and the host entry free of browser code.
- Keep theme writes, outside takeover and restoration inside the theme controller. DSH owns text, code and terminal typography; preserve those settings across theme changes.
- Register UI contributions through `ctx.slots.inject` and bind resources to the plugin lifecycle. Test teardown as well as activation.
- Test the built client against the pinned official theme runtime. For UI or CSS changes, run the browser check and inspect regenerated screenshots when they change.
- Keep README.md as the product entry; put maintainer details in docs/DEVELOPMENT.md. Keep screenshot generation and verification scope in docs/DEVELOPMENT.md; write README for product users.
- Before changing release automation or market metadata, read [docs/RELEASING.md](docs/RELEASING.md). Keep npm and Release artifacts byte-identical.
- Finish changes with `npm run check` and `npm pack --dry-run`. Report unavailable checks and actual-host acceptance separately from automated results.
