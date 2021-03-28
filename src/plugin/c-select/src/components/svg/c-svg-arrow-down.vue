<template>
	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32"
		class="selected-arrow"
		:class="{ 'selected-arrow--active': isToggle }"
	>
		<title>chevron-down</title>
		<path d="M7.833 9.333l8.167 8.167 8.167-8.167 2.5 2.5-10.667 10.667-10.667-10.667z"></path>
	</svg>
</template>

<script>
export default {
	name: 'CSvgArrowDown',
	props: {
		isToggle: false,
	}
}
</script>

<style lang="scss">
	.selected-arrow {
		fill: rgba(60,60,60,.9);
		transform: rotate(0);
		transition: .2s ease-out;

		&--active {
			transform: rotate(-180deg);
		}
	}
</style>