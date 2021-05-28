# Vue-custom-select

### $props:
| Name | Type | Default | Description |
| ---- | :--: | :-----: | ----------- |
| title | `String` | **Добавить** | *Название*, показывается пока нет выбранных элементов |
| value | `Array` | **[ ]** | *Текущее выбранное значение*, используется в связке c @input/value |
| options | `Array` | **[ ]** | *Список options*, в виде массива строк или объектов |
| reduce | `Function` | **el => el** | *Выборка возвращаемых элементов из списка*, по ключам объекта |
| s_label | `String, Array, Function` | **''** | *Выборка элементов в шаблоне select*, устанавливает ключ фильтрации из объекта |
| o_label | `String, Array, Function` | **''** | *Выборка элементов в шаблоне option*, устанавливает ключ фильтрации из объекта |
| multiple | `Boolean` | **false** | *Множественный **true** или единственный **false** выбор из списка* |
| clearable | `Boolean` | **true** | *Предоставляется возможность удалять элемент из select*, если ***true*** удаляются все элементы, если ***false*** и ***!multiple*** элементы не удаляются или если ***false*** и ***multiple*** удаляются все элементы кроме последнего |
| width | `Number` | **300** | *Ширина select* |
| classes | `Array` | **[ ]** | *Массив классов для options* |

##### Example s_label / o_label
```javascript
	1. _label="string" *вернет объект с указанным ключём в _label*
	const options = [
		{ name: 'name1', age: 23 },
		{ name: 'name2', age: 33 }
	]
	_label="name" вернет [{ name: 'name1' }, {name: 'name2'}]

	2. _label="array" *вернет объект с указанными ключами в _label*
	const options = [
		{ name: 'name1', age: 23, job: 'front' },
		{ name: 'name2', age: 33, job: 'back' }
	]
	_label="[age, job]" вернет [{ age: 23, job: 'front' }, { age: 33, job: 'back' }]

	3. _label="function" *вернет объект с передаваемыми ключaми из функции _label*
	const options = [
		{ name: 'name1', age: 23, job: 'front' },
		{ name: 'name2', age: 33, job: 'back' }
	]
	_label="val => val.age" вернет [{ age: 23}, { age: 33}]
	_label="val => ({age: val.age, name: val.name})" вернет [{ age: 23, name: 'name1'}, { age: 33, name: 'name2'}]

	*Аналогичным образом работает функция reduce*
```

### $slots:
###### Ручная модификация вывода select и option в шаблоне
```html
	<c-select>
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
```