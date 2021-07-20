# 简述

程序目的用来作为影视爱好者互相共享资源。由于本代码比较简陋，提供一个思路抛砖引玉，欢迎大家更改或重新优化。
私人珍藏是一个影视共享网站，类似BT共享，但有可以实时访问和无需中心节点。是基于一个分布式文件系统（IPFS）构建。它是一个去中心化网站系统，在系统上发布网站后，其他人可以在互联的任意节点都可以访问，具有抗审查、防止单点故障、无性能瓶颈等优点。
![image](https://github.com/mycollectclub/filesdown/blob/main/pic/home1.jpg)![image](https://github.com/mycollectclub/filesdown/blob/main/pic/home2.jpg)
视频网站登入后如上图所示，导航栏中有一个公共资源池，包含多个频道视频资源（比如电影、电视剧等），也可在此基础上按照自己喜好重新编排资源内容或添加入自己新视频，可以把自己的资源发布给其他人，也可以浏览其他人发布的资源池。如上两个图中，左边的为按照喜好编辑自己本地的内容，右边为公共池中的导航栏，也可增加其他人发布的内容。
可以修改开源的网站代码，建一个适合自己的网站，也可自己重新做一个。

# 安装
1）	下载

2）	复制到/usr/local/bin目录
3）	初始化
命令：ipfs init

# WEB网站使用说明
在手机浏览器输入API端口或geteway端口
http://XXX.XXX.XXX.XXX:5100
![image](https://github.com/mycollectclub/filesdown/blob/main/pic/menu.jpg)
![image](https://github.com/mycollectclub/filesdown/blob/main/pic/move.jpg)
![image](https://github.com/mycollectclub/filesdown/blob/main/pic/tv.jpg)
![image](https://github.com/mycollectclub/filesdown/blob/main/pic/search.jpg)
#可以编辑自己的视频资源
基于一个公共资源池，可以叠加自己的影视资源形成一个自己的整体资源池。也可以在原有的影片中添加不同分辨率的视频。可分享自己的资源池也可访问其他人分享的资源池。
![image](https://github.com/mycollectclub/filesdown/blob/main/pic/share.jpg)
![image](https://github.com/mycollectclub/filesdown/blob/main/pic/edit.jpg)
![image](https://github.com/mycollectclub/filesdown/blob/main/pic/pub.jpg)

#建自己个性化的网站
可以修改开源的网站代码，建一个适合自己的网站，也可根据需求按照这个思路重新做一个。




## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

