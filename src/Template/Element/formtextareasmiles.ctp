<?php
/**
 * Шаблон элемента.
 * 
 * Необязательные параметры:
 *
 * @param {string} $id_wrap
 *		id обёртки.
 * @param {string} $add_wrap_class
 *		Перечень дополнительных классов через пробел.
 * @param {string} $id_submit
 *		id кнопки.
 * @param {string} $name_submit
 *		Имя кнопки, которое будет передано на сервер. Имя кнопки по умолчанию "mytext".
 * @param {string} $value_submit
 *		Надпись на кнопке. Надпись по умолчанию "Отправить".
 * @param {string} $add_submit_class
 *		Перечень дополнительных классов через пробел.
 */
?>
<div <?= (isset($id_wrap)) ? "id='" . $id_wrap . "'" : "" ?> class="wrap-textarea-smiles<?= (isset($add_wrap_class)) ? " " . $add_wrap_class : "" ?>">
	<div class="textarea-smiles">
		<div class="placeholder">Ваш комментарий</div>
		<div class="textarea" contenteditable="true" tabindex="-1"></div>
	</div>
	<div class="box-smiles"></div>
	<button type="button" class="btn-smile">
	    <svg viewBox="-1 -1 24 24" xmlns="http://www.w3.org/2000/svg">
	    	<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
	        />
	    </svg>
	</button>
</div>
<input <?= (isset($id_submit)) ? "id='" . $id_submit . "'" : "" ?> class="sub-text-smiles<?= (isset($add_submit_class)) ? " " . $add_submit_class : "" ?>" type="submit" name="<?= (isset($name_submit)) ? $name_submit : 'mytext' ?>" value="<?= (isset($value_submit)) ? $value_submit : 'Отправить' ?>">

<?php
/**
 * CSS и JS.
 */
?>
<?= $this->Html->css('Textareasmiles.textareasmiles', ['block' => true]) ?>
<?= $this->Html->script('Textareasmiles.textareasmiles', ['block' => true]) ?>
