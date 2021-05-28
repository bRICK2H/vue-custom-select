<template>
	<div id="app">
		<div class="model">
			selected:  {{ selected }}
		</div>
		<!-- <div class="area-visibility"> -->
			<c-select
				title="Выберите опцию"
				:o_label="o => ({price: o.price, id: o.id})"
				v-model="selected"
				:options="options"
				:clearable="false"
				:multiple="false"
			>
				<template v-slot:select="select">
					<span style="color: red">
						{{ select.name }} {{ select.id }}
					</span>
				</template>
				<template v-slot:option="option">
					<span style="color: blue">
						{{ option.name }}
					</span>
				</template>
			</c-select>

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
		// options: [
		// 		{ id: 1, name: 'Маникюр-хороший', price: 490 },
		// 		{ id: 2, name: 'Педикюр', price: 1000 },
		// 		{ id: 3, name: 'Мужская косметология', price: 99 },
		// 		{ id: 4, name: 'Стикс-обертывания для тела', price: 33 },
		// 	],
		// selected: []
		options: [],
		selected: [{ id: 2, name: 'Педикюр', price: 300 }]
	}),
	created() {
		// setTimeout(() => {
			// this.selected = [{ id: 2, name: 'Педикюр', price: 1000 }]
			this.options = [
				{ id: 1, name: 'Маникюр-хороший', price: 490 },
				{ id: 2, name: 'Педикюр', price: 300 },
				{ id: 3, name: 'Мужская косметология', price: 99 },
				{ id: 4, name: 'Стикс-обертывания для тела', price: 33 },
			]
		// }, 3000)
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
		font-size: 10px;
		color: pink
	}
	.area-visibility {
		width: 600px;
		height: 300px;
		overflow: scroll;
		padding: 30px;
		border: 1px solid red;
	}
</style>
