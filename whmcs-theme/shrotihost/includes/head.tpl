<!-- Styling -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
<link href="{$WEB_ROOT}/templates/twenty-one/css/all.min.css?v={$versionHash}" rel="stylesheet">
<link href="{$WEB_ROOT}/templates/twenty-one/css/theme.min.css?v={$versionHash}" rel="stylesheet">
<link href="{$WEB_ROOT}/assets/css/fontawesome-all.min.css" rel="stylesheet">
<link href="{$WEB_ROOT}/templates/shrotihost/css/shrotihost.css?v=3" rel="stylesheet">
<link rel="icon" type="image/png" href="{$WEB_ROOT}/templates/shrotihost/img/icon.png">
<meta name="theme-color" content="#0a0a0f">

<script>
    var csrfToken = '{$token}',
        markdownGuide = '{lang|addslashes key="markdown.title"}',
        locale = '{if !empty($mdeLocale)}{$mdeLocale}{else}en{/if}',
        saved = '{lang|addslashes key="markdown.saved"}',
        saving = '{lang|addslashes key="markdown.saving"}',
        whmcsBaseUrl = "{\WHMCS\Utility\Environment\WebHelper::getBaseUrl()}";
    {if $captcha}{$captcha->getPageJs()}{/if}
</script>
<script src="{$WEB_ROOT}/templates/twenty-one/js/scripts.min.js?v={$versionHash}"></script>

{if $templatefile == "viewticket" && !$loggedin}
  <meta name="robots" content="noindex" />
{/if}
