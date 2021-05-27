<template>
	<div class="select-container"
		:style="setStyleToSelect"
		@click.stop=""
	>

		<!-- Select -->
		<div class="selected select-container__selected"
			:class="{ 'selected--only': !multiple || (!selected.length && !cloneOptions.length)}"
			ref="selected"
			@click="(!multiple && cloneOptions.length) || (!selected.length && !cloneOptions.length) ? toggleSelect() : false"
		>
			<div v-if="!selected.length"
				class="select-title selected__select-title"
				key="title"
			>
				* {{ title }}
				
			</div>
			<template v-else>
				<div class="select-name selected__select-name"
					:class="{'select-name--multiple': multiple}"
					v-for="(element, i) of selected"
					:key="`sl${i}`"
				>
					<span class="select-box-name select-name__select-box-name"
						:class="{
							'select-box-name--pale': !multiple && isOpenSelect,
							'select-box-name--mr': multiple && (!clearable && selected.length !== 1 || clearable)
						}"
					>
						{{ innerReduce(element, s_label) }}
					</span>
					<i-close v-if="multiple && (!clearable && selected.length !== 1 || clearable)"
						class="select-name__close"
						@click.native="drop(i)"
					/>
				</div>
			</template>

			<template v-if="multiple">
				<i-add v-if="cloneOptions.length"
					class="multiple-add"
					:class="[
						{ 'multiple-add--hover': cloneOptions.length },
					]"
					@click.native="cloneOptions.length ? isOpenSelect = true : false"
				/>
			</template>
			<template v-else>
				<div class="selected__wrap-icons"
					:class="{'selected__wrap-icons--has-item': selected.length && clearable}"
				>
					<template v-if="clearable">
						<i-close v-if="selected.length"
							@click.native.stop="drop(0)"
						/>
						<i-hor-line v-if="selected.length" />
					</template>
					<i-arrow-down class="rotate-arraw-down"
						:class="{'rotate-arraw-down--active': isOpenSelect}"
					/>
				</div>
			</template>
		</div>
		
		<!-- Optiions -->
		<transition name="dropdown-list">
			<ul class="dropdown-list select-container__dropdown-list"
				v-show="isOpenSelect"
				:style="setStylesToDropDownList"
			>
				<li v-if="!selected.length && !cloneOptions.length"
					class="option-empty" :class="[...classes]"
				>
					Данные отсутствуют
				</li>

				<template v-else>
					<li class="option" :class="[...classes]"
						v-for="(option, i) of cloneOptions"
						:key="i"
					>

						<div class="option__name"
							@click="select(option)"
						>
							{{ innerReduce(option, o_label) }}
						</div>

					</li>
				</template>
			</ul>
		</transition>
	</div>
</template>

<script>
import iClose from './components/svg/close-svg' 
import iAdd from './components/svg/add-svg' 
import iArrowDown from './components/svg/arrow-down-svg'
import iHorLine from './components/svg/hor-line-svg'

export default {
	name: 'cSelect',
	components: { 
		iAdd,
		iClose,
		iHorLine,
		iArrowDown
	},
	props: {
		title: {
			type: String,
			default: 'Выберите опцию'
		},
		s_label: {
			type: null,
			default: null
		},
		o_label: {
			type: null,
			default: null
		},
		width: {
			type: Number,
			default: 300
		},
		value: {
			type: Array,
			default: () => ([])
		},
		options: {
			type: Array,
			default: () => ([])
		},
		multiple: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: true
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
		selectCoords: {},
		isLoadWithChangedValue: false,
		isOpenSelect: false,
		selected: [],
		cloneOptions: []
	}),
	computed: {
		setStylesToDropDownList() {
			return {
				width: `${this.selectCoords.width}px`,
				top: `${this.selectCoords.y + (this.selectCoords.height)}px`,
				left: `${this.selectCoords.x}px`,
			}
		},
		setStyleToSelect() {
			return {
				width: `${this.width}px`,
				height: `${this.selectCoords.height}px`
			}
		},
	},
	methods: {
		select(option) {
			this.isOpenSelect = false
			const selectedIndex = this.cloneOptions.findIndex(curr => {
				return  JSON.stringify(curr) === JSON.stringify(option)
			})

			if (this.multiple) {
				this.selected.push(...this.cloneOptions.splice(selectedIndex, 1))
			} else {
				if (this.selected.length) {
					this.cloneOptions.push(...this.selected.splice(0, 1))
				}

				this.selected = this.cloneOptions.splice(selectedIndex, 1)
			}

			this.$emit('input', this.outerReduce(this.selected))

		},
		drop(i) {
			this.cloneOptions.push(...this.selected.splice(i, 1))
			this.$emit('input', this.outerReduce(this.selected))
		},
		outerReduce(arr) {
			return arr.map(c => this.reduce(c) === undefined ? c : this.reduce(c))
		},
		innerReduce(el, label) {
			if (Array.isArray(el)) {
				return el.flat().join(', ')
			} else if (typeof el === 'object') {
				if (label === null) {
					return Object.values(el).join(', ')
				} else {
					if (Array.isArray(label)) {
						return  label.map(l => el[l]).join(', ')
					} else if (typeof label === 'function') {
						if (label(el) === undefined) {
							console.warn(`[custom_select]: ${label} Не верно введено имя свойства объекта.`)
							return el
						} else if (Array.isArray(label(el))) {
							return label(el).join(', ')
						} else if (typeof label(el) === 'object') {
							return Object.values(label(el)).join(', ')
						} else {
							return label(el)
						}
					} else {
						return el[label]
					}
				}
			} else {
				return el
			}
		},
		toggleSelect() {
			this.isOpenSelect = !this.isOpenSelect;
		},
		setSelectCoords() {
			this.selectCoords = this.$refs['selected'].getBoundingClientRect()
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(value) {
				if (!this.isLoadWithChangedValue) {
					if (value.length) {
	
						if(this.multiple) {
							this.selected = value
							this.cloneOptions = this.options.filter(opt => {
								return !(value.map(val => JSON.stringify(val)).includes(JSON.stringify(opt)))
							})
						} else {
							if (value.length > 1) {
								const unique = Array.from(new Set([...value, ...this.options].map(JSON.stringify))).map(JSON.parse)
								this.selected = value.slice(0, 1)
								this.cloneOptions = unique.filter(uq => {
									return value.slice(1).map(val => JSON.stringify(val)).includes(JSON.stringify(uq))
								})
								console.warn(`[custom_select]: "v-model/value" должен принимать массив из одного элемента, т.к. свойство multiple="false". В данном случае selected будет равен [0-му элементу] все остальное уйдет в options`)
							} else {
								this.selected = value
								this.cloneOptions = [...value, ...this.options].filter(el => {
									return !(value.map(val => JSON.stringify(val)).includes(JSON.stringify(el)))
								})
							}
						}
					} else {
						this.cloneOptions = JSON.parse(JSON.stringify(this.options))
					}

					this.isLoadWithChangedValue = true

				}
			}
		},
		selected: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					if (this.$refs['selected']) this.setSelectCoords()
				})
			}
		},
		isOpenSelect() {
			if (this.$refs['selected']) this.setSelectCoords()
		}
	},
	created() {
		window.addEventListener('click', () => {
			this.isOpenSelect = false;
		});
	},
	async mounted() {
		this.$nextTick()

		window.addEventListener('resize', () => {
			if (this.$refs['selected']) this.setSelectCoords()
		})

		let start = true
		let primaryEl = this.$refs['selected'].parentElement

		while(start) {
			primaryEl = primaryEl.parentElement
			
			if (primaryEl.tagName === 'BODY') start = false
			if (getComputedStyle(primaryEl).overflow === 'scroll') {
				primaryEl.addEventListener('scroll', () => {
					if (this.isOpenSelect) this.isOpenSelect = false
				})

				start = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap');
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Inter', sans-serif;
	}

	.select-container {
		user-select: none;
		min-height: 44px;
		position: relative;

		&__selected {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 100;
		}
		&__dropdown-list {
			background-color: #fff;
			position: fixed;
			z-index: 99;
		}
	}
	.selected {
		width: 100%;
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

		&--only {
			cursor: pointer;
		}
		&__select-name {
			margin: 1.5px;
		}
		&__wrap-icons {
			width: auto;
			position: absolute;
			top: 50%;
			right: 10px;
			transform: translateY(-50%);
			display: flex;
			justify-content: space-between;
			align-items: center;

			&--has-item {
				width: 60px;
			}
		}
	}
	.select-name {
		height: 32px;
		font-size: 14px;
		font-weight: 500;
		color: #1F1F33;
		padding: 6px 12px;
		display: flex;
		justify-content: center;
		align-items: center;

		&--multiple {
			background: #F6F6FB;
			border-radius: 8px;
		}
		&__close {
			cursor: pointer;

			&:hover {
				filter: invert(.5)
			}
		}
	}
	.select-box-name {
		display: flex;
		justify-content: center;
		align-items: center;

		&--pale {
			color: #b7b7cc;
		}
		&--mr {
			margin-right: 10px;
		}
	}
	.select-title {
		padding: 0 2px 0 6px;
		display: flex;
		align-items: center;
		color: #b7b7cc;
		font-weight: 300;
	}
	.dropdown-list {
		width: 100%;
		border: 1px solid #eeedf7;
		border-top: none;
		border-bottom-right-radius: 8px;
		border-bottom-left-radius: 8px;
		color: #000;
		display: flex;
		flex-direction: column;
		box-shadow: 0 3px 7px #eeedf7;

		&::after, &::before {
			content: '';
			width: 1px;
			height: 6px;
			background-color: #eeedf7;
			position: absolute;
			top: -6px
		}
		&::after { left: -1px; }
		&::before { right: -1.2px; }
	}
	.option, .option-empty {
		position: relative;
		list-style: none;
		padding: 10px 0;
	}
	.option-empty {
		font-size: 14px;
		text-align: center;
	}
	.option {
		padding: 20px 0;
		text-align: left;

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
	.rotate-arraw-down {
		transform: rotate(0);
		transition: 0.2s ease-out;

		&--active {
			transform: rotate(-180deg);
		}
	}
	
	.dropdown-list-enter-active {
		animation: open-list .2s;

		@keyframes open-list {
			0% { opacity: 0; transform: translateY(-50px);}
			100% { opacity: 1; }
		}
	}
	.dropdown-list-leave-active {
		animation: hide-list .2s;

		@keyframes hide-list {
			100% { transform: translateY(-50px); opacity: 0; }
		}
	}
</style>