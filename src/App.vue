<template>
	<div id="app">
		<div class="model">
			v-model: {{ selected }}
		</div>
		<c-select
			:classes="['option--txt-center', 'option--pd']"
			label="name"
			:options="options"
			:reduce="option => option.value"
			v-model="selected"
		/>
	</div>
</template>

<script>
import cSelect from '@/components/c-select'

export default {
	name: 'App',
	components: {
		cSelect
	},
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
</style>
