# DevTrackr

DevTrackr is a professional tool designed to manage and track technology job applications, helping developers organize their career growth efficiently.

## 📝 Commit Patterns

This repository follows the **Conventional Commits** specification for a clean and organized versioning history.

### Structure
Messages must follow the format: `<type>(optional-scope): <short-description>`.

### Main Types
- **feat**: New features.
- **fix**: Bug fixes.
- **docs**: Documentation changes.
- **infra**: Infrastructure, database, and Docker changes.
- **chore**: Build tasks, package updates, or maintenance.
- **refactor**: Code changes that neither fix a bug nor add a feature.

### Guidelines
- Use the **imperative** mood in descriptions (e.g., "add", "setup", "fix").
- Use **lowercase** for the start of the description.
- Do **not** put a period (.) at the end of the message.

## 🌿 Branching Strategy
Branches are categorized by area followed by a short description:

- **api/<description>**: Backend development.
- **web/<description>**: Frontend development.
- **infra/<description>**: Database and Docker configurations.
- **docs/<description>**: Documentation updates.

*Example: `api/add-auth` or `infra/setup-postgres`*