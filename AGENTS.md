# Agent Instructions

## Git Operations Safety Rule

### Critical: No Automatic Commits or Pushes

**NEVER** perform the following git operations without explicit user consent:

- `git add .` - Only stage files when explicitly requested
- `git commit` - Only commit when user explicitly asks to "commit" or "save changes"
- `git push` - Only push when user explicitly asks to "push" or "deploy"

### Required Workflow

1. **Make Changes**: Implement requested features/fixes
2. **Show Changes**: Explain what was modified
3. **Wait for Approval**: Ask user if they want to commit and push
4. **Get Explicit Consent**: Only proceed after user says "yes", "commit", "push", etc.

### Exception Cases

Only commit/push automatically if:
- User explicitly says "commit and push" in the same message
- User says "save changes" or "save this"
- User gives clear, unambiguous consent

### Safety First

When in doubt, **ASK** before committing. It's better to ask for permission than to make unwanted changes to the repository.

### Example Interactions

✅ **Good**: "I've made the changes. Would you like me to commit and push these updates?"

❌ **Bad**: Automatically running `git add . && git commit -m "..." && git push` without asking

This rule ensures the user maintains full control over their git repository and prevents accidental commits or pushes.
