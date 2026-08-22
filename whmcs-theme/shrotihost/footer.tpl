                    </div>

                    </div>
                    {if !$inShoppingCart && $secondarySidebar->hasChildren()}
                        <div class="d-lg-none sidebar sidebar-secondary">
                            {include file="$template/includes/sidebar.tpl" sidebar=$secondarySidebar}
                        </div>
                    {/if}
                <div class="clearfix"></div>
            </div>
        </div>
    </section>

    <footer id="footer" class="footer sh-footer">
        <div class="container">
            <div class="sh-footer-grid">
                <div class="sh-footer-brand">
                    <img src="{$WEB_ROOT}/templates/shrotihost/img/logo.svg" alt="{$companyname}" class="sh-footer-logo">
                    <p>Premium hosting and software development for students, startups, and growing businesses — one partner from first domain to production.</p>
                    <p class="sh-footer-contact">
                        <a href="mailto:support@shrotihost.in"><i class="far fa-envelope"></i> support@shrotihost.in</a><br>
                        <a href="https://wa.me/919582129099"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>
                    </p>
                </div>
                <div>
                    <h3>Hosting</h3>
                    <ul>
                        <li><a href="https://shrotihost.in/hosting">Shared Hosting</a></li>
                        <li><a href="https://shrotihost.in/wordpress-hosting">WordPress Hosting</a></li>
                        <li><a href="https://shrotihost.in/unlimited-hosting">Unlimited Hosting</a></li>
                        <li><a href="https://shrotihost.in/reseller-hosting">Reseller Hosting</a></li>
                        <li><a href="https://shrotihost.in/domains">Domains</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Company</h3>
                    <ul>
                        <li><a href="https://shrotihost.in/about">About</a></li>
                        <li><a href="https://shrotihost.in/careers">Careers</a></li>
                        <li><a href="https://shrotihost.in/blog">Blog</a></li>
                        <li><a href="https://shrotihost.in/status">Status</a></li>
                        <li><a href="https://shrotihost.in/contact">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Account</h3>
                    <ul>
                        <li><a href="{$WEB_ROOT}/clientarea.php">Client Area</a></li>
                        <li><a href="{$WEB_ROOT}/submitticket.php">Submit a Ticket</a></li>
                        <li><a href="{$WEB_ROOT}/index.php?rp=/knowledgebase">Knowledgebase</a></li>
                        <li><a href="{$WEB_ROOT}/index.php/domain/pricing">Domain Pricing</a></li>
                        {if $acceptTOS}<li><a href="{$tosURL}" target="_blank">{lang key='ordertos'}</a></li>{/if}
                    </ul>
                </div>
            </div>
            <div class="sh-footer-bottom">
                <p class="copyright mb-0">{lang key="copyrightFooterNotice" year=$date_year company=$companyname}</p>
                <ul class="list-inline mb-0">
                    {include file="$template/includes/social-accounts.tpl"}
                    {if $languagechangeenabled && count($locales) > 1 || $currencies}
                        <li class="list-inline-item">
                            <button type="button" class="btn sh-btn-ghost btn-sm" data-toggle="modal" data-target="#modalChooseLanguage">
                                <div class="d-inline-block align-middle"><div class="iti-flag {if $activeLocale.countryCode === '001'}us{else}{$activeLocale.countryCode|lower}{/if}"></div></div>
                                {$activeLocale.localisedName} / {$activeCurrency.prefix}{$activeCurrency.code}
                            </button>
                        </li>
                    {/if}
                    <li class="list-inline-item"><a href="https://shrotihost.in/legal/terms">Terms</a></li>
                    <li class="list-inline-item"><a href="https://shrotihost.in/legal/privacy">Privacy</a></li>
                    <li class="list-inline-item"><a href="https://shrotihost.in/legal/refund-policy">Refunds</a></li>
                </ul>
            </div>
        </div>
    </footer>

    <div id="fullpage-overlay" class="w-hidden">
        <div class="outer-wrapper">
            <div class="inner-wrapper">
                <img src="{$WEB_ROOT}/assets/img/overlay-spinner.svg" alt="">
                <br>
                <span class="msg"></span>
            </div>
        </div>
    </div>

    <div class="modal system-modal fade" id="modalAjax" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">&times;</span>
                        <span class="sr-only">{lang key='close'}</span>
                    </button>
                </div>
                <div class="modal-body">
                    {lang key='loading'}
                </div>
                <div class="modal-footer">
                    <div class="float-left loader">
                        <i class="fas fa-circle-notch fa-spin"></i>
                        {lang key='loading'}
                    </div>
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        {lang key='close'}
                    </button>
                    <button type="button" class="btn btn-primary modal-submit">
                        {lang key='submit'}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <form method="get" action="{$currentpagelinkback}">
        <div class="modal modal-localisation" id="modalChooseLanguage" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>

                        {if $languagechangeenabled && count($locales) > 1}
                            <h5 class="h5 pt-5 pb-3">{lang key='chooselanguage'}</h5>
                            <div class="row item-selector">
                                <input type="hidden" name="language" data-current="{$language}" value="{$language}" />
                                {foreach $locales as $locale}
                                    <div class="col-4">
                                        <a href="#" class="item{if $language == $locale.language} active{/if}" data-value="{$locale.language}">
                                            {$locale.localisedName}
                                        </a>
                                    </div>
                                {/foreach}
                            </div>
                        {/if}
                        {if !$loggedin && $currencies}
                            <p class="h5 pt-5 pb-3">{lang key='choosecurrency'}</p>
                            <div class="row item-selector">
                                <input type="hidden" name="currency" data-current="{$activeCurrency.id}" value="">
                                {foreach $currencies as $selectCurrency}
                                    <div class="col-4">
                                        <a href="#" class="item{if $activeCurrency.id == $selectCurrency.id} active{/if}" data-value="{$selectCurrency.id}">
                                            {$selectCurrency.prefix} {$selectCurrency.code}
                                        </a>
                                    </div>
                                {/foreach}
                            </div>
                        {/if}
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-default">{lang key='apply'}</button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    {if !$loggedin && $adminLoggedIn}
        <a href="{$WEB_ROOT}/logout.php?returntoadmin=1" class="btn btn-return-to-admin" data-toggle="tooltip" data-placement="bottom" title="{if $adminMasqueradingAsClient}{lang key='adminmasqueradingasclient'} {lang key='logoutandreturntoadminarea'}{else}{lang key='adminloggedin'} {lang key='returntoadminarea'}{/if}">
            <i class="fas fa-redo-alt"></i>
            <span class="d-none d-md-inline-block">{lang key="admin.returnToAdmin"}</span>
        </a>
    {/if}

    {include file="$template/includes/generate-password.tpl"}

    {$footeroutput}

</body>
</html>
