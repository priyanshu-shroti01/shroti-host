# ShrotiHost WHMCS theme (portal.shrotihost.in)

Our client-area theme. WHMCS 8.13 does **not** support child themes
(`parent:` in theme.yaml is ignored — missing .tpl files produce blank pages),
so the live theme is a full copy of Twenty-One with these files laid on top.
Only the override files are versioned here; everything else is stock
Twenty-One.

    templates/shrotihost/           ← live: /home/shrotihost/portal.shrotihost.in/templates/shrotihost
      theme.yaml, header.tpl, footer.tpl, includes/head.tpl, css/shrotihost.css, img/

Deploy / update (as root on the server):

    bash whmcs-theme/deploy.sh        # re-copies Twenty-One base, lays overrides on top, clears Smarty cache

The cart uses `templates/orderforms/shrotihost` (a copy of standard_cart whose
common.tpl also loads css/shrotihost.css last).

The Lagom addon (RSThemes) must stay **deactivated** while this theme is
active: its hooks are lagom2-specific and its HTML cache serves stale Lagom
pages. Re-activate it (Setup → Addon Modules) only if switching back to lagom2.
