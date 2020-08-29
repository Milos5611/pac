<div class="header">
	<a href="/">
		<span class="black-logo navigation-logo-img"></span>
    </a>
</div>

<style type="text/scss">
    .header {
		background-color: transparent!important;
		position: fixed;
		width: 100%!important;
		height: auto!important;
		box-sizing: border-box;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		padding: 24px 24px 0;
		display: flex;
		justify-content: space-between;
		top: 0;
		z-index: 1;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.71;
		color: rgb(148, 158, 168);

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
