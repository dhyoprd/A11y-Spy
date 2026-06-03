# Database Documentation

A11y-Spy does not require a database for the MVP.

The extension runs locally inside VS Code and analyzes open documents in the user's workspace.

## Current Storage

A11y-Spy may use:

- VS Code user settings.
- Workspace settings.
- Local extension state for future preferences.

## No User Code Upload

A11y-Spy should not upload user source code to an external server in the MVP.

All analysis should run locally.

## Future Considerations

If future versions add optional cloud features, this document must be updated to describe:

- Data collected.
- Storage provider.
- Retention policy.
- User consent.
- Opt-out mechanism.
- Privacy impact.
- Security model.

Potential future features that may require storage:

- Team-level accessibility reports.
- Historical issue trends.
- Project accessibility score.
- Shared rule configuration.
- CI dashboard.

Until then, the project should remain local-first.
