var _utils = catrequire("cat.utils"),
    _global = catrequire("cat.global"),
    _props = catrequire("cat.props"),
    _log = catrequire("cat.global").log(),
    _typedas = require("typedas"),
    _path = require("path"),
    _minimatch = require("minimatch");

/**
 * Abstract Base plugin functionality
 *
 * @type {module.exports}
 */
module.exports = function () {

    // TODO consider auto generate straightforward getter / setter
    function _base(proto) {

        proto._disabled = false;
        proto._to = null;
        proto._from = null;
        proto._data = null;

        proto.dataInit = function (data) {
            if (data) {
                this._data = data;
                _utils.copyObjProps(data, this);
            }
        };

        proto.isDisabled = function () {
            return this._disabled;
        };

        proto.setDisabled = function (bol) {
            this._disabled = bol;
        };

        proto.setTo = function (to) {
            this._to = to;
        };

        proto.getTo = function () {

            var toFolder;
            if (!this._to) {
                toFolder = (this._data ? this._data.to : undefined);
                if (!toFolder || !(toFolder && toFolder.path)) {
                    toFolder = {path: _global.get("home").working.path};
                    _log.info(_props.get("cat.project.property.default.value").format("[base plugin]", "path", toFolder.path));
                }
                this.setTo(toFolder.path);
            }
            return this._to;
        };

        proto.getFrom = function () {
            return this._from;
        };

        proto.getFilters = function () {
            return this.filters;
        };

        /**
         * Filters for excluding/include file extensions
         *
         * @param filters
         * @param typeObj The reference object of type file|folder
         * @returns {boolean}
         */
        proto.applyFileExtFilters = function (filters, typeObj) {

            var exitCondition = 0,
                me = this;

            function patternMatch() {
                if (!this.pattern) {
                    return false;
                }
                var size = this.ext.length, idx = 0, item;

                for (; idx<size; idx++) {
                    item = this.pattern[idx];
                    if (_minimatch(typeObj, item, { matchBase: true })) {
                        return true;
                    }
                }
                return false;
            }

            function extMatch() {

                if (!this.ext) {
                    return undefined;
                }
                var extName = _path.extname(typeObj),
                    size = this.ext.length, idx = 0, item,
                    isPattern;

                for (; idx<size; idx++) {
                    item = this.ext[idx];
                    if ( (item === extName || item === "*") ) {

                        // take the parent into the condition
                        if (this.pattern) {
                            isPattern = patternMatch.call(this);
                            if (!isPattern) {
                                continue;
                            }
                        }

                        if (!this.exclude) {
                            exitCondition = 0;
                        } else {
                            exitCondition = 1;
                        }

                    }
                }
            }

            if (typeObj && filters && _typedas.isArray(filters)) {

                filters.forEach(function (filter) {
                    if (filter) {
                        filter.apply(function () {
                            extMatch.call(this);
                        });
                    }
                });

                if (exitCondition > 0) {
                    return true;
                }

            }

            return false;
        };

    }

    return {
        ext: function (fn) {
            if (fn) {
                _base(fn.prototype);
            }
            return fn;
        }
    }

}();