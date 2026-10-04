# Releasing

Releases use `bun release <version>`. The command validates the package, bumps the version, refreshes the lockfile, publishes npm under the `alpha` tag, creates a Conventional Commit/tag, and creates a GitHub prerelease.

```sh
npm login
export GITHUB_TOKEN="$(gh auth token)"
bun release 0.1.0-alpha.1
unset GITHUB_TOKEN
```

Keep authentication outside the repository. npm may require a browser confirmation or OTP. Never commit `.npmrc`, tokens or payment credentials. Do not publish with `latest` while the package is experimental.

Before releasing, run the example's iOS and Android native builds against the packed package, record their actual outcomes and review the complete archive. The automated package check rejects caches, private workspace paths, missing generated files and oversized archives. Do not mark untested wallet or lifecycle paths as accepted.

For future automated npm releases, configure an npm trusted publisher for this repository's `release.yml` workflow. The workflow uses GitHub OIDC and contains no npm token. The initial package must exist and that trust relationship must be configured before using it. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
