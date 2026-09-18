# Dillo Dashboard

A separate operations-dashboard build for Dillo Socials.

## Included now
- Client records: add, edit, search
- Projects: progress tracking and status
- Invoices: paid/pending/overdue states
- Calendar: September 2026 events
- Files: file metadata and approval state
- Overview KPIs, quick actions and recent activity
- Responsive mobile navigation
- Modals, validation, toasts, empty states
- localStorage persistence so interactions survive refresh

## Production path
This is the functional front-end foundation. Real client data should later move to authenticated backend storage with user roles, server-side validation, secure file storage, audit logs and backups.

## Repository note
The connected GitHub account currently exposes the existing `dillosocials` repository but not a repository-creation action. To keep the public site untouched, this build lives on the `dillo-dashboard` branch under `dillo-dashboard/`. It can be moved into a truly separate repository once that repository is created.
