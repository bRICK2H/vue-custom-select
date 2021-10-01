# Vue-custom-select

### $props:
| Name 					| Type 					| Default 		| Description |
| ------------------ | :----------------:	| :----------: | ----------- |
| value 					| `null` 				| **any** 		| *Текущее выбранное значение* |
| placeholder 			| `String` 				| **''** 		| *Заголовок*, показывается пока нет выбранных элементов |
| raisePlaceholder 	| `Boolean` 			| **false** 	| *Устанавить заголовок над элементом поля*, при необходимости, если всегда нужно показывать заголовок |
| dublicateError 		| `Boolean` 			| **false** 	| *Показать ошибку уже выбранного параметра*, работает если **spliceable: false** |
| options 				| `Array` 				| **[ ]** 		| *Список options*, вида - массив примитивов или массив объектов |
| reduce 				| `Function` 			| **el => el** | *Выборка возвращаемых элементов из списка по ключам объекта*, так же эта выборка включает в себя зависимость на совпадение элементов которые фигурируют в select и options, если значение ключей не будут совпадать, то этот элемент не будет записан в select |
| label 					| `String` 				| **label** 	| *Фильтр значений объектов*, устанавливает выбранное значение в шаблоне select и options  |
| multiple 				| `Boolean` 			| **false** 	| *Предоставить множественный выбор элементов* |
| maxable 				| `Number` 				| **null** 		| *Максимальное колличество выбираемых опций*, работает только для параметра multiple |
| clearable 			| `Boolean` 			| **true** 		| *Удалить элемент из select*, если ***true*** удаляются все элементы, если ***false*** и ***!multiple*** элементы не удаляются или если ***false*** и ***multiple*** удаляются все элементы кроме последнего |
| spliceable 			| `Boolean` 			| **false** 	| *Удалять выбранный параметр из списка options* |
| searchable 			| `Boolean` 			| **true** 		| *Установить поле для поиска данных* в options |
| saveable 				| `Boolean` 			| **false** 	| *Сохранить значение поля при открытии* в select |
| outsideOpen 			| `false` 				| **Boolean** 	| *Открыть options извне* |
| disabled 				| `Boolean` 			| **false** 	| *Заблокировать выпадающий список options* |
| width 					| `[String, Number]` | **auto** 		| *Ширина select* |
| height 				| `[String, Number]` | **48** 		| *Максимальная высота select* |
| heightOptions 		| `[String, Number]` | **312** 		| *Максимальная высота options* |
| optionPlace 			| `center` 				| **center** 	| *Расположение названий options* |
| bahavior 				| `Boolean` 			| **false** 	| *Определяет поведение options*, если истина то список будет виден из под любого родителя снаружи |
| classes 				| `Array` 				| **[ ]** 		| *Массив классов для select и options* добавление классов требует префикса вида - ['select-className', 'option-className']|
| elClass 				| `[String, Array]`  | **''** 		| *Таргетированный класс для select*, сделан для проброса класса для form-control (вывод ошибок) |
| positionOptions 				| `String`  | **''** 		| *Флаг для определения позиции options*. По умолчанию рассчитывается автоматически. (['top', 'bottom']) |

### $events:
```js
	// Событие перед созданием нового значения, возвращется создаваемое значение
	this.$emit('option:before-create', creatable-option)
	// Событие после создания нового значения, возвращается новое созданное значение
	this.$emit('option:created', created-option)
	// Событие перед удалением значения, возвращается удаляемое значение
	this.$emit('option:before-delete', deletable-option)
	// Событие после удаления значения, возвращается удаленное значение
	this.$emit('option:deleted', deleted-option)
	// Событие фокуса, возвращается установленное значение в searchable, при saveable = true
	this.$emit('search:focus', focus-option)
	// Событие поиска, возвщается текущее набранное значение
	this.$emit('search', search-option)
	// Событие потери фокуса, возвращает оставшееся значение в searchable, при saveable = tru
	this.$emit('search:blur', blur-option)
	// Событие выбора, возвращает выбранные значения
	this.$emit('input', selectable-option)
	// Событие открытия списка options
	this.$emit('options:opened')
	// Событие закрытия списка options
	this.$emit('options:closed')
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