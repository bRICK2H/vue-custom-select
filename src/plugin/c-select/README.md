# Vue-custom-select

### $props:
| Name | Type | Default | Description |
| ---- | :--: | :-----: | ----------- |
| title | `String` | **Добавить** | *Название*, показывается пока нет выбранных элементов |
| value | `null` | **[ ]** | *Текущее выбранное значение*, используется в связке c @input/value |
| options | `Array` | **[ ]** | *Список options*, вида - массив примитивов или массив объектов |
| reduce | `Function` | **el => el** | *Выборка возвращаемых элементов из списка*, по ключам объекта |
| label | `String` | **label** | *Выборка элементов*, устанавливает ключ фильтрации для объекта как для поиска между value и options так и для показа в шаблоне  |
| multiple | `Boolean` | **false** | *Множественный **true** или единственный **false** выбор из списка* |
| clearable | `Boolean` | **true** | *Предоставляется возможность удалять элемент из select*, если ***true*** удаляются все элементы, если ***false*** и ***!multiple*** элементы не удаляются или если ***false*** и ***multiple*** удаляются все элементы кроме последнего |
| width | `[String, Number]` | **auto** | *Ширина select* |
| bahavior | `Boolean` | **false** | *Определяет поведение options* |
| classes | `Array` | **[ ]** | *Массив классов для select и options* добавление классов требует префикса вида - ['select-className', 'option-className']|


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