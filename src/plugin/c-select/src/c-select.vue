<template>
	<div class="select-container">
		<div class="option-select select-container__option-select"
			@click.stop="toggleSelect"
		>
			{{ currName }}
			<span class="option-select__icon" :style="{ backgroundImage: `url(${iconDown})` }"></span>
		</div>
		<transition name="list">
			<ul class="options-box select-container__options-box"
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
		</transition>
	</div>
</template>

<script>
export default {
	name: 'cSelect',
	props: {
		classes: {
			type: Array,
			default: () => ([])
		},
		label: {
			type: String,
			default: () => ''
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
		isOpenSelect: false,
		currValue: null,
		currName: 'Select',
		iconDown: require('@/assets/icons/down.svg')
	}),
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
	}
}
</script>

<style lang="scss">
	.select-container {
		width: 30rem;
		height: 5rem;
		position: relative;

		&__option-select {
			position: absolute;
			top: 0;
			left: 0;
		}
		&__options-box {
			position: absolute;
			top: calc(100% + .2rem);
			left: 0;
		}
	}
	.option-select {
		width: 100%;
		height: 100%;
		background: #fff;
		color: #000;
		display: flex;
		justify-content: center;
		align-items: center;

		&__icon {
			width: 2rem;
			height: 2rem;
			background-repeat: no-repeat;
			background-position: 50% 50%;
			background-size: cover;
			position: absolute;
			top: 50%;
			right: 1rem;
			transform: translateY(-50%);
		}
	}
	.options-box {
		width: 100%;
		background-color: #fff;
		color: #000;
		display: flex;
		flex-direction: column;
	}
	.option {
		text-align: left;
		padding: .5rem 0;
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