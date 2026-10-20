# Temporary file cleanup

Use the cleanup commands from the project root. Commands without `apply` only
show the paths that would be removed.

| Command                        | Behavior                                       |
| ------------------------------ | ---------------------------------------------- |
| `pnpm clean:temp`              | Preview standard generated targets.            |
| `pnpm clean:temp:apply`        | Remove standard generated targets.             |
| `pnpm clean:temp:output`       | Preview standard targets and all of `output/`. |
| `pnpm clean:temp:output:apply` | Remove standard targets and all of `output/`.  |

Standard targets are `.astro/`, `.playwright-cli/`, `coverage/` and `dist/`. The
broader output commands remove all of `output/`, including saved logs,
Playwright screenshots and verification evidence. Review the preview before
running the corresponding `apply` command.

The script refuses a symbolic link as the project root and skips target paths
that are symbolic links. It ignores missing paths and reports each target. It
does not accept arbitrary paths, so cleanup stays within its fixed list.

Dependencies and local caches (`node_modules/`, `.pnpm-store/` and
`.npm-cache/`), runtime content, fixtures, source files and user data are not
cleanup targets. Remove those separately only when their purpose is understood.

Run the focused safety checks with `pnpm test:clean-temp`.
