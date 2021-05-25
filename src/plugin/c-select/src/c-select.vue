<template>
	<div class="select-container"
		:style="setStyleToSelect"
		@click.stop=""
	>
		<div class="selected select-container__selected"
			ref="selected"
		>
			<div v-if="typeof getSelectedElements === 'string'"
				class="select-title selected__select-title"
			>
				{{ getSelectedElements }}
				
			</div>
			<div v-else
				class="select-name selected__select-name"
				v-for="(element, i) of getSelectedElements"
				:key="`sl${i}`"
			>
				<div class="select-box-name select-name__select-box-name">
					<template v-if="typeof element === 'object'">
						<span class="select-box-name__item"
							v-for="(item, key) in element"
							:key="key"
						>
							{{ item }}
						</span>
					</template>
					<span v-else class="select-box-name__item">
						{{ element }}
					</span>
				</div>
				<i-close class="select-name__close"
					@click.native="drop(i)"
				/>
			</div>

			<i-add class="multiple-add"
				v-if="multiple"
				:class="[
					{ 'multiple-add--hover': cloneOptions.length },
					{ 'multiple-add--disabled': !cloneOptions.length }
				]"
				@click.native="cloneOptions.length ? isOpenSelect = true : false"
			/>
			<span class="selected__wrap-icon"
				v-else
			>
				<c-svg-arrow-down
					:isToggle="isOpenSelect"
				/>
			</span>
		</div>

		<!-- <transition name="dropdown-list"> -->
			<ul class="dropdown-list select-container__dropdown-list"
				v-show="isOpenSelect"
				:style="setStylesToDropDownList"
			>
				<!-- :style="{width: `${this.width}px`, top: '44px'}" -->
				<li class="option" :class="[...classes]"
					v-for="option of cloneOptions"
					:key="option[label]"
				>

					<div class="option__name"
						@click="select(option)"
					>
						{{ option[label] }}
					</div>

				</li>
			</ul>
		<!-- </transition> -->
	</div>
</template>

<script>
import CSvgArrowDown from './components/svg/c-svg-arrow-down' 
import iClose from './components/svg/close-svg' 
import iAdd from './components/svg/add-svg' 

export default {
	name: 'cSelect',
	components: { 
		CSvgArrowDown,
		iClose,
		iAdd
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		label: {
			type: String,
			default: ''
		},
		width: {
			type: Number,
			default: 300
		},
		options: {
			type: Array,
			default: () => ([])
		},
		multiple: {
			type: Boolean,
			default: false
		},
		classes: {
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
		
		isOpenSelect: false,
		selected: [],
		cloneOptions: [],
		iconDown: require('@/assets/icons/down.svg')
	}),
	computed: {
		setStylesToDropDownList() {
			return {
				width: `${this.coordsSelected.width}px`,
				top: `${this.coordsSelected.y + (this.coordsSelected.height)}px`,
				left: `${this.coordsSelected.x}px`,
			}
		},
		setStyleToSelect() {
			return {
				width: `${this.width}px`,
			}
		},
		getSelectedElements() {
			return !this.selected.length
				? this.title
				: this.selected.map(curr => this.reduce(curr))
		}
	},
	methods: {
		select(option) {
			const selectedIndex = this.cloneOptions.findIndex(curr => curr[this.label] === option[this.label])
			this.isOpenSelect = false

			this.multiple
				? this.selected.push(...this.cloneOptions.splice(selectedIndex, 1))
				: this.selected = [this.cloneOptions[selectedIndex]]

			this.$emit('input', this.selected.map(curr => this.reduce(curr)))

		},
		drop(i) {
			this.isOpenSelect = false
			this.cloneOptions.push(...this.selected.splice(i, 1))
			this.$emit('input', this.selected)
		},
		toggleSelect() {
			this.isOpenSelect = !this.isOpenSelect;
		},
	},
	created() {
		this.cloneOptions = this.options
		window.addEventListener('click', () => {
			console.log('?')
			this.isOpenSelect = false;
		});
	},
	watch: {
		selected: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					this.coordsSelected = this.$refs['selected'].getBoundingClientRect()
				})
			}
		}
	},
	mounted() {
		const setCoordsSelected = () => {
			this.coordsSelected = this.$refs['selected'].getBoundingClientRect()
		}

		setCoordsSelected()
		window.addEventListener('resize', setCoordsSelected)
	}
}
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap');
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Inter', sans-serif;
	}

	.select-container {
		// width: 300px;
		// height: 50px;
		position: relative;

		&__selected {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 99;
		}
		&__dropdown-list {
			// position: absolute;
			position: fixed;
			z-index: 100;
		}
	}
	.selected {
		width: 100%;
		// height: 100%;
		min-height: 44px;
		background: #fff;
		border: 2px solid #EEEDF7;
		border-radius: 8px;
		padding: 2px;
		color: #000;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		&__select-name {
			margin: 1.5px;
		}
		&__wrap-icon {
			position: absolute;
			top: 50%;
			right: 10px;
			transform: translateY(-50%);
		}
	}
	.select-name {
		height: 32px;
		font-size: 14px;
		font-weight: 500;
		color: #1F1F33;
		padding: 6px 12px;
		background: #F6F6FB;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;

		&__select-box-name {
			margin-right: 12px;
		}
		&__close {
			cursor: pointer;

			&:hover {
				filter: invert(.5)
			}
		}
	}
	.select-box-name {
		
	}
	.select-title {
		padding-left: 6px;
		display: flex;
		align-items: center;
	}
	.dropdown-list {
		width: 100%;
		// background-color: #fff;
		border: 1px solid rgba(221, 221, 221, .5);;
		border-top: none;
		color: #000;
		display: flex;
		flex-direction: column;
	}
	.option {
		text-align: left;
		padding: 20px 0;
		position: relative;
		list-style: none;

		&__name {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			&:hover {
				background-color: rgba(221, 221, 221, .13);
			}
		}
	}
	.multiple-add {
		cursor: pointer;

		&--disabled {
			filter: invert(.1)
		}
		&--hover {
			&:hover {
				filter: invert(.03);
			}
		}
	}
</style>