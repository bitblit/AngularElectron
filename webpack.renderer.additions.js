module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                    {
                        loader: "angular2-template-loader"
                    }
                ]
            },
            {
                test: /\.(html)$/,
                loader: "html-loader",
                options: {
                    minimize: {
                        removeAttributeQuotes: false,
                        keepClosingSlash: true,
                        caseSensitive: true,
                        conservativeCollapse: true,
                    }
                }
            }
        ]
    }
};
