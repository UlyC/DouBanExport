# DouBanExport
豆瓣导出插件

[原文链接](https://ulyc.github.io/2022/02/11/Douban-Escape-Plan/)
## 背景

![image-20220109161018087](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/image-20220109161018087.png)

最初的豆瓣还是很理想主义的，有点像书影音类的维基百科，所有人编辑贡献条目，开放的API提供给所有人使用，拥抱开放，回馈开放。

可惜事情起了变化，互联网变得愈加封闭，豆瓣也不例外：
- 2018 年 9 月 [豆瓣开放平台下线](<[https://www.v2ex.com/t/485687](https://www.v2ex.com/t/485687)>)
- 2019 年 4 月 [豆瓣的图书 api 无法使用](https://www.zhihu.com/question/316761965)
- 2020年 各电影 api 无法使用

又由于越来越多的不可抗力，越来越多的豆瓣书影音条目被删除消失，也有越来越多的豆瓣账号炸号。

不过“大事已不可问，我辈且看春光”，豆瓣的反爬只会越来越严格，奉劝诸君有意的尽快备份了罢。
## 关于
禀着不重复造轮子的原则，在写这个项目之前，我使用了[豆瓣跑路计划](https://www.notion.so/952c54f01d3d462b804e194ebc1f4a9d) 和[豆瓣读书+电影+音乐+游戏+舞台剧导出工具](https://zhuzi.dev/2021/06/05/douban-backup-sync-notion/)  ，但是都不太符合我的需求。

前者导致我账号被封，而且数据也没爬下来。
后者对于有些用户必须登录，而且导出的数据缺少封面信息，~~不利于装逼~~。

另外 [豆伴](https://blog.doufen.org/posts/tofu-user-guide/)项目看起来不错，不过我没有Chrome浏览器，而且需要登录，又有封号风险，我个人不需要导出太多数据，所以没有尝试。

对我来说最好用的其实是[豆瓣读书+电影+音乐+游戏+舞台剧导出工具](https://zhuzi.dev/2021/06/05/douban-backup-sync-notion/) ，作者思路很强（不去爬取条目详情页，防止触发反爬），爬取速度快，除了无法导出封面，各方面都不错。

所以本项目是基于[豆瓣读书+电影+音乐+游戏+舞台剧导出工具](https://zhuzi.dev/2021/06/05/douban-backup-sync-notion/) 改造而成。

### Feature
1.  无需登录
2.  跨平台，有浏览器就能用，无需自己折腾环境
3. 支持导出  看/读/玩/听  过的  电影 舞台剧/图书/游戏/音乐 为csv文件
4. 导出数据含有封面
5. 提供简单的Notion模板

### Demo
**导出的数据**：
![](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/Pasted%20image%2020220211180338.png)

**Notion[页面](https://enchanting-cobra-930.notion.site/bf80b6b22bca446d9bd1e817d314cb0e)**：

**Table格式**：

![](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/Pasted%20image%2020220211181154.png)
**Gallery**格式：
![](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/Pasted%20image%2020220211181412.png)

### TODO：
~~如果还继续更新的话~~
- [ ] 支持导出 想/在  读 /看/玩/听 的数据
- [ ] 增加一键导出以上所有数据


## 导出

### 安装浏览器 脚本管理器 插件
基本上有两种选择
- **Tampermonkey**   油猴
  2.9版本以后就不开源了，而且有很多安全问题（比如会自动禁用CSP），不是很推荐。
  不过使用人数最多，知名度最广，如果你已经在使用了就用它就行。
- [Violentmonkey](https://violentmonkey.github.io/)  暴力猴
  完全开源，又安全的脚本管理器插件，如果你之前没有使用过它，强烈推荐你使用暴力猴。

### 安装脚本
访问[这里](https://greasyfork.org/en/scripts/439867-%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6-%E7%94%B5%E5%BD%B1-%E9%9F%B3%E4%B9%90-%E6%B8%B8%E6%88%8F-%E8%88%9E%E5%8F%B0%E5%89%A7%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7)


### 访问主页并导出

#### 通用主页
不登录访问自己的通用主页大致有这几种方法：
1. 如果你知道你的豆瓣id 直接访问

https://www.douban.com/people/{你的豆瓣id}

2. 如果手机登录了app，在个人主页，选择**推荐**- **复制链接** ，在安装了脚本的浏览器打开
3. 如果可以在[这里](https://www.douban.com/search)搜索自己的昵称
4. 搜索引擎 搜索自己的 昵称  + site: douban.com

如果你可以直接访问，那很幸运，可以看到自己的豆瓣页面上多出几个链接：

![](https://zhuzi.dev/assets/images/douban-backup-monkey-script.png)

直接点击，会自动开始导出，可能需要一点时间，中途不要做其他操作，完成后会弹出csv文件的下载提示。 然后下面的可以不用看，直接跳转到 [迁移][#迁移] 一节继续。


不过一些老用户如果没登录似乎不让直接访问主页，会自动跳转到亲切的登录页：

![](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/Pasted%20image%2020220117204859.png)

不过也不怕，往下看。

#### 其他主页
虽然豆瓣限制了未登录用户 访问 个别的个人主页，但是目前（2022.01.17） 还没有限制访问 单个子项目的主页。

注： 豆瓣ID就是你主页的最后一串数字
##### 豆瓣电影主页
```
https://movie.douban.com/people/{你的豆瓣id}
```
![](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/Pasted%20image%2020220117211539.png)

点击标记的链接即可自动开始导出，图书音乐等同理，地址如下：

##### 豆瓣读书主页
```
https://book.douban.com/people/
```

##### 豆瓣音乐主页
```
 https://music.douban.com/people/{你的豆瓣id}
```

##### 豆瓣游戏主页
```
https://www.douban.com/people/{你的豆瓣id}/games

```

##### 豆瓣舞台剧主页

```
https://www.douban.com/location/people/{你的豆瓣id}/drama
```


## 迁移到Notion

### 复制模板
如果自己有更好的模板可以跳过这步。

[**🎬电影 movie**](https://enchanting-cobra-930.notion.site/bf80b6b22bca446d9bd1e817d314cb0e?v=e0cbf230f1974e7e8b79291390cf0402)

**[📚图书 book](https://enchanting-cobra-930.notion.site/fa60e8b0044340489592bfc6a070fc18?v=fd9fcd94cbfc4b0ba051eda050bb8d2b)**

[**🎧音乐 music**](https://enchanting-cobra-930.notion.site/47f93d9d6a534ff7bbde5a32b7fc9ffc?v=97ce2baa617e46bcad129f539fbc5531)

[**👹 舞台剧**](https://enchanting-cobra-930.notion.site/b2df031e68ca4cc09bd3bf7797be7420?v=d3e0a6460e2848f7a086845ffdc33987)

[**🎮 游戏**](https://enchanting-cobra-930.notion.site/ec22dffba0d24cdea02932ff89650f89?v=09c84bd7d5884f5ea3976611bf798b0d)


### 导入
进入自己相应的note，选择刚刚导出的csv文件:
![](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/Pasted%20image%2020220211191502.png)


## 迁移到其他目的地
逃离豆瓣之后，我们还有其他选择吗？

大体有两种方向：
1.   自己维护
     1. 优点是数据完全自己掌控，更好的隐私保护
     2. 缺点是需要自己维护 书影音 数据
2.  使用其他更开放的服务
    1. 优点是不需要自己维护 书影音 数据
    2. 缺点是隐私和以后数据的迁移问题

### 自己维护
方案很多，有许多大佬自己使用excel维护，也不失为一种方案。

不过这里我只推荐上面Notion和下面Obsidian的方案：

#### Obsidian
这种方式更适合读书笔记比较多的用户。

效果图：
![](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/Pasted%20image%2020220211211748.png)
![](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/Pasted%20image%2020220211211459.png)

因为这种方法会搞乱我现在的知识库Vault，所以我没有使用这种方法。

这里说下大概的思路：
1.  可以使用[obsidian-kindle-plugin](https://github.com/hadynz/obsidian-kindle-plugin)将kindle的读书笔记导入Obsidian
2.  新的读书笔记设置好`YAML Front Matter`,使用Templater + Quikadd新建
3.  使用Dataview + Gallery 回顾统计和展示

用到的插件：Templater + Quikadd + Dataview + Gallery
如果对Obsidian管理读书记录的方式感兴趣，推荐这篇文章：[Obsidian工作流](https://lillian-who.github.io/2021/08/18/Obsidian%E5%B7%A5%E4%BD%9C%E6%B5%81/)


### 使用其他更开放的服务
推荐两个联邦宇宙相关的服务

#### [NeoDB](https://neodb.social/)

一个刚起步的[开源](https://github.com/alphatownsman/boofilsic/tree/neo)项目，需要先持有Maston或者Pleroma账号，可以标记书籍、电影、音乐和游戏，数据非常全面，除了豆瓣条目之外，还有GoogleBooks、Goodreads、Steam、Spotify、Bandcamp、IMDB、TMDB、Bangumi的数据。

目前支持导入自己的豆瓣数据，具体使用方法参见  [转移某网站书影音标记](https://zhuanlan.zhihu.com/p/412792462)。
似乎也可以方便地把自己的数据从NeoDB导出。

【注意】

1. 对于NeoDB授权风险的[讨论](https://bgme.me/@bgme/106941175247621946)，站长改进的进度可查看[站长主页](https://mastodon.social/@neodb)
2. 虽然代码开源，但是数据为站长私有，很多条目未登录的话是看不了的， 从这点看开放性不如当初的豆瓣。
3. 虽然账号系统依托于去中心化的联邦宇宙，但是本身并不是去中心化的，是站长一人在维持。



#### [BookWyrm](https://joinbookwyrm.com/)

江尚寒翻译为书蛊，与Mastodon（长毛象）同属联邦宇宙的一员，[开源](https://github.com/bookwyrm-social/bookwyrm)，自带社交功能，缺点是只能标记 书籍，未有电影和音乐等其他数据。

这里是已有的[中文书籍列表](https://bookwyrm.social/list/52)，条目还比较少，具体使用可以参见[“联邦宇宙”漫游指南（6）从douban到bookwyrm](https://jiangshanghan.art.blog/2021/07/24/%e8%81%94%e9%82%a6%e5%ae%87%e5%ae%99%e6%bc%ab%e6%b8%b8%e6%8c%87%e5%8d%97%ef%bc%886%ef%bc%89/)


## 同步（可选）

其实不太推荐这种方式，既然决心逃离豆瓣，就该彻底点。
但是有些用户可能还是割舍不掉豆瓣的便捷，毕竟目前还没有可以完全替代豆瓣的产品。

目前一个比较可行的方法是，使用 GitHub Actions 定时从 RSS 信息将豆瓣标记更新同步到 Notion:
1. [方法说明](https://zhuzi.dev/2021/06/05/douban-backup-sync-notion/)
2. [代码仓库](https://github.com/bambooom/douban-backup/blob/main/sync-rss.js)



## 最后

因为本工具爬取的并不是 具体条目页面，所以页面访问限制不太严格，只是导出自己的数据完全足够， 我测试时没有登录，大概测试数万条数据才开始限制IP。

![image-20220110180810931](https://raw.githubusercontent.com/UlyC/UlyC.github.io/image/img/post/image-20220110180810931.png)

但局限也很明显， 就是这里无法准确获取更多有关条目本身的信息，比如电影条目的 IMDb 链接、制片国家，也无法精准把导演和演员之类的人名区分开。

如果有能力的同学可以参考下面的API做更强大的功能：

#### 电影API

只找到一个可以使用的项目，可以根据豆瓣Subject ID查询电影信息：
https://github.com/iiiiiii1/douban-imdb-api

```
https://api.wmdb.tv/movie/api?id=doubanid
```
如果需要电影条目更详尽的信息，可以使用这个API自己写程序补全。

#### 图书API

如果能得到图书的ISBN号，可以调取这两个项目的API：

https://jike.xyz/api/isbn.html

https://github.com/qiaohaoforever/BambooIsbn

我最初的想法是先爬取图书条目的ISBN，然后从他处查询补全信息，但是从个人页面的条目信息无法获取，需要进入条目详情页才能得到，这样会触发反爬机制，遂作罢。
