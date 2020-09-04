<script>
	import {Navigate} from "svelte-router-spa";
	import { logout, userInfo } from "@dopry/svelte-oidc"
	import { Button } from 'smelte';
</script>
<div class="header">
	<a href="/" class="anchor">
		<span class="black-logo navigation-logo-img"></span>
    </a>

	<Navigate styles="anchor" to="persons" title="Persons">
		<p>Persons</p>
	</Navigate>

	<Navigate styles="anchor" to="overview" title="Day Overview">
		<p>Day Overview</p>
	</Navigate>

	<Navigate styles="anchor" to="/" title="Logout">
		{#if $userInfo.name}
			<button on:click|preventDefault='{() => logout() }'>Logout</button>
		{/if}
	</Navigate>
</div>

<style type="text/scss">
    .header {
		background-color: transparent;
		position: fixed;
		box-sizing: border-box;
		padding: 24px 24px 0;
		display: flex;
        flex-direction: column;
		top: 0;
		z-index: 1;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.71;
		color: rgb(148, 158, 168);

		.anchor {
			p, span {
				margin-bottom: 20px;
			}
		}

        .navigation-logo-img {
			background: url("../images/spritesheet.png") no-repeat;
			display: block;
			width: 29px;
			height: 28px;

			&.black-logo {
				background-position: -89px -32px;
			}

			&.white-logo {
				background-position: -89px -69px;
			}

			@media screen and (max-width: 992px) {
				&.white-logo {
					background-position: -89px -32px;
				}
			}
		}

    }
</style>
