<template>
	<div class="select-container">
		<div class="selected select-container__selected"
			ref="selected"
			@click.stop="toggleSelect"
		>
			{{ currName }}
			<span class="selected__wrap-icon">
				<c-svg-arrow-down
					:isToggle="isOpenSelect"
				/>
			</span>
		</div>
		<!-- <transition name="dropdown-list"> -->
			<ul class="dropdown-list select-container__dropdown-list"
				:style="setStylesToDropDownList"
				v-show="isOpenSelect"
			>
				<li class="option" :class="[...classes]"
					v-for="option of options"
					:key="option.value"
				>

					<label :for="`radio_${option.value}`" class="label option__label"
						:class="{'label--active': option.value === currValue}"
						@click="setHightLight(option)"
					>
						{{ option[label] }}
					</label>
					<input :id="`radio_${option.value}`"
						class="option__input"
						type="radio"
						:name="label"
						:value="reduce(option)"
						@input="$emit('input', $event.target.value)"
					>

				</li>
			</ul>
		<!-- </transition> -->
	</div>
</template>

<script>
import CSvgArrowDown from './components/svg/c-svg-arrow-down' 

export default {
	name: 'cSelect',
	components: { CSvgArrowDown },
	props: {
		classes: {
			type: Array,
			default: () => ([])
		},
		label: {
			type: String,
			default: ''
		},
		options: {
			type: Array,
			default: () => ([])
		},
		reduce: {
			type: Function,
			default: option => option
		}
	},
	data: () => ({
		coordsSelected: {},
		timeoutId: null,
		
		isOpenSelect: false,
		currValue: null,
		currName: 'Select',
		iconDown: require('@/assets/icons/down.svg')
	}),
	computed: {
		setStylesToDropDownList() {
			return {
				width: `${this.coordsSelected.width}px`,
				top: `${this.coordsSelected.y + (this.coordsSelected.height)}px`,
				left: `${this.coordsSelected.x}px`,
			}
		}
	},
	methods: {
		toggleSelect() {
			this.isOpenSelect = !this.isOpenSelect;
		},
		setHightLight({ name, value }) {
			this.currName = name;
			this.currValue = value;
		},
	},
	created() {
		window.addEventListener('click', () => {
			this.isOpenSelect = false;
		});
	},
	mounted() {
		const setCoordsSelected = () => {
			clearTimeout(this.timeoutId)
			this.timeoutId = setTimeout(() => {
				this.coordsSelected = this.$refs['selected'].getBoundingClientRect()
				console.log(this.coordsSelected)
			}, 300)
		}

		setCoordsSelected()
		window.addEventListener('resize', setCoordsSelected)
	}
}
</script>

<style lang="scss">
	.select-container {
		width: 300px;
		height: 50px;
		position: relative;

		&__selected {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 99;
		}
		&__dropdown-list {
			position: fixed;
			z-index: 100;
		}
	}
	.selected {
		width: 100%;
		height: 100%;
		background: #fff;
		border: 1px solid rgba(60,60,60,.26);
		border-radius: 4px;
		color: #000;
		display: flex;
		justify-content: center;
		align-items: center;

		&__wrap-icon {
			position: absolute;
			top: 50%;
			right: 10px;
			transform: translateY(-50%);
		}
	}
	.dropdown-list {
		width: 100%;
		background-color: #fff;
		color: #000;
		display: flex;
		flex-direction: column;
	}
	.option {
		text-align: left;
		padding: 5px 0;
		position: relative;

		&__label {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		&__input {
			visibility: hidden;
		}
	}
	.label {
		&:hover {
			background-color: #ddd;
		}
		&--active {
			background-color: #999;;
		}
	}
</style>