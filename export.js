// ==UserScript==
// @name             豆瓣读书+电影+音乐+游戏+舞台剧导出工具
// @namespace        https://ulyc.github.io/
// @version          0.1.1
// @description      将【读过/看过/听过/玩过】的 【读书/电影/音乐/游戏/舞台剧】条目分别导出为 csv 文件
// @author           ulyc
// @match            https://book.douban.com/people/*/collect*
// @match            https://movie.douban.com/people/*/collect*
// @match            https://music.douban.com/people/*/collect*
// @match            https://www.douban.com/location/people/*/drama/collect*
// @match            https://*.douban.com/people/*
// @require          https://unpkg.com/dexie@latest/dist/dexie.js
// @grant            none
// @original-script  https://greasyfork.org/en/scripts/420999-%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6-%E7%94%B5%E5%BD%B1-%E9%9F%B3%E4%B9%90-%E6%B8%B8%E6%88%8F-%E8%88%9E%E5%8F%B0%E5%89%A7%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7
// @original-license MIT
// ==/UserScript==


(function () {
    'use strict';
    let MOVIE = 'movie', BOOK = 'book', MUSIC = 'music', GAME = 'game', DRAMA = 'drama', people;
    const commonItem = "++id, cover, title, rating, rating_date, comment,";

    /* global $, Dexie */

    function getExportLink(type, people) {
        return 'https://' + type + '.douban.com/people/' + people + '/collect?start=0&sort=time&mode=grid&rating=all&export=1';
    }

    function getGameExportLink(people) { // type=game
        return 'https://www.douban.com/people/' + people + '/games?action=collect&start=0&export=1';
    }

    function getDramaExportLink(people) { // type=drama
        return 'https://www.douban.com/location/people/' + people + '/drama/collect?start=0&sort=time&mode=grid&rating=all&export=1';
    }


    function addButton(type, people, isGeneral) {
        let typeElement;
        if (isGeneral) {
            typeElement = $('#' + type + ' h2 .pl a:last');
        } else {
            typeElement = $('#db-' + type + '-mine h2:contains(过)  .pl');
        }
        switch (type) {
            case BOOK:
                typeElement.after('&nbsp;·&nbsp;<a href="' + getExportLink(type, people) + '">导出读过的书</a>');
                break;
            case MOVIE:
                typeElement.after('&nbsp;·&nbsp;<a href="' + getExportLink(type, people) + '">导出看过的片</a>');
                break;
            case MUSIC:
                typeElement.after('&nbsp;·&nbsp;<a href="' + getExportLink(type, people) + '">导出听过的碟</a>');
                break;
            case GAME:
                typeElement.after('&nbsp;·&nbsp;<a href="' + getGameExportLink(people) + '">导出玩过的游戏</a>');
                break;
            case DRAMA:
                typeElement.after('&nbsp;·&nbsp;<a href="' + getDramaExportLink(people) + '">导出看过的舞台剧</a>');
                break;
            default:
                return;
        }
    }

    function getType() {
        let type = location.hostname.split(".")[0];

        if (type === "www") {
            if (location.pathname.indexOf('games') > -1) {
                type = GAME;
            }
            if (location.pathname.indexOf('drama') > -1) {
                type = DRAMA;
            }
        }
        return type;
    }

    // 根据hostname判断type
    // 加入导出按钮
    if (location.href.indexOf('douban.com') > -1 && location.href.indexOf('export=1') < 0) {
        let match;
        let type = getType();
        if (type === DRAMA) {
            match = location.pathname.match(/location\/people\/([^/]+)\//);
        } else {
            match = location.pathname.match(/people\/([^/]+)\//);
        }
        people = match ? match[1] : null;
        if (!people) {
            return
        }

        if (type === "www") {
            addButton(BOOK, people, true);
            addButton(MOVIE, people, true);
            addButton(MUSIC, people, true);
            addButton(GAME, people, true);
            addButton(DRAMA, people, true);
        } else {
            addButton(type, people, false);
        }
    }

    if (location.href.indexOf('export=1') > -1) {
        let type = getType();
        if ([DRAMA, GAME, BOOK, MUSIC, MOVIE].indexOf(type) < 0) {
            alert("类型错误，请检查路径")
            return;
        }

        init(type);
    }


    function escapeQuote(str) {
        return str.replaceAll('"', '""'); // " need to be replaced with two quotes to escape inside csv quoted string
    }

    // 获取当前页数据
    function getCurPageItems(type) {
        var items = [];
        var elems = $('.grid-view .item');

        if (type === GAME) {
            elems = $('.game-list .common-item');
        } else if (type === BOOK) {
            elems = $('.interest-list .subject-item');
        }

        elems.each(function (index) {
            let item = {
                title: "",
                rate: 5,
                comment: "",
                cover: escapeQuote($(this).find('.pic img').attr('src').trim()),
                'rating_date': $(this).find('.date').text().trim().replaceAll('-', '/'), // 2020-07-17 => 2020/07/17
            };

            getTitleAndLink($(this), item, type);
            //兼容被封图书项目，电影被封项目似乎不展示
            if (item.cover.indexOf("book-default-lpic") > -1 && item.title.indexOf("未知") > -1) {
                item.title = "被封禁的图书";
                item.rate = 5;
                item.comment = "无";
                item.author = "佚名";
                item.release_date = "1984/01/01";
                items[index] = item;
            } else {
                getRate($(this), item, type);
                getComment($(this), item, type);
                getExtraInfo($(this), item, type, index);
            }

        });
        return items;

        function getTitleAndLink(elem, item, type) {
            if (type === BOOK) {
                item.title = escapeQuote(elem.find('.info a').attr("title").trim());
                item.link = elem.find('.info a').attr("href").trim();
            } else {
                item.title = escapeQuote(elem.find('.title a').text().trim());
                item.link = elem.find('.title a').attr('href').trim();
            }
        }

        function getRate(elem, item, type) {
            // 获取 评分
            if (type === GAME) {
                let rating = elem.find('.rating-info .rating-star').attr('class');
                rating = rating
                    ? (rating.slice(19, 20) === 'N' ? '' : Number(rating.slice(19, 20)))
                    : '';
                item.rating = rating;
            } else {
                let rating = elem.find('.date')[0].previousElementSibling;
                if (rating) {
                    rating = $(rating).attr('class').slice(6, 7);
                }
                item.rating = rating ? Number(rating) : '';
            }
        }

        function getComment(elem, item, type) {
            let co = elem.find('.comment');
            if (co.length) {
                co = co[0];
                item.comment = escapeQuote(co.textContent.trim());
            } else if (type === GAME) {
                co = elem.find('.user-operation');
                if (co.length) {
                    co = co[0];
                    item.comment = co.previousElementSibling.textContent.trim();
                    item.comment = escapeQuote(item.comment);
                }
            } else if (type === DRAMA || type === MUSIC) {
                co = elem.find('ul li:last');
                item.comment = escapeQuote(co.text().trim());
            }
        }

        function getExtraInfo(elem, item, type, index) {
            let extra;
            if (type === GAME) {
                extra = elem.find('.desc')[0].firstChild.textContent.trim();
                item.release_date = extra.split(' / ').slice(-1)[0];
                items[index] = item;
                return; // for type=game, here is over
            } else if (type === DRAMA) {
                extra = elem.find('.intro')[0].textContent.trim();
                item.mixed_info = extra;
                items[index] = item;
                return; // for type=drama, here is over
            }
            switch (type) {
                case GAME:
                    extra = elem.find('.desc')[0].firstChild.textContent.trim();
                    item.release_date = extra.split(' / ').slice(-1)[0];
                    items[index] = item;
                    return; // for type=game, here is over
                case DRAMA:
                    extra = elem.find('.intro')[0].textContent.trim();
                    item.mixed_info = extra;
                    items[index] = item;
                    return; // for type=drama, here is over
                case MOVIE:
                    extra = elem.find('.intro').text().split(' / ')[0];
                    let res = extra.match(/^(\d{4}-\d{2}-\d{2})\((.*)\)$/);
                    if (res) {
                        item.release_date = res[1].replaceAll('-', '/');
                        item.country = res[2];
                    }
                    return;
                case MUSIC:
                case BOOK:
                    let className = type === BOOK ? 'pub' : 'intro';
                    extra = elem.find('.' + className).text().split(' / ');
                    // 不一定有准确日期，可能是 2009-5 这样的, 也可能就只有年份 2000
                    let dateReg = /\d{4}(?:-\d{1,2})?(?:-\d{1,2})?/;
                    if (!dateReg.test(extra[0])) { // extra 首项非日期，则一般为作者或音乐家
                        let author = escapeQuote(extra[0]);
                        item.musician = item.author = author;
                    }
                    let d = extra.filter(function (txt) {
                        return dateReg.test(txt);
                    });
                    if (d.length) {
                        item.release_date = d[0].replaceAll('-', '/');
                    }
                    break;
            }

            items[index] = item;
        }

    }

    function getDBItems(type) {
        let items;
        switch (type) {
            case MOVIE:
                items = commonItem + ' release_date, country, link';
                break;
            case MUSIC:
                items = commonItem + ' release_date, author, link';
                break;
            case BOOK:
                items = commonItem + ' release_date, author, link';
                break;
            case GAME:
                items = commonItem + ' release_date, link';
                break;
            case DRAMA:
                items = commonItem + ' mixed_info, link';
                break;
        }
        return items;
    }

    function init(type) {
        const db = new Dexie('db_export'); // init indexedDB
        let dbItems = getDBItems(type);
        db.version(1).stores({
            items: dbItems
        });

        const items = getCurPageItems(type);
        db.items.bulkAdd(items).then(function () {
            console.log('添加成功+', items.length);

            let nextPageLink = $('.paginator span.next a').attr('href');
            if (nextPageLink) {
                nextPageLink = nextPageLink + '&export=1';
                window.location.href = nextPageLink;
            } else {
                exportAll(type);
            }
        }).catch(function (error) {
            console.error("Ooops: " + error);
        });
    }

    function exportAll(type) {
        const db = new Dexie('db_export');
        let items = getDBItems(type);

        db.version(1).stores({
            items: items
        });
        db.items.orderBy('rating_date').reverse().toArray().then(function (all) {
            all = all.map(function (item) {
                delete item.id;
                return item;
            });

            let title = ['封面', '标题', '个人评分', '打分日期', '我的短评'];
            let key = ['cover', 'title', 'rating', 'rating_date', 'comment', 'release_date'];
            if (type === MOVIE) {
                title = title.concat(['上映日期', '制片国家', '条目链接']);
                key = key.concat(['country', 'link']);
            } else if (type === BOOK) {
                title = title.concat(['出版日期', '作者', '条目链接']);
                key = key.concat(['author', 'link']);
            } else if (type === MUSIC) {
                title = title.concat(['发行日期', '音乐家', '条目链接']);
                key = key.concat(['musician', 'link']);
            } else if (type === GAME) {
                title = title.concat(['发行日期', '条目链接']);
                key.push('link');
            } else if (type === DRAMA) {
                title = title.concat(['混合信息', '条目链接']);
                key.pop();
                key = key.concat(['mixed_info', 'link']);
            }

            JSonToCSV.setDataConver({
                data: all,
                fileName: 'db-' + type + '-' + new Date().toISOString().split('T')[0].replaceAll('-', ''),
                columns: {title, key},
            });
            db.delete();
        });
    }

    // 导出CSV函数
    // https://github.com/liqingzheng/pc/blob/master/JsonExportToCSV.js
    var JSonToCSV = {
        /*
         * obj是一个对象，其中包含有：
         * ## data 是导出的具体数据
         * ## fileName 是导出时保存的文件名称 是string格式
         * ## showLabel 表示是否显示表头 默认显示 是布尔格式
         * ## columns 是表头对象，且title和key必须一一对应，包含有
              title:[], // 表头展示的文字
              key:[], // 获取数据的Key
              formatter: function() // 自定义设置当前数据的 传入(key, value)
         */
        setDataConver: function (obj) {
            var bw = this.browser();
            if (bw['ie'] < 9) return; // IE9以下的
            var data = obj['data'],
                ShowLabel = typeof obj['showLabel'] === 'undefined' ? true : obj['showLabel'],
                fileName = (obj['fileName'] || 'UserExport') + '.csv',
                columns = obj['columns'] || {
                    title: [],
                    key: [],
                    formatter: undefined
                };
            ShowLabel = typeof ShowLabel === 'undefined' ? true : ShowLabel;
            var row = "",
                CSV = '',
                key;
            // 如果要现实表头文字
            if (ShowLabel) {
                // 如果有传入自定义的表头文字
                if (columns.title.length) {
                    columns.title.map(function (n) {
                        row += n + ',';
                    });
                } else {
                    // 如果没有，就直接取数据第一条的对象的属性
                    for (key in data[0]) row += key + ',';
                }
                row = row.slice(0, -1); // 删除最后一个,号，即a,b, => a,b
                CSV += row + '\r\n'; // 添加换行符号
            }
            // 具体的数据处理
            data.map(function (n) {
                row = '';
                // 如果存在自定义key值
                if (columns.key.length) {
                    columns.key.map(function (m) {
                        row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(m, n[m]) || n[m] || '' : n[m] || '') + '",';
                    });
                } else {
                    for (key in n) {
                        row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(key, n[key]) || n[key] || '' : n[key] || '') + '",';
                    }
                }
                row.slice(0, row.length - 1); // 删除最后一个,
                CSV += row + '\r\n'; // 添加换行符号
            });
            if (!CSV) return;
            this.SaveAs(fileName, CSV);
        },
        SaveAs: function (fileName, csvData) {
            var bw = this.browser();
            if (!bw['edge'] || !bw['ie']) {
                var alink = document.createElement("a");
                alink.id = "linkDwnldLink";
                alink.href = this.getDownloadUrl(csvData);
                document.body.appendChild(alink);
                var linkDom = document.getElementById('linkDwnldLink');
                linkDom.setAttribute('download', fileName);
                linkDom.click();
                document.body.removeChild(linkDom);
            } else if (bw['ie'] >= 10 || bw['edge'] == 'edge') {
                var _utf = "\uFEFF";
                var _csvData = new Blob([_utf + csvData], {
                    type: 'text/csv'
                });
                navigator.msSaveBlob(_csvData, fileName);
            } else {
                var oWin = window.top.open("about:blank", "_blank");
                oWin.document.write('sep=,\r\n' + csvData);
                oWin.document.close();
                oWin.document.execCommand('SaveAs', true, fileName);
                oWin.close();
            }
        },
        getDownloadUrl: function (csvData) {
            var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
            if (window.Blob && window.URL && window.URL.createObjectURL) {
                csvData = new Blob([_utf + csvData], {
                    type: 'text/csv'
                });
                return URL.createObjectURL(csvData);
            }
            // return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
        },
        browser: function () {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.indexOf('edge') !== -1 ? Sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
                (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            return Sys;
        }
    };

})();
