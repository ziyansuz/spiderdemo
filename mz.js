'use strict';

const Crawler = require('crawler');

// var c = new Crawler({
//     maxConnections : 10,  // 最大链接数 10
//     retries: 5,  // 失败重连5次
//     // This will be called for each crawled page
//     callback : function (error, res, done) { // 执行下面的回调，这个回调不会执行
//         if(error){
//             console.log(error);
//         }else{
//             var $ = res.$;
//             console.log($("title").text());
//         }
//         done();
//     }
// });
//
// c.queue([{
//     uri: 'https://www.mzitu.com/page/1/',
//     jQuery: true,
//     callback: function (error, res, done) {
//         if(error){
//             console.log(error);
//         }else{
//             var $ = res.$;   // 这就可以想使用jQuery一个解析DOM了
//             var total_pag = 0;
//             // .pagination .nav-links .page-numbers
//             // $('#wp_page_numbers li a').each(function(index,item){
//             $('.page-numbers').each(function(index,item){
//                 console.log(item)
//                 if ($(item).text() == '末页') {
//                     total_pag = $(item).attr('href');
//                     var regexp = /[0-9]+/g;
//                     total_pag = total_pag.match(regexp)[0]; // 总页数
//                     console.log(total_pag)
//                 }
//             })
//         }
//         done();
//     }
// }]);
let c = new Crawler({
    // 在每个请求处理完毕后将调用此回调函数
    maxConnections: 10,
    retries: 5,  // 失败重连5次
});

function spiderItem() {
    return new Promise((resolve, reject) => {
        c.queue([{
            uri: 'https://www.mzitu.com/page/1/',
            headers: {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'},
            callback: function (error, res, done) {
                if (error) {
                    reject(error);
                } else {
                    resolve(res)
                }
                done();
            }
        }]);
    })
}

let main = async () => {
    let res = await spiderItem()
    let $ = res.$;
    // console.log($("title").text());
    let totalPage = 0;
    $('.page-numbers').each((index, item) => {
        if (index === 5) {
            totalPage = $(item).text()
        }
    })
    $('li > span').each(function (index, item) {
        let title = $(item).find('a').text()
        let href = $(item).find('a').attr('href'); // 获取路径uri
        let regexp = /[0-9]+/g;
        console.log(href)
        let artice_id = href.match([0-9]); // 获取文章ID
        // let artice_id = regexp.exec(href); // 获取文章ID
        console.log(artice_id)
        // console.log(uri)
        // console.log(href)
    })
    var tempArray = [];
    // var q = async.queue(function(task, callback) {
    // var q = tempArray.queue(function(task, callback) {
    //     console.log('hello ' + task.name);
    //     downloadContent(task.name,c); // 每个人物都会执行一个这个
    //     callback();
    // }, totalPage);
    // q.drain = function() {
    //     console.log('all items have been processed');
    // };
    // for (var i = 1; i <= totalPage; i ++) {
    //     var item = {
    //         name: i  // 队列中的每个人物都有个 name
    //     }
    //     tempArray.push(item);
    // }
    // // 添加进队列
    // q.push(tempArray, function(err) {
    //     console.log('finished processing item');
    // });
    // console.log(totalPage);  // 72
}


// #pins
function downloadContent(i) {
    var uri = 'https://www.mzitu.com/page/' + i;
    // console.log(uri)
    c.queue([{
        uri: uri,
        jQuery: true,
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                var $ = res.$;
                var meiziSql = '';
                $('li > span ').each(function (index, item) {
                    let data = $(item).find('a').text()
                    console.log(data)
                    var href = $(item).attr('href'); // 获取路径uri
                    console.log(uri)
                    console.log(href)
                    //         var regexp = /[0-9]+/g;
                    //         var artice_id = href.match(regexp)[0]; // 获取文章ID
                    //         var title = $(item).children('img').attr('alt');
                    //         title = title.replace(/<[^>]+>/g, ""); // 去掉 <b></b> 标签
                    //         var src = $(item).children('img').attr('src');
                    //         var create_time = new Date().getTime();
                    //         // if (href == 'http://www.meizitu.com/a/3900.html') {
                    //         //     title = title.replace(/'/g, '');  // 这个的标题多了一个 单引号， mysql在插入的时候存在问题，所以这样处理了一下
                    //         // }
                    //         var values = "'" + artice_id + "'" + ','
                    //             + "'" + title + "'" + ','
                    //             + "'" + href + "',"
                    //             + "'" + src + "'" + ','
                    //             + "'" + create_time + "'";
                    //         meiziSql = meiziSql + 'insert ignore into meizitu_all(artice_id,title,href,src,create_time) VALUES(' + values + ');';
                    //     })
                    //     pool.getConnection(function (err, connection) {
                    //         if (err) {
                    //             console.log('数据库连接失败', i);
                    //         }
                    //         connection.query(meiziSql, function (err, results) {
                    //             connection.release();
                    //             if (err) {
                    //                 console.log(err, i);
                    //             } else {
                    //                 console.log('插入成功', i);
                    //             }
                    //         })
                })
            }
            done();
        }

    }]);
}

// downloadContent(1)
main()
