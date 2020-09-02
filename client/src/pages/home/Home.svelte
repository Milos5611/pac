<script>
	import {
		login,
		logout,
		userInfo,
		isAuthenticated
	} from '@dopry/svelte-oidc';
	import { Button } from 'smelte';
	import {Navigate} from "svelte-router-spa";
	/*const metadata = {
		// added to overcome missing value in auth0 .well-known/openid-configuration
		// see: https://github.com/IdentityModel/oidc-client-js/issues/1067
		// see: https://github.com/IdentityModel/oidc-client-js/pull/1068
		end_session_endpoint: `process.env.OIDC_ISSUER/v2/logout?client_id=process.env.OIDC_CLIENT_ID`,
	}*/
	let authData;
	$: {
		authData = $userInfo = JSON.stringify(userInfo, null, 2);
	}
</script>

<div id="appContainer">
	<div class="evnt-login">
		<div class="image-holder">
			<aside>
				<h2 class="quote">Great, kid. Don't get cocky</h2>
				<hr/>
				<h4 class="author">Han Solo</h4>
			</aside>
		</div>
		<section class="main-wrapped">
			<div class="login-form">
				<aside>
					<h3 class="aside-title">
						{#if !authData.name}
							Welcome to
						{/if}
						Eventio
					</h3>
					{#if !authData.name}
						<p class="login--good aside-desc">Choose how you want to continue</p>
					{/if}
				</aside>
				<aside class="action-buttons">
					{#if !authData.name}
						<Button text on:click={() => login()}>
							Login
						</Button>
					{/if}
					<Navigate to="events">
						<Button text>
							{#if isAuthenticated && authData.name}
								Welcome back {authData.name} you can proceed to application
							{:else}
								Guest access
							{/if}
						</Button>
					</Navigate>
				</aside>
			</div>
		</section>
	</div>
</div>

<style type="text/scss">
	.image-holder {
		background: url("../images/str.png") no-repeat center;
		width: 25%;
		height: auto;
		background-size: cover;
		min-height: 100%;
		position: fixed;
		display: block;

		&:after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			opacity: 0.85;
			background-color: #323c46;
		}

		@media (max-width: 1200px) {
			width: 33.3%;
		}

		@media (max-width: 992px) {
			display: none;
		}

		aside {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			height: 100vh;
			padding: 0 8em 6em;
			text-align: center;

			.quote {
				align-items: flex-start;
				color: #fff;
				font-size: 36px;
				text-align: center;
				width: 310px;
			}

			hr {
				width: 20px;
				border: 1px solid #5cb85c;
				margin: 10px;
			}

			.author {
				color: blanchedalmond;
				align-items: flex-end;
				font-size: 14px;
			}
		}
	}
	.main-wrapped {
		width: 75%;
		float: right;
		.login-form {
			width: 50%;
			margin: auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			position: relative;
			height: 100vh;
			overflow: hidden;

			.aside-title {
				font-size: 28px;
				line-height: 1.71;
			}
			.aside-desc {
				color: #6a7989;
				font-size: 18px;
				line-height: 1.33;
			}

			.action-buttons {
				margin-top: 20px;
			}
		}
	}
</style>
