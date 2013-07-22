var _fs = require('fs.extra'),
    _path = require('path'),
    _global = catrequire("cat.global"),
    _log = _global.log(),
    _utils = catrequire("cat.utils"),
    _typedas = require("typedas"),
    _props = catrequire("cat.props"),
    _basePlugin = require("./../Base.js");

/**
 * Clean extension for CAT
 *
 * @type {module.exports}
 */
module.exports = _basePlugin.ext(function () {

    var _me = this,


        /**
         * Clean the artifacts according to the given path
         *
         * @param dirs The path to be cleaned
         * @returns {undefined}
         * @private
         */
          _clean = function (dirs) {

            function _delete(dir) {
                if (dir) {
                    try {
                        if (_fs.existsSync(dir)) {
                            _fs.rmrf(dir, function (err) {
                                if (err) {
                                    _utils.error(_props.get("cat.error").format("[clean action]", e));
                                }
                            });
                        }
                    } catch (e) {
                        _utils.error(_props.get("cat.error").format("[clean action]", e));
                    }
                }
            }

            if (!dirs) {

                _utils.error(_props.get("cat.arguments.missing").format("[cat action]", "dirs"));
                return undefined;
            }

            if (_typedas.isArray(dirs)) {
                dirs.forEach(function (dir) {
                    _delete(dir);
                });
            } else if (_typedas.isString(dirs)) {
                _delete(dirs);

            } else {
                _log.warning(_props.get("cat.arguments").format("[clean action]", typeof(dirs)));
            }

            _delete([_global.get("home").working.path, "_cat_md.json"].join("/"));
        },


        _module = {
            /**
             * Apply the clean extension.
             *
             * @param config
             *      path - The base path to clean from
             */
            apply: function (config) {

                var dirs = (config ? config.path : undefined),
                    error = "[Scan Ext] no valid configuration for 'apply' functionality";

                _me.apply(config);

                if (!dirs) {
                    _utils.error(error);
                }
                _clean(dirs);
            },

            /**
             * Plugin initialization
             *
             * @param config The passed arguments
             *          project - The project configuration object
             *          grunt - The grunt handle
             *          emitter - The emitter handle
             *
             * @param ext The extension properties
             */
            init: function (config, ext) {
                _me.initialize(config, ext);

            }
        };

    return _module;

});