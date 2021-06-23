<template>
	<div class="select-container"
		:class="[...getSelectClass]"
		:style="setStyleToSelect"
		ref="select-container"
	>

		<!-- Select -->
		<div class="v-selected select-container__v-selected" :class="[
				{ 'v-selected--only': !multiple || (!Object.keys(selected).length && !cloneOptions.length)},
				{ 'v-selected--active': isOpenSelect },
			]"
			:tabindex="tabindex"
			ref="selected"
			@blur="blur($event)"
			@keydown.enter="enterToFocus"
			@keydown.up.down.prevent="arrowToFocus($event)"
			@click="(!multiple && cloneOptions.length) || (!Object.keys(selected).length && !cloneOptions.length)
				? toggleSelect()
				: false
			">
			<div v-if="!Object.keys(selected).length"
				class="select-title v-selected__select-title"
				key="title"
			>
				* {{ title }}

			</div>
			<template v-else>
				<div class="select-name v-selected__select-name" :class="{'select-name--multiple': multiple}"
					v-for="(select, i) of getSelected" :key="`sl${i}`">
					<span class="select-box-name select-name__select-box-name"
						:class="{
							'select-box-name--pale': !multiple && isOpenSelect,
							'select-box-name--multiple': multiple,
							'select-box-name--mr': multiple && (!clearable && Object.keys(selected).length !== 1 || clearable)
						}"
						:title="innerReduce(select)"
					>
						<slot name="select"
							v-bind="select"
						>
							{{ innerReduce(select) }}
						</slot>
					</span>
					<div>
						<i-close v-if="multiple && (!clearable && Object.keys(selected).length !== 1 || clearable)"
							class="select-name__close" @click.native="drop(i)" />
					</div>
				</div>
			</template>

			<template v-if="multiple">
				<i-add v-if="cloneOptions.length"
					class="multiple-add"
					:class="[
						{ 'multiple-add--hover': cloneOptions.length },
					]"
					@click.native="cloneOptions.length
						? toggleSelect()
						: false
					"
				/>
			</template>
			<template v-else>
				<div class="v-selected__wrap-icons"
					:class="{'v-selected__wrap-icons--has-item': Object.keys(selected).length && clearable}">
					<template v-if="clearable">
						<i-close v-if="Object.keys(selected).length" @click.native.stop="drop(0)" />
						<i-hor-line v-if="Object.keys(selected).length" />
					</template>
					<i-arrow-down class="rotate-arraw-down" :class="{'rotate-arraw-down--active': isOpenSelect}" />
				</div>
			</template>
		</div>

		<!-- Optiions -->
		<transition name="dropdown-list">
			<ul v-show="isOpenSelect" class="dropdown-list select-container__dropdown-list"
				:class="[...getOptinsClass, { 'dropdown-list--active': isOpenSelect }]"
				:style="[setStylesToDropDownList]"
				:ref="uniquedd"
				:tabindex="tabindex">
				<li v-if="!Object.keys(selected).length && !cloneOptions.length" class="option-empty">
					Данные отсутствуют
				</li>

				<template v-else>
					<li class="option" :class="{ 'option--arrow': currOptionArrow === i + 1 }"
						v-for="(option, i) of cloneOptions"
						:key="i"
						@mouseenter="hoverOption(i + 1)"
						@click="select(option)"
						:title="innerReduce(option)">

						<div class="option__name">
							<slot name="option" v-bind="option">
								{{ innerReduce(option) }}
							</slot>
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
		name: 'iziSelect',
		components: {
			iAdd,
			iClose,
			iHorLine,
			iArrowDown
		},
		props: {
			title: {
				type: String,
				default: 'Добавить'
			},
			value: null,
			options: {
				type: Array,
				default: () => ([])
			},
			reduce: {
				type: Function,
				default: option => option,
			},
			label: {
				type: [String, Array, Function],
				default: 'label'
			},
			multiple: {
				type: Boolean,
				default: false
			},
			clearable: {
				type: Boolean,
				default: true
			},
			width: {
				type: [String, Number],
				default: 'auto'
			},
			behavior: {
				type: Boolean,
				default: false
			},
			classes: {
				type: Array,
				default: () => ([])
			}
		},
		data: () => ({
			uniquedd: `dropdown-list:${Math.random()}`,
			name: 'select',
			active: true,
			isOpenSelect: false,
			tabindex: 0,
			currOptionArrow: 1,
			selected: [],
			cloneOptions: [],
			currSelectCoords: {},
		}),
		computed: {
			getSelectClass() {
				return this.classes.filter(curr => /^select-/.test(curr))
			},
			getOptinsClass() {
				return this.classes.filter(curr => /^option-/.test(curr))
			},
			setStylesToDropDownList() {
				const { top, left, width, height } = this.currSelectCoords

				return {
					width: `${width}px`,
					top: this.behavior
						? `${top + height - 2}px`
						: `${height - 2}px`,
					left: this.behavior
						? `${left}px`
						: 0
				}
			},
			setStyleToSelect() {
				return {
					width: this.width === 'auto' ? '100%' : `${+this.width}px`,
					minWidth: `${+this.width}px`,
				}
			},
			getSelected() {
				return this.multiple
					? this.selected
					: Array.isArray(this.value) ? [this.value[this.value.length - 1]] : [this.value]
			},
			modifyOptions() {
				const isArrayOption = this.options.some(curr => Array.isArray(curr))
				return isArrayOption ? this.options.map(curr => curr[0]) : this.options
			},
			isExistLabel() {
				if ('label' in this.$options.propsData) {
					if (this.arrayElementType(this.options) === 'object') {
						if (Array.isArray(this.value) && this.arrayElementType(this.value) === 'object') {
							const isExistLabel = this.value.some(curr => Object.keys(curr).includes(this.label))
							
							if (isExistLabel) {
								const isExistValueOfLabel = this.value.some(curr => {
									return this.options.some(c => Object.values(c).includes(curr[this.label]))
								})
								return isExistValueOfLabel
									? { result: true } : { result: false, error: 'diff value' }
							} else {
								const isExistValues = this.value.map(Object.values)
									.some(currVal => {
										return currVal.some(v => {
											return this.options.map(Object.values).some(o => {
												return o.includes(v)
											})
										})
									})
								return isExistValues
									? { result: false, error: 'dnt exist' } : { result: false, error: 'nothing exist' }
							}
						} else if (!Array.isArray(this.value) && typeof this.value === 'object') {
							const isExistLabel = Object.keys(this.value).includes(this.label)

							if (isExistLabel) {
								const isExistValueOfLabel = this.options.some(curr => {
									return Object.values(curr).includes(this.value[this.label])
								})
								return isExistValueOfLabel
									? { result: true } : { result: false, error: 'diff value' }
							} else {
								const isExistValues = this.options.some(curr => {
									return Object.values(this.value).some(v => {
										return Object.values(curr).includes(v)
									})
								})

								return isExistValues
									? { result: false, error: 'dnt exist' } : { result: false, error: 'nothing exist' }
							}
						} else {
							return { result: true }
						}
					} else {
						if (Array.isArray(this.value) && this.arrayElementType(this.value) === 'object') {
							const isExistLabel = this.value.some(curr => Object.keys(curr).includes(this.label))
							
							if (isExistLabel) {
								const isExistValueOfLabel = this.value.some(curr => this.options.includes(curr[this.label]))
								
								return isExistValueOfLabel
									? { result: true } : { result: false, error: 'diff value' }
							} else {
								const isExistValues = this.value.some(curr => {
									return Object.values(curr).some(v => {
										return this.options.includes(v)
									})
								})

								return isExistValues
									? { result: false, error: 'dnt exist' } : { result: false, error: 'nothing exist' }
							}
						} else if (!Array.isArray(this.value) && typeof this.value === 'object') {
							const isExistLabel = Object.keys(this.value).includes(this.label)

							if (isExistLabel) {
								const isExistValueOfLabel = this.options.includes(this.value[this.label])
								
								return isExistValueOfLabel
									? { result: true } : { result: false, error: 'diff value' }
							} else {
								const isExistValues = this.options.some(curr => Object.values(this.value).includes(curr))

								return isExistValues
									? { result: false, error: 'dnt exist' } : { result: false, error: 'nothing exist' }
							}
						} else {
							return { result: true }
						}
					}
	
				} else {
					return { result: false }
				}
			}
		},
		methods: {
			select(option) {
				this.multiple
					? this.selected.push(option)
					: this.selected.splice(0, 1, option)
			},
			drop(i) {
				this.setActiveSelect()

				this.multiple
					? this.selected.splice(i, 1)
					: this.selected = []
			},
			enterToFocus() {
				if (this.cloneOptions.length) {
					this.toggleSelect()
				}

				if (!this.isOpenSelect) {
					this.select(this.cloneOptions[this.currOptionArrow - 1])
				}
			},
			arrowToFocus(e) {
				if (!this.isOpenSelect) return

				const { key } = e

				this.currOptionArrow += key === 'ArrowUp' ? -1 : 1
				if (this.currOptionArrow > this.cloneOptions.length) {
					this.currOptionArrow = 1
				} else if (this.currOptionArrow <= 0) {
					this.currOptionArrow = this.cloneOptions.length
				}
			},
			hoverOption(index) {
				this.currOptionArrow = index
			},
			blur(e) {
				const { relatedTarget } = e

				if (relatedTarget && relatedTarget.classList.contains('dropdown-list')) {
					this.$refs['selected'].focus()
					return
				}

				this.isOpenSelect = false
			},
			outerReduce(arr) {
				return arr.map(c => this.reduce(c) === undefined ? c : this.reduce(c))
			},
			innerReduce(el) {
				return !Array.isArray(el) && typeof el === 'object' && this.label in el
					? el[this.label] : el
			},
			toggleSelect() {
				this.isOpenSelect = !this.isOpenSelect
			},
			setCurrSelectCoords() {
				const { top, left, width } = this.$refs['selected'].getBoundingClientRect()
				const height = this.$refs['selected'].offsetHeight

				this.$nextTick(() => {
					this.$set(this.currSelectCoords, 'top', top)
					this.$set(this.currSelectCoords, 'left', left)
					this.$set(this.currSelectCoords, 'width', width)
					this.$set(this.currSelectCoords, 'height', height)
				})
			},
			setActiveSelect() {
				this.$parent.$children.forEach(curr => {
					if (curr.name === 'select' && JSON.stringify(this.value) === JSON.stringify(curr.value)) {
						curr.active = false
					}
				})

				this.active = true
			},
			isChosenExist(value) {
				return JSON.stringify(this.getCurrIndices(value)) === JSON.stringify(this.getCurrIndices(this.selected))
			},
			arrayElementType(data) {

				if (!Array.isArray(data)) return typeof data
				
				return data.reduce((acc, curr) => {
					return Array.isArray(curr) ? 'array' : typeof curr
				}, '')
			},
			getCurrIndices(value, v = 0) {
				return this.modifyOptions.reduce((acc, curr, i) => {
					if (value !== undefined) {
						if (Array.isArray(value)) {
							/**
							 * TODO: Value вида массив
							 */

							if (this.arrayElementType(value) === 'array') {
								// need on no ?
							} else if (this.arrayElementType(value) === 'object') {

								if ((this.arrayElementType(this.modifyOptions) === 'object')) {
									if (this.isExistLabel.result) {
										// ? Сравнение значений value из ключа label с значениями объектов option
										if (Object.values(curr).some(curr => value.map(c => c[this.label]).includes(curr))) {
											acc.push(i)
										}
									} else {
										// ? Сравнение значений value с значениями объектов option
										const isExistValues = value.some(c => {
											return Object.values(c).some(val => {
												return Object.values(curr).includes(val)
											})
										})

										if (value.map(JSON.stringify).includes(JSON.stringify(curr)) || isExistValues) {
											acc.push(i)
										}
									}
								} else {
									if (this.isExistLabel.result) {
										// ? Сравнение значений value из ключа label с примитивными значениями option
										if (value.map(c => c[this.label]).includes(curr)) acc.push(i)
									} else {
										// ? Сравнение значений value с примитивными значениями option
										const isExistValues = value.some(c => {
											return Object.values(c).includes(curr)
										})

										if (isExistValues) acc.push(i)
									}
								}
							} else {
								if ((this.arrayElementType(this.modifyOptions) === 'object')) {
									// ? Сравнение value как массив примитовов со значениями объектов option
									if (Object.values(curr).some(mo => value.includes(mo))) {
										acc.push(i)
									}
								} else {
									// ? Сравнение value как массив примитовов с примитивами option
									if (value.includes(curr)) acc.push(i)
								}
							}

						} else if (typeof value === 'object') {
							/**
							 * TODO: Value вида объект
							 */

							if (this.arrayElementType(this.modifyOptions) === 'object') {
								if (this.isExistLabel.result) {
									/**
									 * ? Объекты разняться, сравнение по "lable"
									 * * Сравнение из предоставленных ключей "lable" c объектами option
									 */
									if (value[this.label] === curr[this.label]) acc.push(i)
								} else {
									/**
									 * ? Объекты разняться, сравнение по имеющимся значениям
									 * * Сравнение из имеющихся значения у объекта value со значениями объектов option
									 */

									if (JSON.stringify(curr) === JSON.stringify(value)
										|| Object.values(curr).some(curr => Object.values(value).includes(curr))) {
										acc.push(i)
									}
								}
							} else {
								if (this.isExistLabel.result) {
									/**
									 * ? Сравнение значения ключа label с значениями option
									 */
									if (value[this.label].includes(curr)) acc.push(i)
								} else {
									/**
									 * ? Сравнение значений кличей value со значениями option
									 */
									if (Object.values(value).includes(curr)) acc.push(i)
								}
							}

						} else {
							/**
							 * TODO: value вида примитив
							 */

							if (this.arrayElementType(this.modifyOptions) === 'object') {
								// ? Option вида объект
								if (Object.values(curr).includes(value)) acc.push(i)
							} else {
								// ? Option вида примитив
								if (value === curr) acc.push(i)
							}

						}
					}
					
					return acc
				}, [])
			},
		},
		watch: {
			value: {
				immediate: true,
				deep: true,
				handler(value) {
					if (!this.isChosenExist(value)) {
						this.selected = this.modifyOptions.filter((c, i) => this.getCurrIndices(value, 1).includes(i))
					}
				}
			},
			selected: {
				immediate: true,
				deep: true,
				handler(selected) {
					this.isOpenSelect = false
					this.cloneOptions = this.modifyOptions.filter((c, i) => !this.getCurrIndices(selected).includes(i))

					if (this.active) {
						const isObjectValue = Array.isArray(this.value)
							? this.arrayElementType(this.value) === 'object'
							: typeof this.value === 'object'


						const outerResult = 'reduce' in this.$options.propsData && isObjectValue
							? selected.map(curr => this.reduce(curr)) : selected

						this.$emit(
							'input',
							this.multiple
								? outerResult
								: outerResult[0]
						)
					}
				}
			},
			isOpenSelect(opened) {
				this.setActiveSelect()
				this.setCurrSelectCoords()

				if (this.behavior && opened) {
					const DOMLocalNames = Object.values(document.body.children).map(curr => curr.localName)

					if (!(DOMLocalNames.includes('drop-down-container'))) {
						const DOMRef = document.createElement('drop-down-container')
						document.body.appendChild(DOMRef)
					}

					const DropDownContainer = document.querySelector('drop-down-container')
					this.$refs[this.uniquedd].setAttribute('unique-name', this.uniquedd)
					DropDownContainer.appendChild(this.$refs[this.uniquedd])
				}
			},
		},
		created() {
			const { result, error } = this.isExistLabel

			if (!result) {
				if (error === 'dnt exist') {
					console.warn(`[izi-select]: Выбранный label="${this.label}" не существует в объекте ключей value! Поиск реализуется по совпадению переданных значений!`)
				} else if (error === 'diff value') {
					console.warn(`[izi-select]: Значение value из выбранного label="${this.label}" не совпадают со значениями из option!`)
				} else if (error === 'nothing exist') {
					console.warn(`[izi-select]: Ни переданный label="${this.label}", ни значения в value и option не совпадают!`)
				} else {
					// другие ошибки
				}
			}
		},
		async mounted() {
			await this.$nextTick()

			// window.addEventListener('resize', () => {
			// 	if (this.$refs['selected']) this.setSelectCoords()
			// })

			if (this.behavior && this.$refs['select-container']) {
				let start = true
				let primaryEl = this.$refs['select-container'].parentElement

				while (start) {
					primaryEl = primaryEl.parentElement
					const primaryElOverfow = getComputedStyle(primaryEl).overflow

					if (primaryEl.tagName === 'BODY') start = false
					if (['auto', 'scroll', 'hidden scroll'].includes(primaryElOverfow)) {
						primaryEl.addEventListener('scroll', () => {
							if (this.isOpenSelect && this.behavior) {
								this.setCurrSelectCoords()
							}
						})

						start = false
					}
				}
			}
		},
		beforeDestroy() {
			if (this.behavior) {
				const DropDownContainer = document.querySelector('drop-down-container')

				if (DropDownContainer && DropDownContainer.children.length) {
					DropDownContainer.children.forEach(curr => {
						if (curr.getAttribute('unique-name') === this.uniquedd) {
							DropDownContainer.removeChild(curr)
						}
					})
				}
			}
		},
	}
</script>

<style lang="scss">
	// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap');

	.select-container * {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Inter', sans-serif;
	}

	.select-container {
		user-select: none;
		min-height: 44px;
		position: relative;
		border-radius: 8px;

		&__v-selected {
			position: relative;
			top: 0;
			left: 0;
			z-index: 1000;
		}

		&__dropdown-list {
			position: absolute;
			left: 0;
			z-index: 1000;
			background-color: #fff;
		}
	}

	.v-selected {
		width: 100%;
		min-height: 44px;
		background: #fff;
		border: 2px solid #eeedf7;
		border-radius: 8px;
		padding: 2px;
		color: #000;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		&:focus {
			outline: none;
		}

		&:focus-visible {
			border: 2px solid #dfdfdf;
		}

		&--only {
			cursor: pointer;
		}

		&--active {
			border: 2px solid #dfdfdf;
			border-bottom: 2px solid transparent;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
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
				height: 100%;
				background: #fff;
			}
		}
	}

	.select-name {
		width: inherit;
		height: 32px;
		font-size: 14px;
		font-weight: 500;
		color: #1F1F33;
		padding: 6px 12px;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		&--multiple {
			width: auto;
			max-width: calc(100% - 40px);
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
		width: calc(100% - 70px);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;

		&--multiple {
			width: auto
		}

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
		font-family: 'Inter', sans-serif;
		border: 2px solid #eeedf7;
		border-top: none;
		padding-top: 3px;
		border-bottom-right-radius: 8px;
		border-bottom-left-radius: 8px;
		color: #000;
		display: flex;
		flex-direction: column;
		box-shadow: 0 8px 7px -7px #828282;

		&--active {
			border: 2px solid #dfdfdf;
			border-top: none;
			z-index: 1010;
		}
	}

	.option,
	.option-empty {
		position: relative;
		list-style: none;
		cursor: pointer;
		padding: 10px 0;
	}

	.option-empty {
		font-size: 14px;
		text-align: center;
	}

	.option {
		padding: 20px 0;
		text-align: left;

		&--arrow {
			background-color: #dfdfdf;
		}

		&__name {
			width: 100%;
			height: auto;
			display: inline-block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			padding: 0 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
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
		animation: open-list .4s;

		@keyframes open-list {
			0% {
				opacity: 0;
				transform: translateX(50px);
			}

			20% {
				box-shadow: 0 3px 7px #fff;
			}

			100% {
				opacity: 1;
			}
		}
	}

	.dropdown-list-leave-active {
		animation: hide-list .4s;

		@keyframes hide-list {
			40% {
				box-shadow: 0 3px 7px #fff;
			}

			100% {
				transform: scale(0);
				opacity: 0;
				z-index: 999;
			}
		}
	}
</style>