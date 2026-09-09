# PushDocs website

The Russian landing page for [PushDocs](https://github.com/PushDocs/PushDocs), a self-hosted CMS for Docusaurus repositories in GitHub and GitLab.

Website: https://pushdocs.github.io/

## Local development

Use Node.js 20.19 or newer. There are no dependencies to install.

```sh
npm run dev
```

Open http://127.0.0.1:4173. The server binds to localhost. Set `PORT` to use another port.

```sh
npm run check
npm run build
npm run preview
```

The build copies `site/` into `dist/`. Checks validate JavaScript syntax, local assets, anchors, unique IDs and ARIA references.

## Publishing

The repository must be named `PushDocs/pushdocs.github.io`. Under Settings → Pages, select GitHub Actions as the source. Pushing `main` runs checks, builds the static files and publishes the site. Pull requests run checks and build without deploying.

The workflow follows the [GitHub Pages custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). No custom domain or CNAME file is needed.

## Content and design

Edit `site/index.html` for page content, `site/styles.css` for layout, and `site/app.js` for the interactive example. The website uses Russian copy, Golos Text for body text, and Unbounded for headings. Fonts are hosted locally, with their SIL Open Font Licenses in `site/assets/fonts/`.

The interactive editor is an illustrative demo. It supports headings, lists, bold text and inline code. It stores a draft in browser local storage, compares it with a fixed source document and shows an example review. It never connects to a Git provider or executes HTML or MDX. Reset removes the saved draft. Storage failures leave the editor usable for the current page session.

Installation commands are intended for local evaluation. Production configuration is documented in the main project. Product claims and limitations come from the main project's README.

There are no analytics, remote scripts, cookies or external font requests. Decorative artwork is SVG and CSS. Reduced motion, keyboard tabs, mobile navigation and native FAQ disclosure controls are supported.

## License

Apache-2.0. Fonts have separate SIL Open Font Licenses.
