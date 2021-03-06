var _regutils = catrequire("cat.regexp.utils");

module.exports = function () {

    return {

        /**
         * Interpret the name of the scrap.
         * Syntax
         *  ! Stop/fail the script
         *
         *
         * @param name
         */
        parseName: function (name) {

            var match = _regutils.getMatch(name, "^(.*)([!=@])(.*)$"),
                actualname = name, sign, value;

            if (match) {
                actualname = match[1];
                sign = match[2];
                value = match[3];
            }

            return {
                name: actualname,
                sign: sign,
                hint: value
            };
        }
    };

}();