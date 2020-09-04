<script>
	export let name;
</script>

<div class="chip">
	<div class="chip-head">{name.charAt(0)}</div>
	<div class="chip-content">{name}</div>
	<div class="chip-close"></div>
</div>

<style>
	.chip{
		display: inline-flex;
		flex-direction: row;
		background-color: #e5e5e5;
		border: none;
		cursor: default;
		height: 26px;
		outline: none;
		padding: 0;
		font-size: 14px;
		font-color: #333333;
		font-family:"Open Sans", sans-serif;
		white-space: nowrap;
		align-items: center;
		border-radius: 16px;
		vertical-align: middle;
		text-decoration: none;
		justify-content: center;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.chip-head{
		display: flex;
		position: relative;
		overflow: hidden;
		background-color: #2098D1;
		flex-shrink: 0;
		align-items: center;
		user-select: none;
		border-radius: 50%;
		justify-content: center;
		width: 15px;
		color: #fff;
		height: 15px;
		font-size: 12px;
		padding: 5px;
		margin-right: 0;
		margin-left: 5px;
	}
	.chip-content{
		cursor: inherit;
		display: flex;
		align-items: center;
		user-select: none;
		white-space: nowrap;
		padding-left: 12px;
		padding-right: 12px;
	}
</style>
