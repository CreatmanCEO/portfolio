# Contributing

Thanks for the interest. This is a personal portfolio site, but bug reports and small PRs are welcome.

## Ground rules

- This is the live source for [creatman.site](https://creatman.site). Treat `main` as production.
- Open an issue **before** sending a non-trivial PR. Cosmetic changes that don't match my taste will likely be declined — please don't take it personally.
- Keep PRs focused. One concern per PR.

## Local setup

```bash
git clone https://github.com/CreatmanCEO/portfolio.git
cd portfolio
npm install
cp .env.example .env   # fill placeholder values for keys you don't have
npm run seed
npm run dev
```

You can leave `GROQ_API_KEY` / `CEREBRAS_API_KEY` empty — AI features will degrade gracefully.

## Before opening a PR

```bash
npm test         # Vitest
npm run lint     # ESLint
```

Type-check with your editor or `npx tsc --noEmit`.

## Commit messages

Conventional-ish prefixes preferred: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`. Imperative mood, lowercase.

## What I will not merge

- Source-code rewrites that aren't tied to a reported bug.
- Adding analytics, tracking pixels, or third-party scripts.
- License changes.
- Unrelated dependency bumps bundled with feature changes.

## Reporting security issues

Do not open a public issue. Email creatmanick@gmail.com or DM [@Creatman_it](https://t.me/Creatman_it).
