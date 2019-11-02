(function( $ ) {
    $( document ).ready(function() {

        /**
         * Виджет "textareasmiles".
         */
        $.widget("element.textareasmiles", $.lib.ajax, {

            /**
             * Список значений и настроек по умолчанию.
             *
             * @param {int} k
             *      Коэффициент высоты текстового поля, когда оно находится в фокусе.
             * @param {int} height_box_smiles
             *      Высота панели в "px" со смайлами.
             * @param {string} urlAJAX
             *    Адрес запроса AJAX кода.
             * @param {string} method
             *    Метод отправки данных на сервер ( GET|POST ).
             * @param {string} datatype
             *    Тип возвращаемого объекта AJAX-кодом ( html|json|xml|script|text ).
             * @param {string} openside
             *    В какую сторону раскрывать панель со смайликами (bottom|top|auto).
             */
            options: {
                k: 3.2,
                height_box_smiles: 50,
                urlAJAX: null,
                method: "POST",
                datatype: "json",
                openside: "top",
            },

            /**
             * @type {boolean}
             *     Указывает на отображение панели со смайликами: "false" - панель скрыта; "true" - панель показана.
             */
            _flagsmile: false,

            /**
             * @type {boolean} _flagtextarea
             *     Указывает на отображение текстового поля для ввода текста: "false" - показан плейсхолдер, а текстовое поле скрыто; "true" - текстовое поле показано, а плейсхолдер скрыт.
             */
            _flagtextarea: false,

            /**
             * Конструктор плагина.
             */
            _create: function() {

                // Основные объекты.
                this.div_placeholder = this.element.find('div.textarea-smiles').find('div:first');
                this.div_textarea = this.element.find('div.textarea-smiles').find('div:last[contenteditable="true"]');
                this.btn_smile = this.element.find('button.btn-smile');
                this.box_smiles = this.element.find('div.box-smiles');
                this.sub_text_smiles = this.element.next();

                // Устанавливаем необходимые параметры для AJAX-запроса.
                if (this.options.urlAJAX) {
                    this._urlAJAX = this.options.urlAJAX;
                    this._method = this.options.method;
                    this._datatype = this.options.datatype;
                }
                else return false;

                // Задаём глобальный объект, впоследствии в него будет добавляться текст из формы, а также другими виджетами
                // дополнительные данные, которые необходимо передать на сервер.
                if (typeof(window.datatextareasmiles) == 'undefined') window.datatextareasmiles = {};

                // Запрещаем фокусироваться на блоке со смайликами.
                this.box_smiles.attr({
                    unselectable: 'on',
                    onselectstart: 'return false;',
                    onmousedown: 'return false;'
                });

                // Создаём елементы смайликов и добавляем их в панель.
                let fragment = document.createDocumentFragment();
                let box_sm = this.box_smiles;
                for (let i = 1; i <= 207; i++) {
                    let span = document.createElement('span');
                    span.classList.add('emoji');
                    span.classList.add('e' + i);
                    fragment.appendChild(span);
                }
                box_sm[0].appendChild(fragment);

                // События.
                this.div_placeholder
                    .on('click', {
                        this_: this
                    }, function(event) {
                        event.data.this_._showTextarea();
                    });

                $(document)
                    .on('click', {
                        this_: this
                    }, function(event) {
                        var _this_ = event.data.this_;
                        if (_this_._flagtextarea === false) {
                            var len = _this_.div_textarea.text().length;
                            if (len == 0) {
                                _this_.div_textarea.hide();
                                _this_.div_placeholder.show();
                            }
                            _this_.box_smiles.hide();
                            _this_._flagsmile = false;
                        }
                        _this_._flagtextarea = false;
                    });

                this.div_textarea
                    .on('click', {
                        this_: this
                    }, function(event) {
                        event.data.this_._flagtextarea = true;
                    });

                this.box_smiles.find('span')
                    .on('click', {
                        this_: this
                    }, function(event) {
                        let _this_ = event.data.this_;
                        let obj = $(this);
                        _this_.div_textarea.focus();
                        // Вставляем смайлик.
                        let sel, range;
                        sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            range = sel.getRangeAt(0);
                            range.deleteContents();
                            let el = document.createElement("div");
                            el.innerHTML = ' <img class="emoji ' + event.target.classList[1] + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAAtJREFUCNdjIBEAAAAwAAFletZ8AAAAAElFTkSuQmCC"> ';
                            let frag = document.createDocumentFragment(), node, lastNode;
                            while ( (node = el.firstChild) ) {
                                lastNode = frag.appendChild(node);
                            }
                            range.insertNode(frag);
                            if (lastNode) {
                                range = range.cloneRange();
                                range.setStartAfter(lastNode);
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }
                    });

                this.btn_smile
                    .on('click', {
                        this_: this
                    }, function(event) {
                        let _this_ = event.data.this_;
                        _this_._flagtextarea = true;
                        if (_this_._flagsmile) {
                            // Панель со смайлами показана, необходимо её скрыть.
                            _this_.box_smiles.hide();
                            _this_._flagsmile = false;
                        } else {
                            // Панель со смайлами скрыта, необходимо её показать.
                            let len = _this_.div_textarea.text().length;
                            if (len == 0) {
                                // В текстовом поле отсутствует текст.
                                _this_.div_placeholder.hide();
                                _this_._showTextarea();
                            }
                            _this_.div_textarea.trigger('resize');
                            // Показываем панель со смайликами.
                            _this_._showSmiles();
                        }
                    });

                this.div_textarea
                    .on('input', {
                        this_: this
                    }, function(event) {
                        let _this_ = event.data.this_;
                        let lentext = $(this).html().length;
                        if (lentext > 0) _this_.sub_text_smiles.show();
                        else _this_.sub_text_smiles.hide();
                    });

                this.sub_text_smiles
                    .on('click', {
                        this_: this
                    }, function(event) {
                        let _this_ = event.data.this_;
                        let content = _this_.div_textarea.html();
                        // Заменяем все изображения смайликов на шаблон, содержащий в себе класс "е" из тега изображения с его значением.
                        // Например: [e102].
                        content = content.replace(/<img class="emoji\s{1}/g, '[');
                        content = content.replace(/"\ssrc="[^"]+"(\sstyle="[^"]+")*>/g, ']');
                        // Пустую строку не отправлять на сервер.
                        if (content.length == 0) return false;
                        // Добавляем текст в глобальный объект.
                        window.datatextareasmiles.text = content;
                        _this_._lockAjax( window.datatextareasmiles, 'mytextarea' );
                        return false;
                    });
                    
                this.div_textarea
                    .on('resize',{
                        this_: this
                    }, function(event) {
                        let _this_ = event.data.this_;
                        // Устанавливаем ширину панели со смайлами такую же, как у текстового поля.
                        let width_textarea = _this_.div_textarea.width();
                        _this_.box_smiles.width(width_textarea);
                        // Устанавливаем высоту панели со смайликами в зависимости от настроек.
                        _this_.box_smiles.height(_this_.options.height_box_smiles);
                    });

            },

            /**
             * Показываем панель со смайлами внизу или вверху от текстового поля, в зависимости от настроек.
             */
            _showSmiles: function() {
                if (this.options.openside == 'bottom' || this.options.openside == 'top') {
                    this._showSmilesBottomTop(this.options.openside);
                }
                if (this.options.openside == 'auto') {
                    // Определяем автоматически в какую сторону паказывать панель со смайлами.
                    let H = document.documentElement.clientHeight;
                    let h = this.div_textarea.height();
                    let scroll = this.div_textarea.offset().top;
                    let offset = scroll + (h / 2);
                    if ((H / 2) > offset) this._showSmilesBottomTop('bottom');
                    if ((H / 2) < offset) this._showSmilesBottomTop('top');
                    if ((H / 2) == offset) this._showSmilesBottomTop('bottom');
                }
            },

            /**
             * Добавляет стили к панели со смайликами, открывая панель вверх или вниз.
             *
             * @param {string} side
             *      Сторона открытия панели со смайликами (bottom|top).
             */
            _showSmilesBottomTop: function(side) {
                let height_textarea = this.div_textarea.innerHeight();
                if (side == 'bottom') {
                    this.box_smiles.css('top', height_textarea + 'px');
                }
                if (side == 'top') {
                    let h = this.box_smiles.outerHeight(true);
                    this.box_smiles.css('top', '-' + h + 'px');
                }
                this.box_smiles.show();
                this._flagsmile = true;
            },

            /**
             * Показывает текстовое поле для ввода текста.
             */
            _showTextarea: function() {
                this._flagtextarea = true;
                // Определяем высоту элемента плейсхолдера.
                let height_placeholder = this.div_placeholder.height();
                // Скрываем плейсхолдер и показываем текстовое поле с установкой фокуса.
                this.div_placeholder.hide();
                this.div_textarea.show().height(height_placeholder * this.options.k);
                this.div_textarea.focus();
            },

            /**
             * Срабатывает перед отправкой AJAX-запроса.
             */
            _mytextareaSend: function() {
                // Делаем кнопку отправки и текстовое поле не активным.
                this.sub_text_smiles.val('Отправляется').prop('disabled', true);
                this.div_textarea.prop('contenteditable', false);
                // Оповещаем все виджеты о наступлении события.
                $(document).trigger('beforesendtextareasmiles');
            },

            /**
             * Принимает данные от AJAX-запроса.
             *
             * @param {object} data
             *      Данные, которые вернулись от AJAX запроса.
             */
            _mytextareaSuccess: function(data) {
                // Делаем кнопку отправки и текстовое поле активным.
                this.sub_text_smiles.val('Отправить').prop('disabled', false);
                this.div_textarea.prop('contenteditable', true);
                // Очищаем текстовое поле.
                this.div_textarea.html('');
                // Оповещаем все виджеты о наступлении события.
                $(document).trigger('successfullysendtextareasmiles', [data]);
            },

        });

    });
})( jQuery );
