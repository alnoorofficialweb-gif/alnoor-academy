# Modal & Window Design Rule (Alnoor Academy)

Applies to every modal, dialog, drawer, popover and floating window in this project.

- **No outlines/borders on windows.** Never add `border`, `ring` or `outline` to a modal container or its cards.
- **Separation by soft shadow only** (Apple / Google style), e.g.
  - Window: `shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)]`
  - Cards inside: `shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_20px_-6px_rgba(16,24,40,0.10)]`
- **Sticky header & footer:** the modal has a fixed height; only the body scrolls. The close (×) button is always visible.
- **Minimal text:** short labels (e.g. "Guardian" not "Parent / Guardian Name"); values on a single line (`whitespace-nowrap`, `tabular-nums`).
- **Consistent typography:** labels `text-[11px] text-gray-500`, values `text-[13px]–[15px] font-semibold text-gray-900`.
- **No decorative illustrations** (e.g. mosque silhouettes) inside modal sidebars.
- Reference implementation: Student Profile modal in `src/app/admin/students/StudentsManagerClient.tsx` (`ProfileCard`, `ProfileStat`, `ProfileTimeline`).
