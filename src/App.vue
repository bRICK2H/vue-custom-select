<template>
	<div id="app">
		<div class="model">
			selected: {{ selected }}
		</div>
		<!-- <div class="area-visibility"> -->
			
			<!-- <c-select
				:classes="['option--txt-center', 'option--pd']"
				label="name"
				:options="options"
				:reduce="option => option.value"
				v-model="selected"
			/> -->
			<c-select
				title="Выберите опцию"
				label="name"
				:width="500"
				:options="options"
				:multiple="true"
				:reduce="o => ({ name: o.name, price: o.price })"
				:classes="['option--txt-center', 'option--pd']"
				v-model="selected"
			/>

		<!-- </div> -->
	</div>
</template>

<script>
import CSelect from './plugin/c-select/src/main'

export default {
	name: 'App',
	components: {
		CSelect
	},
	data: () => ({
		options: [
			{ name: 'Маникюр-хороший', price: 490 },
			{ name: 'Педикюр', price: 300 },
			{ name: 'Мужская косметология', price: 99 },
			{ name: 'Стикс-обертывания для тела', price: 33 },
		],
		selected: []
	}),
}
</script>

<style lang="scss">
	// @import '@/assets/scss/main';

	#app {
		width: inherit;
		height: inherit;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.model {
		font-size: 14px;
		margin: 3rem;
	}
	.option--txt-center {
		text-align: center;
	}
	.option--pd {
		// padding: 1rem 0;
	}
	.area-visibility {
		height: 100px;
		overflow: scroll;
		padding: 30px;
		border: 1px solid red;
	}
</style>
