<section class="sh-hero">
    <div class="sh-hero__glow" aria-hidden="true"></div>
    <span class="sh-eyebrow">Client portal</span>
    <h1>Everything you host, <span class="sh-gradient-text">in one place.</span></h1>
    <p>Manage services, domains, invoices and support — or start something new.</p>
    <div class="sh-hero__actions">
        {if $loggedin}
            <a href="{$WEB_ROOT}/clientarea.php" class="btn sh-btn-primary btn-lg">Open dashboard</a>
            <a href="{$WEB_ROOT}/submitticket.php" class="btn sh-btn-ghost btn-lg">Get support</a>
        {else}
            <a href="{$WEB_ROOT}/index.php?rp=/login" class="btn sh-btn-primary btn-lg">Login</a>
            <a href="{$WEB_ROOT}/register.php" class="btn sh-btn-ghost btn-lg">Create account</a>
        {/if}
    </div>
</section>

{if !empty($productGroups) || $registerdomainenabled || $transferdomainenabled}
    <h2 class="sh-section-title">{lang key='clientHomePanels.productsAndServices'}</h2>
    <div class="sh-tiles">
        {foreach $productGroups as $productGroup}
            <a href="{$productGroup->getRoutePath()}" class="sh-tile">
                <span class="sh-tile__icon"><i class="fal fa-server"></i></span>
                <h3>{$productGroup->name}</h3>
                <p>{$productGroup->tagline}</p>
                <span class="sh-tile__link">{lang key='browseProducts'} <i class="fal fa-arrow-right"></i></span>
            </a>
        {/foreach}
        {if $registerdomainenabled}
            <a href="{$WEB_ROOT}/cart.php?a=add&domain=register" class="sh-tile">
                <span class="sh-tile__icon"><i class="fal fa-globe"></i></span>
                <h3>{lang key='orderregisterdomain'}</h3>
                <p>{lang key='secureYourDomain'}</p>
                <span class="sh-tile__link">{lang key='navdomainsearch'} <i class="fal fa-arrow-right"></i></span>
            </a>
        {/if}
        {if $transferdomainenabled}
            <a href="{$WEB_ROOT}/cart.php?a=add&domain=transfer" class="sh-tile">
                <span class="sh-tile__icon"><i class="fal fa-exchange"></i></span>
                <h3>{lang key='transferYourDomain'}</h3>
                <p>{lang key='transferExtend'}</p>
                <span class="sh-tile__link">{lang key='transferYourDomain'} <i class="fal fa-arrow-right"></i></span>
            </a>
        {/if}
    </div>
{/if}

<h2 class="sh-section-title">{lang key='howCanWeHelp'}</h2>

<div class="row my-5 action-icon-btns">
    <div class="col-6 col-md-4 col-lg">
        <a href="{routePath('announcement-index')}" class="card-accent-teal">
            <figure class="ico-container">
                <i class="fal fa-bullhorn"></i>
            </figure>
            {lang key='announcementstitle'}
        </a>
    </div>
    <div class="col-6 col-md-4 col-lg">
        <a href="serverstatus.php" class="card-accent-pomegranate">
            <figure class="ico-container">
                <i class="fal fa-server"></i>
            </figure>
            {lang key='networkstatustitle'}
        </a>
    </div>
    <div class="col-6 col-md-4 col-lg">
        <a href="{routePath('knowledgebase-index')}" class="card-accent-sun-flower">
            <figure class="ico-container">
                <i class="fal fa-book"></i>
            </figure>
            {lang key='knowledgebasetitle'}
        </a>
    </div>
    <div class="col-6 col-md-4 offset-md-2 offset-lg-0 col-lg">
        <a href="{routePath('download-index')}" class="card-accent-asbestos">
            <figure class="ico-container">
                <i class="fal fa-download"></i>
            </figure>
            {lang key='downloadstitle'}
        </a>
    </div>
    <div class="col-6 offset-3 offset-md-0 col-md-4 col-lg">
        <a href="submitticket.php" class="card-accent-green">
            <figure class="ico-container">
                <i class="fal fa-life-ring"></i>
            </figure>
            {lang key='homepage.submitTicket'}
        </a>
    </div>
</div>

<h2 class="sh-section-title">{lang key='homepage.yourAccount'}</h2>

<div class="row my-5 action-icon-btns">
    <div class="col-6 col-md-4 col-lg">
        <a href="clientarea.php" class="card-accent-midnight-blue">
            <figure class="ico-container">
                <i class="fal fa-home"></i>
            </figure>
            {lang key='homepage.yourAccount'}
        </a>
    </div>
    <div class="col-6 col-md-4 col-lg">
        <a href="clientarea.php?action=services" class="card-accent-midnight-blue">
            <figure class="ico-container">
                <i class="far fa-cubes"></i>
            </figure>
            {lang key='homepage.manageServices'}
        </a>
    </div>
    {if $registerdomainenabled || $transferdomainenabled || $numberOfDomains}
        <div class="col-6 col-md-4 col-lg">
            <a href="clientarea.php?action=domains" class="card-accent-midnight-blue">
                <figure class="ico-container">
                    <i class="fal fa-globe"></i>
                </figure>
                {lang key='homepage.manageDomains'}
            </a>
        </div>
    {/if}
    <div class="col-6 col-md-4 offset-md-2 offset-lg-0 col-lg">
        <a href="supporttickets.php" class="card-accent-midnight-blue">
            <figure class="ico-container">
                <i class="fal fa-comments"></i>
            </figure>
            {lang key='homepage.supportRequests'}
        </a>
    </div>
    <div class="col-6 offset-3 offset-md-0 col-md-4 col-lg">
        <a href="clientarea.php?action=masspay&all=true" class="card-accent-midnight-blue">
            <figure class="ico-container">
                <i class="fal fa-credit-card"></i>
            </figure>
            {lang key='homepage.makeAPayment'}
        </a>
    </div>
</div>
