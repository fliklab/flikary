# Agent Instructions

This repository uses `.local/README.md` as the source of truth for task tracking and task document structure.

## Task Rules

- Manage active work under `.local/active/{issue-name}/`.
- Use a short English `kebab-case` name for `{issue-name}`.
- Create and maintain these files for each task:
  - `plan.md`
  - `task.md`
  - `log/NN-*.log.md`
- Move completed tasks from `.local/active/{issue-name}/` to `.local/done/{issue-name}/`.

## References

- Repository workflow: `.local/README.md`
- Project introduction: `.local/introduce.human.md`
