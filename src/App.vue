<template>
	<div id="app">
		<div class="model">
			selected: {{ selected }}
		</div>
		<div class="area-visibility">
			
			<c-select
				:classes="['option--txt-center', 'option--pd']"
				label="name"
				:options="options"
				:reduce="option => option.value"
				v-model="selected"
			/>
			<c-select
				:classes="['option--txt-center', 'option--pd']"
				label="name"
				:options="options"
				:reduce="option => option.value"
				v-model="selected"
			/>

		</div>
	</div>
</template>

<script>
export default {
	name: 'App',
	data: () => ({
		options: [
			{ name: 'Шереметьево', value: 'SVO' },
			{ name: 'Внуково', value: 'VKO' },
			{ name: 'Домодедово', value: 'DME' },
			{ name: 'Жуковский', value: 'ZIA' },
		],
		selected: ''
	}),
}
</script>

<style lang="scss">
	@import '@/assets/scss/main';

	#app {
		width: inherit;
		height: inherit;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.model {
		font-size: 2rem;
		margin: 3rem;
	}
	.option--txt-center {
		text-align: center;
	}
	.option--pd {
		padding: 1rem 0;
	}
	.area-visibility {
		height: 100px;
		overflow: scroll;
		padding: 30px;
		border: 1px solid red;
	}
</style>
