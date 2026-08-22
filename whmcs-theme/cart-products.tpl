{include file="orderforms/standard_cart/common.tpl"}

<div id="order-standard_cart">
    <div class="row">
        <div class="cart-sidebar sidebar">
            {include file="orderforms/standard_cart/sidebar-categories.tpl"}
        </div>
        <div class="cart-body">

            <div class="header-lined">
                <h1 class="font-size-36">
                    {if $productGroup.headline}
                        {$productGroup.headline}
                    {else}
                        {$productGroup.name}
                    {/if}
                </h1>
                {if $productGroup.tagline}
                    <p>{$productGroup.tagline}</p>
                {/if}
            </div>
            {if $errormessage}
                <div class="alert alert-danger">
                    {$errormessage}
                </div>
            {elseif !$productGroup}
                <div class="alert alert-info">
                    {lang key='orderForm.selectCategory'}
                </div>
            {/if}

            {include file="orderforms/standard_cart/sidebar-categories-collapsed.tpl"}

            {* ShrotiHost pricing grid — same card anatomy as shrotihost.in/hosting:
               fixed badge row, name + tagline, gradient price, checklist, CTA. *}
            <div class="products sh-plans" id="products">
                {assign var=sh_count value=$products|@count}
                {foreach $products as $key => $product}
                    {$idPrefix = ($product.bid) ? ("bundle"|cat:$product.bid) : ("product"|cat:$product.pid)}
                    {$sh_popular = ($sh_count >= 3 && $product@iteration == 2)}
                    <div class="sh-plan{if $sh_popular} sh-plan--popular{/if}" id="{$idPrefix}">
                        <div class="sh-plan__badge">{if $sh_popular}<span>Most Popular</span>{/if}</div>
                        <h3 class="sh-plan__name" id="{$idPrefix}-name">{$product.name}</h3>
                        {if $product.stockControlEnabled}<div class="sh-plan__qty">{$product.qty} {$LANG.orderavailable}</div>{/if}
                        <div class="sh-plan__price" id="{$idPrefix}-price">
                            {if $product.bid}
                                <span class="sh-plan__amount">{$product.displayprice}</span>
                                <span class="sh-plan__cycle">{$LANG.bundledeal}</span>
                            {else}
                                {if $product.pricing.hasconfigoptions}<span class="sh-plan__from">{$LANG.startingfrom}</span>{/if}
                                <span class="sh-plan__amount">{$product.pricing.minprice.price}</span>
                                <span class="sh-plan__cycle">
                                    {if $product.pricing.minprice.cycle eq "monthly"}{$LANG.orderpaymenttermmonthly}
                                    {elseif $product.pricing.minprice.cycle eq "quarterly"}{$LANG.orderpaymenttermquarterly}
                                    {elseif $product.pricing.minprice.cycle eq "semiannually"}{$LANG.orderpaymenttermsemiannually}
                                    {elseif $product.pricing.minprice.cycle eq "annually"}{$LANG.orderpaymenttermannually}
                                    {elseif $product.pricing.minprice.cycle eq "biennially"}{$LANG.orderpaymenttermbiennially}
                                    {elseif $product.pricing.minprice.cycle eq "triennially"}{$LANG.orderpaymenttermtriennially}{/if}
                                </span>
                                {if $product.pricing.minprice.setupFee}<small class="sh-plan__setup">{$product.pricing.minprice.setupFee->toPrefixed()} {$LANG.ordersetupfee}</small>{/if}
                            {/if}
                        </div>
                        <p class="sh-plan__renew">Renews at the same price — no increase later</p>
                        <div class="sh-plan__features" id="{$idPrefix}-description">
                            {$product.featuresdesc}
                            {if $product.features}
                                <ul>{foreach $product.features as $feature => $value}<li id="{$idPrefix}-feature{$value@iteration}"><span class="feature-value">{$value}</span> {$feature}</li>{/foreach}</ul>
                            {/if}
                        </div>
                        <a href="{$product.productUrl}" class="btn sh-plan__cta {if $sh_popular}sh-btn-primary{else}sh-btn-ghost{/if} btn-order-now" id="{$idPrefix}-order-button"{if $product.hasRecommendations} data-has-recommendations="1"{/if}>
                            Choose {$product.name}
                        </a>
                        <p class="sh-plan__note">Secure checkout · UPI, cards &amp; net banking</p>
                    </div>
                {/foreach}
            </div>
        </div>
    </div>
</div>

{include file="orderforms/standard_cart/recommendations-modal.tpl"}
