fis.match('*.{js,css,png,gif}', {
    useHash: true // 开启 md5 戳 
});

fis.match('/css/theme/*.css', {
    useHash: false // 关闭 md5 戳 
});

fis.match('::package', {
    // 对 CSS 进行图片合并
    postpackager: fis.plugin('loader')
});

fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});

fis.match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置 
    optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置 
    optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置 
    optimizer: fis.plugin('png-compressor')
});
// 所有image目录下的.png，.gif文件 
fis.match('/image/(*.{png,gif,ico,jpg})', {
    //发布到/static/pic/xxx目录下 
    release: '/static/pic/$1$2$3$4'
});

fis.match('/css/*.css', {
    packTo: '/static/aio.css'
});

fis.match('::package', {
    packager: fis.plugin('map', {
        '/static/aio.js': [
            '/js/jquery.min.js',
            '/js/**.js'
        ]
    })
});
