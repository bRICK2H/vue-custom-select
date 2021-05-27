<template>
	<div id="app">
		<div class="model">
			selected: {{ selected }}
		</div>
		<!-- <div class="area-visibility"> -->
			<c-select
				title="Выберите опцию"
				:value="selected"
				@input="val => selected = val"
				:multiple="true"
			/>

				<!-- :s_label="o => o.name" -->
				<!-- :width="500" -->
				<!-- o_label="name" -->
				<!-- :options="options" -->
				<!-- :clearable="true" -->
				<!-- :multiple="true" -->
				<!-- :reduce="o => o.price" -->
				<!-- :classes="['option--txt-center', 'option--pd']" -->
				<!-- v-model="selected" -->

			<!-- <v-select style="width: 300px"
				:value="selected"
			/> -->
				<!-- label="name" -->
				<!-- :options="options" -->
				<!-- :clearable="true" -->
				<!-- :reduce="o => ({price: o.price, name: o.name})" -->
				<!-- :classes="['option--txt-center', 'option--pd']" -->
				<!-- v-model="selected" -->

		<!-- </div> -->
	</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import CSelect from './plugin/c-select/src/main'

export default {
	name: 'App',
	components: {
		CSelect,
		vSelect
	},
	data: () => ({
		// options: ['Маникюр-хороший', 'Педикюр', 'Мужская косметология', 'Стикс-обертывания для тела', [1,23], [1,[3,[4]]]],
		options: [
			{ id: 1, name: 'Маникюр-хороший', price: 490 },
			{ id: 2, name: 'Педикюр', price: 300 },
			{ id: 3, name: 'Мужская косметология', price: 99 },
			{ id: 4, name: 'Стикс-обертывания для тела', price: 33 },
		],
		selected: [
			{countryCode: 'USA', countryName: 'USA'},
			{countryCode: 'RU', countryName: 'Russia'},
		]
	}),
	created() {
		setTimeout(() => {
			// this.selected = [{countryCode: 'CA', countryName: 'Canada'}]
		}, 300)
	}
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
		width: 600px;
		height: 300px;
		overflow: scroll;
		padding: 30px;
		border: 1px solid red;
	}
</style>
