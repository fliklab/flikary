# Node 24 workflow migration blocker

The application and Vercel runtime use Node 24, but two GitHub Actions workflows still pin Node 18:

- `.github/workflows/performance.yml`: `NODE_VERSION: "18"`
- `.github/workflows/optimize-images.yml`: `node-version: "18"`

Required change: update both pins to `24`.

## Why this PR does not modify the workflow files

The current GitHub OAuth token has `gist`, `read:org`, and `repo` scopes, but no `workflow` scope. GitHub rejected a tested two-file commit with:

```text
refusing to allow an OAuth App to create or update workflow
.github/workflows/optimize-images.yml without workflow scope
```

An administrator or token with `workflow` scope must apply the two exact changes. Tracking issue: #10.
