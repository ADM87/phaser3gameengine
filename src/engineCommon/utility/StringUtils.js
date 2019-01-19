const StringUtils = {
    format:
        function(str, ...params) {
            for (var i = 0; i < params.length; ++i) {
                str = str.replace("%" + i, params[i]);
            }
            return str;
        }
};

module.exports = StringUtils;